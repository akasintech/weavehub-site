import React, { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";

export function Wordmark({ className = "" }) {
  return (
    <span className={`nav-logo-text ${className}`}>
      Weave<span className="wordmark-accent">Hub</span>
    </span>
  );
}

export function Pill({ tone = "brand", icon: Icon, children, className = "" }) {
  return (
    <span className={`pill pill--${tone} ${className}`}>
      {Icon ? <Icon size={10} strokeWidth={3} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function Skeleton({ width = "100%", height = 14, radius = 10, className = "", style }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function SectionHeader({ title, subtitle, icon: Icon, action, id, as: Tag = "h2" }) {
  return (
    <div className="section-head">
      <div className="section-head-text">
        <Tag className="section-head-title" id={id}>
          {Icon ? <Icon size={16} aria-hidden="true" /> : null}
          <span>{title}</span>
        </Tag>
        {subtitle ? <p className="section-head-sub">{subtitle}</p> : null}
      </div>
      {action ? <div className="section-head-action">{action}</div> : null}
    </div>
  );
}

/**
 * Any remote picture. Empty or broken sources become a calm placeholder tile
 * instead of a broken-image icon.
 */
export function MediaImage({ src, alt = "", className = "", eager = false, iconSize = 28 }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className={`media-fallback ${className}`} role="img" aria-label={alt || "No image available"}>
        <ImageOff size={iconSize} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
