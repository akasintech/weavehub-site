import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { normalizeProduct } from "../utils/helpers";

function unwrapRecords(response) {
  return (
    response?.data?.data?.records ||
    response?.data?.data ||
    response?.data?.records ||
    response?.data?.products ||
    response?.data?.items ||
    (Array.isArray(response?.data) ? response.data : [])
  );
}

export async function getProducts(options = {}) {
  const { categoryId, search, categoriesList = [] } = options;
  const endpoint = ENDPOINTS.product.list(categoryId);

  const params = {};
  if (search && search.trim()) {
    params.name = search.trim();
  }

  const response = await apiClient.get(endpoint, { params });
  const rawItems = unwrapRecords(response);

  return Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeProduct(item, categoriesList))
    : [];
}

export async function getProductById(productId, categoriesList = []) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const response = await apiClient.get(ENDPOINTS.product.product(productId));
  const rawData = response?.data?.data || response?.data;

  if (!rawData) {
    throw new Error("Product data not found in response");
  }

  return normalizeProduct(rawData, categoriesList);
}

export async function searchProducts(query = "", categoriesList = []) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const response = await apiClient.get(ENDPOINTS.product.publicSearch, {
    params: {
      name: trimmed,
      query: trimmed,
      search: trimmed,
      q: trimmed,
    },
  });

  const rawItems = unwrapRecords(response);
  return Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeProduct(item, categoriesList))
    : [];
}

export async function getProductReviews(productId) {
  if (!productId) return [];
  try {
    const response = await apiClient.get(ENDPOINTS.review.list(productId));
    const body = response?.data?.data || response?.data || {};
    if (Array.isArray(body?.records)) return body.records;
    if (Array.isArray(body)) return body;
    return [];
  } catch {
    return [];
  }
}

export async function getProductComments(productId) {
  if (!productId) return [];
  try {
    const response = await apiClient.get(ENDPOINTS.comment.list(productId));
    const body = response?.data?.data || response?.data || {};
    if (Array.isArray(body?.records)) return body.records;
    if (Array.isArray(body)) return body;
    if (body && typeof body === "object" && (body._id || body.id)) return [body];
    return [];
  } catch {
    return [];
  }
}
