import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Store } from "lucide-react";
import { prefetchProduct, rememberProduct } from "../api/products";
import { formatCurrency, getProductPricing } from "../utils/helpers";
import { isMobileDevice, openProductInApp } from "../utils/deepLinks";
import { DesktopQRModal } from "./DesktopQRModal";
import { MediaImage, Pill } from "./ui";

/** Warm the details page while the pointer is still down. */
export function warmProduct(product) {
  rememberProduct(product);
  prefetchProduct(product.id);
}

// Saving needs an account, and accounts live in the app.
function SaveInAppButton({ productId, productName }) {
  const [showQR, setShowQR] = useState(false);

  const handleClick = () => {
    if (isMobileDevice()) openProductInApp(productId);
    else setShowQR(true);
  };

  return (
    <>
      <button
        type="button"
        className="pcard-heart"
        onClick={handleClick}
        aria-label={`Save ${productName} in the WeaveHub app`}
      >
        <Heart size={17} aria-hidden="true" />
      </button>
      <DesktopQRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        productId={productId}
        productName={productName}
      />
    </>
  );
}

export const ProductCard = memo(function ProductCard({ product }) {
  if (!product) return null;

  const { id, name, image, storeName, storeLogo } = product;
  const { price, originalPrice, discountPct } = getProductPricing(product);
  const soldOut = product.stockKnown && Number(product.stock) <= 0;

  return (
    <article className="pcard">
      <Link
        to={`/products/${id}`}
        className="pcard-link"
        aria-label={`View details for ${name}`}
        onPointerDown={() => warmProduct(product)}
      >
        <div className="pcard-media">
          <MediaImage src={image} alt={name} className="pcard-img" />
          {discountPct > 0 ? (
            <Pill tone="sale" className="pcard-discount">
              -{discountPct}%
            </Pill>
          ) : null}
          {soldOut ? <div className="pcard-soldout">SOLD OUT</div> : null}
        </div>

        <div className="pcard-body">
          {storeName ? (
            <div className="pcard-store">
              {storeLogo ? <img src={storeLogo} alt="" loading="lazy" /> : <Store size={11} aria-hidden="true" />}
              <span>{storeName}</span>
            </div>
          ) : null}
          <h3 className="pcard-name">{name}</h3>
          {price > 0 ? (
            <div className="pcard-price">
              <span className={discountPct ? "is-sale" : ""}>{formatCurrency(price)}</span>
              {originalPrice ? <s>{formatCurrency(originalPrice)}</s> : null}
            </div>
          ) : null}
        </div>
      </Link>

      <SaveInAppButton productId={id} productName={name} />
    </article>
  );
});
