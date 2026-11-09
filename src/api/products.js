import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { cachedRequest, TTL } from "./cache";
import {
  getProductPricing,
  normalizeComment,
  normalizeProduct,
  normalizeReview,
} from "../utils/helpers";

export const PAGE_SIZE = 24;

const DEALS_SCAN_LIMIT = 50;
const DEALS_SCAN_PAGES = 4;

/** Read the { data: { records, pagination } } list envelope. */
export function unwrapPage(response) {
  const body = response?.data?.data;
  const records = Array.isArray(body?.records) ? body.records : Array.isArray(body) ? body : [];
  const pagination = body?.pagination || {};
  return {
    records,
    pagination: {
      currentPage: Number(pagination.currentPage) || 1,
      hasNext: Boolean(pagination.hasNext),
      totalPages: Number(pagination.totalPages) || 0,
      totalRecords: Number(pagination.totalRecords ?? records.length) || 0,
    },
  };
}

function toProductPage(response, categoriesList, keep) {
  const { records, pagination } = unwrapPage(response);
  const items = records.map((item) => normalizeProduct(item, categoriesList));
  return { items: keep ? items.filter(keep) : items, pagination };
}

// Recommendation feeds can include drafts and products that have no variant
// yet. A shopper can't buy those, so they never reach a rail.
function isShoppable(product) {
  const active = !product.status || product.status === "active";
  return active && getProductPricing(product).price > 0;
}

export async function getProductsPage({
  page = 1,
  limit = PAGE_SIZE,
  categoryId,
  name,
  categoriesList = [],
  signal,
} = {}) {
  const params = { page, limit };
  if (categoryId) params.category = categoryId;
  if (name && name.trim()) params.name = name.trim();

  const response = await apiClient.get(ENDPOINTS.product.search, { params, signal });
  return toProductPage(response, categoriesList);
}

export async function getProductById(productId, { categoriesList = [], signal } = {}) {
  if (!productId) throw new Error("Product ID is required");

  const response = await apiClient.get(ENDPOINTS.product.one(productId), { signal });
  const rawData = response?.data?.data || response?.data;
  if (!rawData) throw new Error("Product data not found in response");

  return normalizeProduct(rawData, categoriesList);
}

export const productKey = (id) => `product:${id}`;

/** Warm the details cache on press so the details page usually opens with full data. */
export function prefetchProduct(productId) {
  if (!productId) return;
  cachedRequest(productKey(productId), (signal) => getProductById(productId, { signal }), {
    ttl: TTL.short,
  }).catch(() => {});
}

const seeds = new Map();

/** Remember a list item so its details page can paint immediately. */
export function rememberProduct(product) {
  if (!product?.id) return;
  seeds.delete(product.id);
  seeds.set(product.id, product);
  if (seeds.size > 200) seeds.delete(seeds.keys().next().value);
}

export function peekProduct(productId) {
  return seeds.get(productId) || null;
}

export async function getTrendingPage({ page = 1, limit = PAGE_SIZE, categoriesList = [], signal } = {}) {
  const response = await apiClient.get(ENDPOINTS.recommendation.trending, {
    params: { page, limit },
    signal,
  });
  return toProductPage(response, categoriesList, isShoppable);
}

export async function getRelatedProducts(productId, { limit = 12, signal } = {}) {
  const response = await apiClient.get(ENDPOINTS.recommendation.related(productId), {
    params: { page: 1, limit },
    signal,
  });
  return toProductPage(response, [], (p) => isShoppable(p) && p.id !== productId).items;
}

export async function getAlsoBoughtProducts(productId, { limit = 12, signal } = {}) {
  const response = await apiClient.get(ENDPOINTS.recommendation.alsoBought(productId), {
    params: { page: 1, limit },
    signal,
  });
  return toProductPage(response, [], (p) => isShoppable(p) && p.id !== productId).items;
}

/** Hero picks: same rule as the app. Featured or promoted first, otherwise the newest. */
export async function getFeaturedProducts({ signal } = {}) {
  const { items } = await getProductsPage({ page: 1, limit: PAGE_SIZE, signal });
  const featured = items.filter(
    (p) =>
      p.isFeatured ||
      p.isPromoted ||
      p.raw?.store?.isPlatformStore === true ||
      p.storeName?.toLowerCase().includes("weavehub")
  );
  const pool = featured.length ? featured : items;
  return pool.filter((p) => p.image).slice(0, 6);
}

/** Real discounts only, biggest first, across the newest products and trending. */
export async function getDeals({ signal } = {}) {
  const pool = [];

  for (let page = 1; page <= DEALS_SCAN_PAGES; page += 1) {
    const { items, pagination } = await getProductsPage({ page, limit: DEALS_SCAN_LIMIT, signal });
    pool.push(...items);
    if (!pagination.hasNext) break;
  }

  const trending = await getTrendingPage({ page: 1, limit: DEALS_SCAN_LIMIT, signal });
  pool.push(...trending.items);

  const seen = new Set();
  return pool
    .filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return getProductPricing(p).discountPct > 0;
    })
    .sort((a, b) => getProductPricing(b).discountPct - getProductPricing(a).discountPct);
}

export async function getStoreProductsPage(storeId, { page = 1, limit = PAGE_SIZE, signal } = {}) {
  const response = await apiClient.get(ENDPOINTS.product.byStore(storeId), {
    params: { page, limit },
    signal,
  });
  return toProductPage(response, []);
}

export async function getReviewsPage(productId, { page = 1, limit = 10, signal } = {}) {
  const response = await apiClient.get(ENDPOINTS.review.list(productId), {
    params: { page, limit },
    signal,
  });
  const { records, pagination } = unwrapPage(response);
  return { items: records.map(normalizeReview), pagination };
}

export async function getCommentsPage(productId, { page = 1, limit = 10, signal } = {}) {
  const response = await apiClient.get(ENDPOINTS.comment.list, {
    params: { productId, page, limit },
    signal,
  });
  const { records, pagination } = unwrapPage(response);
  return { items: records.map(normalizeComment), pagination };
}
