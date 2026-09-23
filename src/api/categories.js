import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { normalizeCategory } from "../utils/helpers";

function unwrapRecords(response) {
  return (
    response?.data?.data?.records ||
    response?.data?.data ||
    response?.data?.categories ||
    response?.data?.records ||
    response?.data?.items ||
    (Array.isArray(response?.data) ? response.data : [])
  );
}

export async function getCategories() {
  const response = await apiClient.get(ENDPOINTS.category.list);
  const rawItems = unwrapRecords(response);

  return Array.isArray(rawItems) ? rawItems.map(normalizeCategory) : [];
}

export async function getCategoryById(categoryId) {
  if (!categoryId) return null;

  const response = await apiClient.get(ENDPOINTS.category.one(categoryId));
  const rawData = response?.data?.data || response?.data;

  return rawData ? normalizeCategory(rawData) : null;
}
