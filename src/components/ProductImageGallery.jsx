import React, { useState, useEffect } from "react";
import { isVideoUrl } from "../utils/helpers";
import { Play } from "lucide-react";

export function ProductImageGallery({
  media = [],
  fallbackImage = "/banner1.jpg",
  productName = "Product",
}) {
  const mediaList =
    Array.isArray(media) && media.length > 0
      ? media
      : [fallbackImage];

  const [activeIndex, setActiveIndex] = useState(0);

  // If media array changes (e.g., variant selected with different image)
  useEffect(() => {
    setActiveIndex(0);
  }, [mediaList.join(",")]);

  const activeItem = mediaList[activeIndex] || fallbackImage;
  const isVideo = isVideoUrl(activeItem);

  return (
    <div className="gallery-container">
      <div className="gallery-main">
        {isVideo ? (
          <video
            src={activeItem}
            controls
            autoPlay
            muted
            loop
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={activeItem}
            alt={`${productName} view ${activeIndex + 1}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
          />
        )}
      </div>

      {mediaList.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-label="Product thumbnails">
          {mediaList.map((item, index) => {
            const isThumbVideo = isVideoUrl(item);
            return (
              <button
                key={`${item}-${index}`}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Media thumbnail ${index + 1}`}
                className={`gallery-thumb ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
                style={{ position: "relative" }}
              >
                {isThumbVideo ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#0F172A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <Play size={16} />
                  </div>
                ) : (
                  <img
                    src={item}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
