export function formatCurrency(value) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number.isNaN(amount) ? 0 : amount);
}

export function decimalToNumber(value, fallback = 0) {
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    return Number(value.$numberDecimal) || fallback;
  }
  return Number(value ?? fallback) || fallback;
}

// Some media URLs come back from the API as http://. On an https site those are
// blocked as mixed content, so every Cloudinary URL is upgraded.
export function secureMediaUrl(url) {
  return typeof url === "string"
    ? url.replace(/^http:\/\/(res(?:-\d+)?\.cloudinary\.com)/i, "https://$1")
    : url;
}

export function extractImageUri(value) {
  if (!value) return "";
  if (typeof value === "string") return secureMediaUrl(value);
  return secureMediaUrl(value.url || value.uri || value.path || "");
}

const VIDEO_EXTENSIONS = ["mp4", "mov", "avi", "mkv", "webm", "m4v", "3gp"];
const urlExtension = (url) => url.split("?")[0].split("#")[0].split(".").pop().toLowerCase();

export function isVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.includes("/video/upload/") || VIDEO_EXTENSIONS.includes(urlExtension(url));
}

function cloudinaryVideoVariant(url, transformation, extension) {
  const secure = secureMediaUrl(url);
  if (!secure?.includes("res.cloudinary.com") || !secure.includes("/video/upload/")) return "";
  return secure
    .replace("/video/upload/", `/video/upload/${transformation}/`)
    .replace(/\.[a-z0-9]+(\?.*)?$/i, `.${extension}$1`);
}

/** A still frame for a Cloudinary video, or "" when one can't be derived. */
export function getVideoPoster(url) {
  return cloudinaryVideoVariant(url, "so_0,f_jpg,w_800", "jpg");
}

/** H.264/AAC MP4 of a video: the format every phone can decode. */
export function getCompatibleVideoUrl(url) {
  return cloudinaryVideoVariant(url, "f_mp4,vc_h264,ac_aac,q_auto", "mp4");
}

/** The best URL to draw in an <img> for a media entry (never a video file). */
export function getMediaStill(media) {
  if (!media) return "";
  const uri = extractImageUri(media);
  if (!uri) return "";
  const isVideo = media?.type === "video" || isVideoUrl(uri);
  if (!isVideo) return uri;
  return secureMediaUrl(media?.thumbnail) || getVideoPoster(uri);
}

