export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://weavehub-api.onrender.com/api/v1";

export const ENDPOINTS = {
  product: {
    search: "/products/search",
    publicSearch: "/products/search",
    all: "/products",
    product: (productId) => `/products/${productId}`,
    list: (categoryId) =>
      categoryId ? `/products?categoryId=${categoryId}` : "/products/search",
    attributes: (productId) => `/products/attributes/${productId}`,
  },
  category: {
    list: "/categories/",
    one: (id) => `/categories/${id}`,
  },
  recommendation: {
    trending: (page = 1, limit = 10) =>
      `/recommendations/trending?page=${page}&limit=${limit}`,
    related: (productId, page = 1, limit = 5) =>
      `/recommendations/${productId}/related?page=${page}&limit=${limit}`,
  },
  review: {
    list: (productId) => `/reviews/${productId}`,
  },
  comment: {
    list: (productId) => `/comments/?productId=${productId}`,
  },
  store: {
    get: (storeId) => `/stores/${storeId}`,
  },
};
