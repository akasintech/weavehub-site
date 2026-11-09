const FALLBACK_API_URL = "https://weavehub-api-w0l4.onrender.com/api/v1";

// The configured value may be just the host (".onrender.com") or the full
// versioned base. Every path below is relative to /api/v1, so make sure it's there.
function resolveBaseUrl(value) {
  const trimmed = String(value || "").trim().replace(/\/+$/, "");
  if (!trimmed) return FALLBACK_API_URL;
  return /\/api\/v\d+$/i.test(trimmed) ? trimmed : `${trimmed}/api/v1`;
}

export const API_BASE_URL = resolveBaseUrl(import.meta.env.VITE_API_URL);

export const ENDPOINTS = {
  product: {
    search: "/products/search",
    one: (productId) => `/products/${productId}`,
    byStore: (storeId) => `/products/stores/${storeId}`,
  },
  category: {
    list: "/categories/",
    one: (id) => `/categories/${id}`,
  },
  recommendation: {
    trending: "/recommendations/trending",
    related: (productId) => `/recommendations/${productId}/related`,
    alsoBought: (productId) => `/recommendations/${productId}/also-bought`,
  },
  review: {
    list: (productId) => `/reviews/${productId}`,
  },
  comment: {
    list: "/comments/",
  },
  store: {
    list: "/stores/",
  },
};
