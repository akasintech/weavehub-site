import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Store } from "lucide-react";
import { MediaImage } from "./ui";

export function StoreCard({ store }) {
  return (
    <Link to={`/stores/${store.id}`} state={{ store }} className="store-card">
      <div className="store-card-banner">
        {store.banner ? <MediaImage src={store.banner} alt="" className="store-card-banner-img" /> : null}
      </div>
      <div className="store-card-body">
        <div className="store-card-logo">
          {store.logo ? <MediaImage src={store.logo} alt="" iconSize={18} /> : <Store size={20} aria-hidden="true" />}
        </div>
        <div className="store-card-name">
          <span>{store.name}</span>
          {store.verified ? <BadgeCheck size={15} aria-hidden="true" /> : null}
        </div>
        {store.tagLine || store.description ? (
          <p className="store-card-desc">{store.tagLine || store.description}</p>
        ) : null}
      </div>
    </Link>
  );
}

export function StoreCardSkeleton() {
  return <div className="skeleton store-card-skeleton" aria-hidden="true" />;
}