export function normalizeVariant(item = {}) {
  const inventory = item?.inventory || item?.stock || {};

  const total =
    typeof inventory?.total === "number"
      ? inventory.total
      : inventory?.total != null
      ? Number(inventory.total)
      : item?.inventoryTotal != null
      ? Number(item.inventoryTotal)
      : item?.quantity != null
      ? Number(item.quantity)
      : 0;

  const reserved =
    typeof inventory?.reserved === "number"
      ? inventory.reserved
      : inventory?.reserved != null
      ? Number(inventory.reserved)
      : item?.reservedInventory != null
      ? Number(item.reservedInventory)
      : 0;

  const available =
    typeof inventory?.available === "number"
      ? inventory.available
      : inventory?.available != null
      ? Number(inventory.available)
      : Math.max(total - reserved, 0);

  const lowStockThreshold =
    typeof inventory?.lowStockThreshold === "number"
      ? inventory.lowStockThreshold
      : inventory?.lowStockThreshold != null
      ? Number(inventory.lowStockThreshold)
      : 5;

  const outOfStockThreshold =
    typeof inventory?.outOfStockThreshold === "number"
      ? inventory.outOfStockThreshold
      : inventory?.outOfStockThreshold != null
      ? Number(inventory.outOfStockThreshold)
      : 0;

  const media = Array.isArray(item?.media)
    ? item.media
    : Array.isArray(item?.images)
    ? item.images
    : [];

  let attributes = [];
  if (Array.isArray(item?.details) && item.details.length > 0) {
    attributes = item.details
      .map((d) => ({
        name: d?.attribute?.name || d?.attributeName || "",
        value: d?.attributeValue?.value || d?.value || "",
        attributeId: d?.attribute?._id || d?.attribute?.id || "",
        attributeValueId: d?.attributeValue?._id || d?.attributeValue?.id || "",
      }))
      .filter((a) => a.name || a.value);
  } else if (Array.isArray(item?.attributes) && item.attributes.length > 0) {
    attributes = item.attributes.map((a) =>
      typeof a === "object"
        ? { name: a?.name || a?.attribute || "", value: a?.value || "" }
        : { name: "", value: String(a) }
    );
  } else if (Array.isArray(item?.attributeValues) && item.attributeValues.length > 0) {
    attributes = item.attributeValues.map((a) =>
      typeof a === "object"
        ? { name: a?.name || a?.attribute || "", value: a?.value || "" }
        : { name: "", value: String(a) }
    );
  }

  return {
    id: item?._id || item?.id || item?.variantId || item?.sku,
    price: decimalToNumber(item?.price),
    discountedPrice:
      item?.discountedPrice !== undefined
        ? decimalToNumber(item?.discountedPrice)
        : null,
    isDefault: Boolean(item?.isDefault || item?.default),
    isActive: item?.isActive !== false && item?.status !== "inactive",
    attributes,
    // List responses carry no stock, so stock is only judged once it's known.
    stockKnown: Boolean(item?.inventory),
    inventory: {
      total,
      reserved,
      available,
      lowStockThreshold,
      outOfStockThreshold,
    },
    media,
    image:
      getMediaStill(media?.find((m) => m?.type !== "video" && !isVideoUrl(extractImageUri(m)))) ||
      getMediaStill(media?.[0]) ||
      getMediaStill(item?.image) ||
      getMediaStill(item?.photo),
    raw: item,
  };
}

export function getCategoryNameById(categoryId = "", categoriesList = []) {
  if (!categoryId || !Array.isArray(categoriesList)) return "General";
  const normalizedCategoryId =
    typeof categoryId === "object"
      ? categoryId?._id || categoryId?.id
      : categoryId;
  const found = categoriesList.find(
    (cat) => cat.id === normalizedCategoryId || cat._id === normalizedCategoryId
  );
  return found?.name || "General";
}

