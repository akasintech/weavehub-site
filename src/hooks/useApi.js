import { useCallback, useEffect, useRef, useState } from "react";
import { cachedRequest, isAbortError, isFresh, readCache, TTL, writeCache } from "../api/cache";
import { getCategories } from "../api/categories";

function initialQueryState(key, enabled, ttl) {
  const entry = key ? readCache(key) : null;
  return {
    key,
    data: entry ? entry.value : undefined,
    error: null,
    loading: Boolean(enabled && key && !isFresh(entry, ttl)),
  };
}

/**
 * One async resource, keyed. Paints synchronously from cache when it can,
 * shows stale data while it refreshes, and ignores responses for an old key.
 * `error` is only set when there is nothing to show.
 */
export function useQuery(key, fetcher, { enabled = true, ttl = TTL.default } = {}) {
  const [state, setState] = useState(() => initialQueryState(key, enabled, ttl));
  const [nonce, setNonce] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const lastNonce = useRef(0);

  useEffect(() => {
    if (!enabled || !key) {
      setState({ key, data: undefined, error: null, loading: false });
      return undefined;
    }

    const isRetry = nonce !== lastNonce.current;
    lastNonce.current = nonce;
    const entry = readCache(key);

    if (!isRetry && isFresh(entry, ttl)) {
      setState({ key, data: entry.value, error: null, loading: false });
      return undefined;
    }

    const controller = new AbortController();
    setState({ key, data: entry ? entry.value : undefined, error: null, loading: true });

    cachedRequest(key, (signal) => fetcherRef.current(signal), {
      ttl,
      force: true,
      signal: controller.signal,
    }).then(
      (data) => {
        if (!controller.signal.aborted) setState({ key, data, error: null, loading: false });
      },
      (error) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setState((prev) => ({
          key,
          data: prev.key === key ? prev.data : undefined,
          error,
          loading: false,
        }));
      }
    );

    return () => controller.abort();
  }, [key, enabled, ttl, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  // During the render right after a key change, the state still holds the old key.
  const view = state.key === key ? state : initialQueryState(key, enabled, ttl);
  const hasData = view.data !== undefined;

  return {
    data: view.data,
    loading: view.loading && !hasData,
    refreshing: view.loading && hasData,
    error: hasData ? null : view.error,
    refetch,
  };
}

const dedupeById = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const listKey = (key) => `list:${key}`;

function initialListState(key, enabled, ttl) {
  const entry = key ? readCache(listKey(key)) : null;
  return {
    key,
    items: entry ? entry.value.items : [],
    page: entry ? entry.value.page : 0,
    pagination: entry ? entry.value.pagination : null,
    loading: Boolean(enabled && key && !entry),
    loadingMore: false,
    error: null,
    moreError: null,
    ttl,
  };
}

/**
 * A paginated list, keyed. Every loaded page is remembered, so returning to a
 * long list restores it in full. A key change aborts whatever was in progress.
 */
export function usePagedList(key, fetchPage, { enabled = true, ttl = TTL.default } = {}) {
  const [state, setState] = useState(() => initialListState(key, enabled, ttl));
  const [nonce, setNonce] = useState(0);
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;
  const stateRef = useRef(state);
  stateRef.current = state;
  const moreController = useRef(null);
  const lastNonce = useRef(0);

  useEffect(() => {
    moreController.current?.abort();

    if (!enabled || !key) {
      setState({ ...initialListState(null, false, ttl), key });
      return undefined;
    }

    const isRetry = nonce !== lastNonce.current;
    lastNonce.current = nonce;
    const entry = readCache(listKey(key));

    if (!isRetry && isFresh(entry, ttl)) {
      setState({ ...initialListState(key, enabled, ttl), loading: false });
      return undefined;
    }

    const controller = new AbortController();
    setState({ ...initialListState(key, enabled, ttl), loading: !entry });

    cachedRequest(`${key}|p1`, (signal) => fetchRef.current({ page: 1, signal }), {
      ttl,
      force: true,
      signal: controller.signal,
    }).then(
      (result) => {
        if (controller.signal.aborted) return;
        // Stale list on screen: refresh the top without dropping later pages.
        const previous = readCache(listKey(key))?.value;
        const next = previous
          ? {
              items: dedupeById([...result.items, ...previous.items]),
              page: previous.page,
              pagination: previous.pagination,
            }
          : { items: dedupeById(result.items), page: 1, pagination: result.pagination };
        writeCache(listKey(key), next);
        setState((prev) => ({ ...prev, ...next, key, loading: false, error: null }));
      },
      (error) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setState((prev) => ({ ...prev, key, loading: false, error: prev.items.length ? null : error }));
      }
    );

    return () => controller.abort();
  }, [key, enabled, ttl, nonce]);

  useEffect(() => () => moreController.current?.abort(), []);

  const hasNext = Boolean(state.key === key && state.pagination?.hasNext);

  const loadMore = useCallback(() => {
    const current = stateRef.current;
    if (current.key !== key || current.loading || current.loadingMore || !current.pagination?.hasNext) return;

    const controller = new AbortController();
    moreController.current = controller;
    const nextPage = current.page + 1;
    setState((prev) => ({ ...prev, loadingMore: true, moreError: null }));

    cachedRequest(`${key}|p${nextPage}`, (signal) => fetchRef.current({ page: nextPage, signal }), {
      ttl,
      signal: controller.signal,
    }).then(
      (result) => {
        if (controller.signal.aborted) return;
        setState((prev) => {
          const next = {
            items: dedupeById([...prev.items, ...result.items]),
            page: nextPage,
            pagination: result.pagination,
          };
          writeCache(listKey(key), next);
          return { ...prev, ...next, loadingMore: false };
        });
      },
      (error) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setState((prev) => ({ ...prev, loadingMore: false, moreError: error }));
      }
    );
  }, [key, ttl]);

  const retry = useCallback(() => setNonce((n) => n + 1), []);

  const view = state.key === key ? state : initialListState(key, enabled, ttl);

  return {
    items: view.items,
    page: view.page,
    total: view.pagination?.totalRecords ?? view.items.length,
    hasNext,
    loading: view.loading && view.items.length === 0,
    loadingMore: view.loadingMore,
    error: view.items.length ? null : view.error,
    moreError: view.moreError,
    loadMore,
    retry,
  };
}

export function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useCategories() {
  return useQuery("categories", (signal) => getCategories({ signal }), { ttl: TTL.long });
}
