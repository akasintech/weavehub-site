import React, { useEffect, useRef } from "react";
import { AlertCircle, PackageSearch, RotateCw } from "lucide-react";
import { SkeletonCard } from "./ProductGrid";

export function EmptyState({ icon: Icon = PackageSearch, title, message, children, compact = false }) {
  return (
    <div className={`state-box ${compact ? "state-box--compact" : ""}`}>
      <div className="state-icon empty">
        <Icon size={compact ? 20 : 28} aria-hidden="true" />
      </div>
      {title ? <h3 className="state-title">{title}</h3> : null}
      {message ? <p className="state-desc">{message}</p> : null}
      {children}
    </div>
  );
}

export function ErrorState({ title = "Unable to load this", error, onRetry, compact = false }) {
  const message =
    typeof error === "string"
      ? error
      : error?.message || "An unexpected error occurred while fetching from WeaveHub.";

  return (
    <div className={`state-box ${compact ? "state-box--compact" : ""}`} role="alert">
      <div className="state-icon error">
        <AlertCircle size={compact ? 20 : 28} aria-hidden="true" />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-desc">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn btn-primary btn-sm">
          <RotateCw size={14} aria-hidden="true" />
          <span>Try Again</span>
        </button>
      ) : null}
    </div>
  );
}

/**
 * Footer of a paginated list: scrolling near it fetches the next page, and the
 * button is there for keyboards and for retrying after a failed page.
 */
export function LoadMore({ list, skeletonCount = 4, endText = "You're all caught up", className = "product-grid", auto = true }) {
  const sentinelRef = useRef(null);
  const { hasNext, loadingMore, moreError, loadMore, page, items } = list;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!auto || !node || !hasNext || loadingMore || moreError) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [auto, hasNext, loadingMore, moreError, loadMore, page]);

  if (!items.length) return null;

  return (
    <div className="load-more">
      {loadingMore ? (
        <div className={className} aria-label="Loading more">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : null}

      {moreError ? (
        <div className="load-more-row" role="alert">
          <p className="load-more-error">{moreError.message || "Couldn't load more."}</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={loadMore}>
            <RotateCw size={14} aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      ) : hasNext && !loadingMore ? (
        <div className="load-more-row" ref={sentinelRef}>
          <button type="button" className="btn btn-outline" onClick={loadMore}>
            Load more
          </button>
        </div>
      ) : !hasNext ? (
        <p className="load-more-end">{endText}</p>
      ) : null}
    </div>
  );
}
