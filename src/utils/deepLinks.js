const APP_SCHEME = import.meta.env.VITE_APP_SCHEME || "weavehub";
const ANDROID_STORE_URL =
  import.meta.env.VITE_ANDROID_STORE_URL ||
  "https://play.google.com/store/apps/details?id=com.akasintech.weavehub";
const IOS_STORE_URL =
  import.meta.env.VITE_IOS_STORE_URL ||
  "https://apps.apple.com/app/weavehub/id9b155524";
const WEBSITE_URL =
  import.meta.env.VITE_WEBSITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export function getDevicePlatform() {
  if (typeof window === "undefined" || !navigator) {
    return "desktop";
  }

  const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";

  if (/android/i.test(userAgent)) {
    return "android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }

  return "desktop";
}

export function isMobileDevice() {
  const platform = getDevicePlatform();
  return platform === "android" || platform === "ios";
}

export function getAppProductDeepLink(productId) {
  if (!productId) return `${APP_SCHEME}://`;
  return `${APP_SCHEME}://product/${productId}`;
}

export function getWebProductOpenUrl(productId) {
  const cleanId = encodeURIComponent(productId || "");
  return `${WEBSITE_URL}/open/product/${cleanId}`;
}

export function getStoreUrl(platform = getDevicePlatform()) {
  if (platform === "ios") return IOS_STORE_URL;
  return ANDROID_STORE_URL;
}

export function openProductInApp(productId, options = {}) {
  const platform = getDevicePlatform();
  const { onDesktopTrigger } = options;

  if (platform === "desktop") {
    if (typeof onDesktopTrigger === "function") {
      onDesktopTrigger();
    }
    return { isDesktop: true, handled: false };
  }

  const deepLink = getAppProductDeepLink(productId);
  const fallbackStore = getStoreUrl(platform);

  const startTime = Date.now();
  let hasLeftPage = false;

  const handleVisibilityChange = () => {
    if (document.hidden || document.webkitHidden) {
      hasLeftPage = true;
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("webkitvisibilitychange", handleVisibilityChange);

  // Attempt custom URI scheme launch
  window.location.href = deepLink;

  // Fallback timer: if the app is not installed, the page stays visible and we redirect to store
  setTimeout(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.removeEventListener("webkitvisibilitychange", handleVisibilityChange);

    const elapsed = Date.now() - startTime;
    // If the user hasn't switched away to the mobile app within 2.5s, route to store
    if (!hasLeftPage && elapsed < 3500) {
      window.location.href = fallbackStore;
    }
  }, 2500);

  return { isDesktop: false, handled: true, deepLink };
}

export { APP_SCHEME, ANDROID_STORE_URL, IOS_STORE_URL, WEBSITE_URL };
