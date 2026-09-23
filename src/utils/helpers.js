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

export function extractImageUri(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.url || value.uri || value.path || "";
}

const VIDEO_EXTENSIONS = ["mp4", "mov", "avi", "mkv", "webm", "m4v", "3gp"];

export function isVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  const ext = clean.split(".").pop();
  return VIDEO_EXTENSIONS.includes(ext);
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
    sku: item?.sku || item?.barcode || "Default",
    price: decimalToNumber(item?.price),
    discountedPrice:
      item?.discountedPrice !== undefined
        ? decimalToNumber(item?.discountedPrice)
        : null,
    costPrice:
      item?.costPrice !== undefined ? decimalToNumber(item?.costPrice) : null,
    barcode: item?.barcode || "",
    isDefault: Boolean(item?.isDefault || item?.default),
    isActive: item?.isActive !== false && item?.status !== "inactive",
    attributes,
    inventory: {
      total,
      reserved,
      available,
      lowStockThreshold,
      outOfStockThreshold,
    },
    media,
    image:
      extractImageUri(media?.[0]) ||
      extractImageUri(item?.image) ||
      extractImageUri(item?.photo),
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
  const productMedia = Array.isArray(productData?.media)
    ? productData.media
    : Array.isArray(item?.media)
    ? item.media
    : [];

  const allMediaUrls = productMedia
    .map((m) => extractImageUri(m))
    .filter(Boolean);

  const resolvedImage =
    defaultVariant?.image ||
    extractImageUri(productData?.mainImage) ||
    extractImageUri(item?.mainImage) ||
    extractImageUri(productData?.mainImg) ||
    extractImageUri(item?.mainImg) ||
    allMediaUrls[0] ||
    extractImageUri(productData?.image) ||
    extractImageUri(item?.image) ||
    "/banner1.jpg";

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

  const isAvailable = stock > 0 && productData?.status !== "inactive";

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
    media: allMediaUrls.length > 0 ? allMediaUrls : [resolvedImage],
    status: productData?.status || item?.status || "active",
    isFeatured: Boolean(productData?.isFeatured || item?.isFeatured),
    isPromoted: Boolean(productData?.isPromoted || item?.isPromoted),
    stock,
    isAvailable,
    variants,
    defaultVariant,
    variantCount: variants.length || (normalizedRawDefault ? 1 : 0),
    storeId,
    storeName: storeData?.name || item?.storeName || "WeaveHub Artisan Store",
    storeLogo:
      extractImageUri(storeData?.logo) || item?.storeLogo || "/icon.png",
    storeBanner:
      extractImageUri(storeData?.banner) || item?.storeBanner || "/banner2.jpg",
    storeDescription:
      storeData?.description || item?.storeDescription || "Independent artisan shop",
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
