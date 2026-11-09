import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Play, RotateCw } from "lucide-react";
import { useSnapCarousel } from "../hooks/useSnapCarousel";
import { getCompatibleVideoUrl } from "../utils/helpers";
import { MediaImage } from "./ui";

/**
 * Only the visible slide owns a <video>. If a file can't be played, it retries
 * once with Cloudinary's H.264 MP4, then falls back to the poster and a message.
 */
function VideoSlide({ slide, isActive, productName }) {
  const sources = useMemo(() => {
    const compatible = getCompatibleVideoUrl(slide.uri);
    const isMp4 = slide.uri.split("?")[0].toLowerCase().endsWith(".mp4");
    const list = isMp4 ? [slide.uri, compatible] : [compatible, slide.uri];
    return list.filter(Boolean);
  }, [slide.uri]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const handleError = useCallback(() => {
    if (sourceIndex + 1 < sources.length) setSourceIndex(sourceIndex + 1);
    else setFailed(true);
  }, [sourceIndex, sources.length]);

  if (failed) {
    return (
      <div className="gallery-slide gallery-slide--video">
        <MediaImage src={slide.poster} alt={productName} className="gallery-img" />
        <div className="gallery-video-error" role="alert">
          <AlertCircle size={30} aria-hidden="true" />
          <strong>This video couldn't be played</strong>
          <button
            type="button"
            className="btn btn-sm gallery-retry"
            onClick={() => {
              setSourceIndex(0);
              setFailed(false);
              setAttempt((a) => a + 1);
            }}
          >
            <RotateCw size={14} aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="gallery-slide gallery-slide--video">
        <MediaImage src={slide.poster} alt={productName} className="gallery-img" />
        <div className="gallery-play" aria-hidden="true">
          <Play size={30} fill="currentColor" />
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-slide gallery-slide--video">
      <video
        key={`${sources[sourceIndex]}-${attempt}`}
        className="gallery-video"
        src={sources[sourceIndex]}
        poster={slide.poster || undefined}
        controls
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={handleError}
      />
    </div>
  );
}

export function ProductImageGallery({ slides = [], productName = "Product" }) {
  const { trackRef, index, onScroll, goTo } = useSnapCarousel();
  const count = slides.length;
  const signature = slides.map((s) => s.uri).join("|");

  // A variant with different media starts again from its first slide.
  useEffect(() => {
    goTo(0, "auto");
  }, [signature, goTo]);

  if (!count) {
    return (
      <div className="gallery-container">
        <div className="gallery-main">
          <MediaImage src="" alt={productName} className="gallery-img" iconSize={40} />
        </div>
      </div>
    );
  }

  const videoIndex = slides.findIndex((s) => s.isVideo);

  return (
    <div className="gallery-container">
      <div className="gallery-main">
        <div className="gallery-track" ref={trackRef} onScroll={onScroll}>
          {slides.map((slide, i) =>
            slide.isVideo ? (
              <VideoSlide key={slide.uri} slide={slide} isActive={i === index} productName={productName} />
            ) : (
              <div className="gallery-slide" key={slide.uri}>
                <MediaImage
                  src={slide.uri}
                  alt={`${productName} view ${i + 1}`}
                  className="gallery-img"
                  eager={i === 0}
                  iconSize={40}
                />
              </div>
            )
          )}
        </div>

        {count > 1 ? (
          <>
            <button type="button" className="carousel-arrow carousel-arrow--prev" onClick={() => goTo((index - 1 + count) % count)} aria-label="Previous media">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="carousel-arrow carousel-arrow--next" onClick={() => goTo((index + 1) % count)} aria-label="Next media">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </>
        ) : null}

        {videoIndex >= 0 && count > 1 && !slides[index]?.isVideo ? (
          <button type="button" className="gallery-watch" onClick={() => goTo(videoIndex)}>
            <Play size={13} fill="currentColor" aria-hidden="true" />
            <span>Watch video</span>
          </button>
        ) : null}

        {count > 1 ? (
          <div className="gallery-dots" aria-hidden="true">
            {slides.map((slide, i) => (
              <span key={slide.uri} className={i === index ? "active" : ""} />
            ))}
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="gallery-thumbs" role="tablist" aria-label="Product thumbnails">
          {slides.map((slide, i) => (
            <button
              key={slide.uri}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Media thumbnail ${i + 1}`}
              className={`gallery-thumb ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
            >
              <MediaImage src={slide.poster} alt="" iconSize={16} />
              {slide.isVideo ? (
                <span className="gallery-thumb-play" aria-hidden="true">
                  <Play size={14} fill="currentColor" />
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
