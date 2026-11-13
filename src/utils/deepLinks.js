const APP_SCHEME = import.meta.env.VITE_APP_SCHEME || "weavehub";
export const ANDROID_PACKAGE = "com.akasintech.weavehub";
const ANDROID_STORE_URL =
  import.meta.env.VITE_ANDROID_STORE_URL ||
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
const IOS_STORE_URL = import.meta.env.VITE_IOS_STORE_URL || "";
// Only a real App Store link (".../id<digits>") counts; the app isn't on iOS yet.
export const IOS_AVAILABLE = /apps\.apple\.com\/.+\/id\d+(\?|$)/.test(IOS_STORE_URL);
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

const appPath = (productId) => (productId ? `product/${encodeURIComponent(productId)}` : "");

export function getAppProductDeepLink(productId) {
  return `${APP_SCHEME}://${appPath(productId)}`;
}

/**
 * Android's intent link: Chrome (and most Android browsers) opens WeaveHub if
 * it's installed, and goes straight to its Play Store page if it isn't.
 */
export function getAndroidIntentUrl(productId) {
  const fallback = encodeURIComponent(ANDROID_STORE_URL);
  return `intent://${appPath(productId)}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

/** What QR codes encode: a website page that opens the app or the store on the phone that scans it. */
export function getAppOpenUrl(productId) {
  return productId ? `${WEBSITE_URL}/app?product=${encodeURIComponent(productId)}` : `${WEBSITE_URL}/app`;
}

/** Kept for links already shared; it opens the same way as getAppOpenUrl. */
export function getWebProductOpenUrl(productId) {
  return `${WEBSITE_URL}/open/product/${encodeURIComponent(productId || "")}`;
}

export function getStoreUrl(platform = getDevicePlatform()) {
  if (platform === "ios") return IOS_AVAILABLE ? IOS_STORE_URL : "";
  return ANDROID_STORE_URL;
}

function openIosApp(productId) {
  // iOS has no install-or-store link, so try the app and fall back to the store.
  let left = false;
  const onHide = () => {
    if (document.hidden) left = true;
  };
  document.addEventListener("visibilitychange", onHide);
  window.location.href = getAppProductDeepLink(productId);
  setTimeout(() => {
    document.removeEventListener("visibilitychange", onHide);
    if (!left) window.location.href = IOS_STORE_URL;
  }, 2500);
}

/**
 * Opens WeaveHub (on a product when given) or its store page.
 * Returns what happened: "android" | "ios" | "ios-unavailable" | "desktop".
 */
export function openApp({ productId } = {}) {
  const platform = getDevicePlatform();
  if (platform === "android") {
    window.location.href = getAndroidIntentUrl(productId);
    return "android";
  }
  if (platform === "ios") {
    if (!IOS_AVAILABLE) return "ios-unavailable";
    openIosApp(productId);
    return "ios";
  }
  return "desktop";
}

export function openProductInApp(productId, options = {}) {
  const result = openApp({ productId });
  if (result === "desktop") options.onDesktopTrigger?.();
  return { isDesktop: result === "desktop", handled: result === "android" || result === "ios", result };
}

export { APP_SCHEME, ANDROID_STORE_URL, IOS_STORE_URL, WEBSITE_URL };
