import React from "react";
import { RotateCw } from "lucide-react";
import { Skeleton } from "./ui";

export function Chip({ active, icon: Icon, onClick, children }) {
  return (
    <button type="button" className={`chip ${active ? "active" : ""}`} aria-pressed={Boolean(active)} onClick={onClick}>
      {Icon ? <Icon size={14} aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

export function ChipRow({ children, loading = false, error = null, onRetry }) {
  return (
    <div className="chip-row">
      {children}
      {loading
        ? [84, 70, 96, 76, 88].map((width, i) => <Skeleton key={i} width={width} height={38} radius={999} style={{ flex: "none" }} />)
        : null}
      {error ? (
        <button type="button" className="chip chip--retry" onClick={onRetry}>
          <RotateCw size={13} aria-hidden="true" />
          <span>Retry categories</span>
        </button>
      ) : null}
    </div>
  );
}

export function ChipDivider() {
  return <span className="chip-divider" aria-hidden="true" />;
}
