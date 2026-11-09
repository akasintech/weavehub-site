// Small in-memory client cache with in-flight de-duplication.
// Lives for the page session, so navigating back renders from memory instantly.

export const TTL = {
  short: 60 * 1000,
  default: 3 * 60 * 1000,
  long: 10 * 60 * 1000,
};

const MAX_ENTRIES = 300;
const entries = new Map();
const inflight = new Map();

export function readCache(key) {
  return entries.get(key) || null;
}

export function writeCache(key, value) {
  entries.delete(key);
  entries.set(key, { value, at: Date.now() });
  if (entries.size > MAX_ENTRIES) entries.delete(entries.keys().next().value);
}

export function isFresh(entry, ttl = TTL.default) {
  return Boolean(entry) && Date.now() - entry.at < ttl;
}

export function createAbortError() {
  const error = new Error("Request canceled");
  error.name = "AbortError";
  return error;
}

export function isAbortError(error) {
  return error?.name === "AbortError" || error?.name === "CanceledError";
}

/**
 * Join (or start) the shared request for `key`.
 * The underlying request is only aborted once every subscriber has gone. The
 * abort is deferred a tick so a remount can pick the same request back up.
 */
function joinFlight(key, fetcher, signal) {
  let flight = inflight.get(key);

  if (!flight) {
    const controller = new AbortController();
    flight = { controller, subscribers: 0, promise: null };
    const current = flight;
    current.promise = Promise.resolve()
      .then(() => fetcher(controller.signal))
      .then((value) => {
        if (!controller.signal.aborted) writeCache(key, value);
        return value;
      })
      .finally(() => {
        if (inflight.get(key) === current) inflight.delete(key);
      });
    // Subscribers each attach their own handlers; this only prevents an
    // unhandled-rejection warning when the last one has already left.
    current.promise.catch(() => {});
    inflight.set(key, current);
  }

  const active = flight;
  active.subscribers += 1;

  return new Promise((resolve, reject) => {
    let settled = false;

    const leave = () => {
      active.subscribers -= 1;
      if (active.subscribers > 0) return;
      setTimeout(() => {
        if (active.subscribers === 0 && inflight.get(key) === active) {
          inflight.delete(key);
          active.controller.abort();
        }
      }, 0);
    };

    const onAbort = () => {
      if (settled) return;
      settled = true;
      leave();
      reject(createAbortError());
    };

    if (signal?.aborted) {
      onAbort();
      return;
    }
    signal?.addEventListener("abort", onAbort, { once: true });

    active.promise.then(
      (value) => {
        if (settled) return;
        settled = true;
        active.subscribers -= 1;
        signal?.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error) => {
        if (settled) return;
        settled = true;
        active.subscribers -= 1;
        signal?.removeEventListener("abort", onAbort);
        reject(error);
      }
    );
  });
}

/** Resolve from cache when fresh, otherwise share one network request per key. */
export function cachedRequest(key, fetcher, { ttl = TTL.default, force = false, signal } = {}) {
  if (!force) {
    const entry = readCache(key);
    if (isFresh(entry, ttl)) return Promise.resolve(entry.value);
  }
  return joinFlight(key, fetcher, signal);
}