export function normalizeProduct(item = {}, categoriesList = []) {
  const productData = item?.product || item;

  const storeData =
    (productData?.store && typeof productData.store === "object"
      ? productData.store
      : null) ||
    (item?.store && typeof item.store === "object" ? item.store : null);

  const storeId =
    storeData?._id ||
    storeData?.id ||
    (typeof productData?.store === "string" ? productData.store : null) ||
    (typeof item?.store === "string" ? item.store : null) ||
    item?.storeId ||
    productData?.storeId;

  const rawVariants =
    productData?.variants ||
    productData?.productVariants ||
    item?.variants ||
    item?.productVariants ||
    [];

  const variants = Array.isArray(rawVariants)
    ? rawVariants.map(normalizeVariant)
    : [];

  const rawDefaultVariant =
    productData?.defaultVariant || item?.defaultVariant || null;
  const normalizedRawDefault =
    rawDefaultVariant && typeof rawDefaultVariant === "object"
      ? normalizeVariant(rawDefaultVariant)
      : null;

  const defaultVariant =
    variants.find((v) => v.isDefault) ||
    (variants.length > 0 ? variants[0] : null) ||
    normalizedRawDefault;

  // Resolve media array and primary image
  const productMedia = (
    Array.isArray(productData?.media)
      ? productData.media
      : Array.isArray(item?.media)
      ? item.media
      : []
  ).filter((m) => m?.url && !m?.isDeleted);

  const firstPicture = productMedia.find(
    (m) => m?.type !== "video" && !isVideoUrl(extractImageUri(m))
  );
  const mainImage =
    extractImageUri(productData?.mainImage) ||
    extractImageUri(item?.mainImage) ||
    extractImageUri(productData?.mainImg) ||
    extractImageUri(item?.mainImg);

  // Cards always need a picture: mainImage can be null or a video file.
  const resolvedImage =
    defaultVariant?.image ||
    (mainImage && !isVideoUrl(mainImage) ? mainImage : "") ||
    getMediaStill(firstPicture) ||
    (mainImage ? getVideoPoster(mainImage) : "") ||
    getMediaStill(productMedia[0]) ||
    getMediaStill(productData?.image) ||
    getMediaStill(item?.image);

  // Categories
  const rawCategories = productData?.categories || item?.categories || [];
  let categoryName = "General";
  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    const firstCat = rawCategories[0];
    if (typeof firstCat === "object") {
      categoryName = firstCat?.name || firstCat?.title || "General";
    } else if (typeof firstCat === "string") {
      categoryName = getCategoryNameById(firstCat, categoriesList) || firstCat;
    }
  }

  const rawCategoryId =
    productData?.categoryId ||
    item?.categoryId ||
    (Array.isArray(rawCategories) && rawCategories.length > 0
      ? typeof rawCategories[0] === "object"
        ? rawCategories[0]?._id || rawCategories[0]?.id
        : rawCategories[0]
      : undefined);

  if (categoryName === "General" && rawCategoryId) {
    const fromList = getCategoryNameById(rawCategoryId, categoriesList);
    if (fromList !== "General") categoryName = fromList;
  }

  const price =
    (defaultVariant?.price && defaultVariant.price > 0 ? defaultVariant.price : null) ||
    decimalToNumber(productData?.price || item?.price || item?.amount);

  const discountedPrice =
    defaultVariant?.discountedPrice ??
    productData?.discountedPrice ??
    item?.discountedPrice;

  const stock =
    defaultVariant?.inventory?.available ??
    item?.quantity ??
    productData?.quantity ??
    item?.stock ??
    0;

  const stockKnown = Boolean(defaultVariant?.stockKnown);
  const isAvailable = (!stockKnown || stock > 0) && productData?.status !== "inactive";

  return {
    id:
      productData?._id ||
      productData?.id ||
      item?.id ||
      item?.productId ||
      `product-${Math.random().toString(36).substring(2, 9)}`,
    name: productData?.name || item?.name || item?.title || "Artisan Product",
    description:
      productData?.description ||
      item?.description ||
      item?.details ||
      "Authentic handcrafted item created by a verified WeaveHub artisan vendor.",
    price,
    discountedPrice,
    category: categoryName,
    categoryId: rawCategoryId,
    image: resolvedImage,
    status: productData?.status || item?.status || "active",
    isFeatured: Boolean(productData?.isFeatured || item?.isFeatured),
    isPromoted: Boolean(productData?.isPromoted || item?.isPromoted),
    stock,
    stockKnown,
    isAvailable,
    variants,
    defaultVariant,
    variantCount: variants.length || (normalizedRawDefault ? 1 : 0),
    storeId,
    storeName: storeData?.name || item?.storeName || "",
    storeLogo: extractImageUri(storeData?.logo) || extractImageUri(item?.storeLogo),
    storeBanner: extractImageUri(storeData?.banner) || extractImageUri(item?.storeBanner),
    storeTagLine: storeData?.tagLine || "",
    storeDescription: storeData?.description || item?.storeDescription || "",
    raw: item,
  };
}

export function normalizeCategory(item = {}) {
  return {
    id: item?._id || item?.id || item?.slug || item?.name,
    name: item?.name || item?.title || "Category",
    description:
      item?.description || "Explore handcrafted items in this collection.",
    image:
      extractImageUri(item?.image) ||
      extractImageUri(item?.icon) ||
      extractImageUri(item?.photo) ||
      "",
  };
}

/** The store fields the site may show. Vendor contact details never leave this function. */
export function normalizeStore(item = {}) {
  return {
    id: item?._id || item?.id,
    name: item?.name || "WeaveHub Store",
    tagLine: item?.tagLine && item.tagLine !== "Store" ? item.tagLine : "",
    description: item?.description || "",
    logo: extractImageUri(item?.logo),
    banner: extractImageUri(item?.banner),
    verified: item?.status === "approved" || item?.status === "active",
    isPlatformStore: Boolean(item?.isPlatformStore),
  };
}

