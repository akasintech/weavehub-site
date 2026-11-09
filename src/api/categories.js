import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { unwrapPage } from "./products";
import { normalizeCategory } from "../utils/helpers";

export async function getCategories({ signal } = {}) {
  const response = await apiClient.get(ENDPOINTS.category.list, { signal });
  const { records } = unwrapPage(response);
  return records.filter((item) => item?.isActive !== false).map(normalizeCategory);
}

export async function getCategoryById(categoryId, { signal } = {}) {
  if (!categoryId) return null;

  const response = await apiClient.get(ENDPOINTS.category.one(categoryId), { signal });
  const rawData = response?.data?.data || response?.data;

  return rawData ? normalizeCategory(rawData) : null;
}
