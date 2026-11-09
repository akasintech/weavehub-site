import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { cachedRequest, TTL } from "./cache";
import { unwrapPage } from "./products";
import { normalizeStore } from "../utils/helpers";

const LOOKUP_LIMIT = 50;
const LOOKUP_MAX_PAGES = 20;

export async function getStoresPage({ page = 1, limit = 24, signal } = {}) {
  const response = await apiClient.get(ENDPOINTS.store.list, {
    params: { page, limit },
    signal,
  });
  const { records, pagination } = unwrapPage(response);
  return { items: records.map(normalizeStore), pagination };
}

/**
 * GET /stores/:id needs a token, so a store is found by paging the public list.
 * Resolves to null when no public store has this id.
 */
export async function findStoreById(storeId, { signal } = {}) {
  if (!storeId) return null;

  for (let page = 1; page <= LOOKUP_MAX_PAGES; page += 1) {
    const result = await cachedRequest(
      `stores:lookup:${page}`,
      (innerSignal) => getStoresPage({ page, limit: LOOKUP_LIMIT, signal: innerSignal }),
      { ttl: TTL.long, signal }
    );
    const match = result.items.find((store) => store.id === storeId);
    if (match) return match;
    if (!result.pagination.hasNext) return null;
  }
  return null;
}
