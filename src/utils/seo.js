export function updateSEO({
  title = "WeaveHub – The Marketplace for Artisans & Craft Lovers",
  description = "Discover unique handmade products, support local craft vendors, and shop directly on WeaveHub.",
  image = "/icon.png",
  url = window.location.href,
}) {
  if (typeof document === "undefined") return;

  // Title
  document.title = title.includes("WeaveHub") ? title : `${title} | WeaveHub`;

  // Helper to set or create meta tag
  const setMeta = (attr, key, content) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  // Standard Meta
  setMeta("name", "description", description);

  // Open Graph
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", image);

  // Twitter Card
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", image);
}