function personName(user) {
  if (!user || typeof user !== "object") return "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.name || "";
}

export function normalizeReview(item = {}) {
  return {
    id: item?._id || item?.id,
    author: personName(item?.user) || item?.userName || "Verified Shopper",
    rating: Math.min(5, Math.max(0, Number(item?.rating || 0))),
    text: item?.text || item?.body || item?.comment || item?.review || "",
    createdAt: item?.createdAt || "",
  };
}

export function normalizeComment(item = {}) {
  const replies = Array.isArray(item?.replies)
    ? item.replies
    : Array.isArray(item?.children)
    ? item.children
    : [];
  return {
    id: item?._id || item?.id,
    author: personName(item?.user) || item?.userName || "Verified Shopper",
    text: item?.text || item?.body || item?.message || item?.comment || "",
    createdAt: item?.createdAt || "",
    replies: replies.map(normalizeComment),
  };
}

/** What a product card shows: live price, strike-through price, discount %. */
export function getProductPricing(product = {}) {
  const variant = product?.defaultVariant || {};
  const base = Number(variant.price || product.price || 0);
  const discounted = Number(variant.discountedPrice ?? product.discountedPrice ?? 0);
  const onSale = discounted > 0 && base > 0 && discounted < base;

  return {
    price: onSale ? discounted : base,
    originalPrice: onSale ? base : null,
    discountPct: onSale ? Math.round(((base - discounted) / base) * 100) : 0,
  };
}

/** The price a shopper pays for a variant: a sale price only counts when it's real (0 means none). */
export function getVariantPricing(variant, fallbackPrice = 0) {
  const base = Number(variant?.price || fallbackPrice || 0);
  const sale = Number(variant?.discountedPrice || 0);
  const onSale = sale > 0 && base > 0 && sale < base;
  return {
    price: onSale ? sale : base,
    originalPrice: onSale ? base : null,
    discountPct: onSale ? Math.round(((base - sale) / base) * 100) : 0,
  };
}

/** Gallery slides for a product/variant: [{ uri, isVideo, poster }]. */
export function getProductSlides(product, variant) {
  const raw = product?.raw?.product || product?.raw || {};
  const media = (Array.isArray(raw.media) ? raw.media : []).filter((m) => m?.url && !m?.isDeleted);
  const variantId = variant?.id || variant?.raw?._id;
  const ownerOf = (m) =>
    m?.variant && typeof m.variant === "object" ? m.variant._id || m.variant.id : m?.variant;
  const toSlide = (m) => {
    const uri = extractImageUri(m);
    const isVideo = m?.type === "video" || isVideoUrl(uri);
    return { uri, isVideo, poster: isVideo ? getMediaStill(m) : uri };
  };

  const forVariant = media.filter((m) => variantId && ownerOf(m) === variantId).map(toSlide);
  const productLevel = media.filter((m) => !ownerOf(m)).map(toSlide);
  const chosen = forVariant.some((s) => !s.isVideo)
    ? [...forVariant, ...productLevel.filter((s) => s.isVideo)]
    : [...forVariant, ...productLevel];

  // List responses only carry mainImage, which may itself be a video.
  if (!chosen.length) {
    const main = extractImageUri(raw.mainImage);
    if (main) chosen.push(toSlide({ url: main }));
    else if (product?.image) chosen.push({ uri: product.image, isVideo: false, poster: product.image });
  }

  const seen = new Set();
  const unique = chosen.filter((s) => !seen.has(s.uri) && seen.add(s.uri));
  return [...unique.filter((s) => !s.isVideo), ...unique.filter((s) => s.isVideo)];
}

/** Fill in the category name for a product whose categories came back as bare ids. */
export function withCategoryName(product, categoriesList = []) {
  if (!product || product.category !== "General" || !product.categoryId) return product;
  const name = getCategoryNameById(product.categoryId, categoriesList);
  return name === "General" ? product : { ...product, category: name };
}
