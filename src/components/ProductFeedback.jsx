import React, { useMemo } from "react";
import { MessageSquare, Star } from "lucide-react";
import { getCommentsPage, getReviewsPage } from "../api/products";
import { usePagedList } from "../hooks/useApi";
import { EmptyState, ErrorState } from "./States";
import { Skeleton } from "./ui";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })
    : "";

function Stars({ value }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={13} aria-hidden="true" fill={n <= Math.round(value) ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

function FeedbackItem({ author, date, rating, text, children }) {
  return (
    <div className="feedback-item">
      <div className="feedback-head">
        <strong>{author}</strong>
        {date ? <span>{formatDate(date)}</span> : null}
      </div>
      {rating ? <Stars value={rating} /> : null}
      {text ? <p>{text}</p> : null}
      {children}
    </div>
  );
}

function FeedbackSkeleton() {
  return (
    <div className="feedback-list" aria-hidden="true">
      {[0, 1].map((i) => (
        <Skeleton key={i} height={74} radius={14} />
      ))}
    </div>
  );
}

function ListFooter({ list }) {
  if (list.moreError) {
    return <ErrorState compact title="Couldn't load more" error={list.moreError} onRetry={list.loadMore} />;
  }
  if (!list.hasNext) return null;
  return (
    <button type="button" className="btn btn-outline btn-sm" disabled={list.loadingMore} onClick={list.loadMore}>
      {list.loadingMore ? "Loading..." : "Show more"}
    </button>
  );
}

export function ProductFeedback({ productId }) {
  const reviews = usePagedList(`reviews:${productId}`, ({ page, signal }) =>
    getReviewsPage(productId, { page, signal })
  );
  const comments = usePagedList(`comments:${productId}`, ({ page, signal }) =>
    getCommentsPage(productId, { page, signal })
  );

  const reviewItems = useMemo(() => reviews.items.filter((r) => r.text || r.rating), [reviews.items]);
  const commentItems = useMemo(() => comments.items.filter((c) => c.text), [comments.items]);
  const average = reviewItems.length
    ? reviewItems.reduce((sum, r) => sum + r.rating, 0) / reviewItems.length
    : 0;
  const settled = !reviews.loading && !comments.loading;

  return (
    <section className="feedback" aria-labelledby="feedback-heading">
      <h2 id="feedback-heading" className="section-head-title">
        <MessageSquare size={16} aria-hidden="true" />
        <span>
          Artisan Inquiries &amp; Reviews{settled ? ` (${reviews.total + comments.total})` : ""}
        </span>
      </h2>

      <div className="feedback-columns">
        <div>
          <div className="feedback-sub">
            <h3 className="overline">Reviews</h3>
            {average > 0 ? (
              <span className="feedback-avg">
                <Stars value={average} /> {average.toFixed(1)}
              </span>
            ) : null}
          </div>
          {reviews.loading ? (
            <FeedbackSkeleton />
          ) : reviews.error ? (
            <ErrorState compact title="Unable to load reviews" error={reviews.error} onRetry={reviews.retry} />
          ) : !reviewItems.length ? (
            <EmptyState compact icon={Star} message="No reviews yet." />
          ) : (
            <div className="feedback-list">
              {reviewItems.map((review, i) => (
                <FeedbackItem key={review.id || i} author={review.author} date={review.createdAt} rating={review.rating} text={review.text} />
              ))}
              <ListFooter list={reviews} />
            </div>
          )}
        </div>

        <div>
          <div className="feedback-sub">
            <h3 className="overline">Comments</h3>
          </div>
          {comments.loading ? (
            <FeedbackSkeleton />
          ) : comments.error ? (
            <ErrorState compact title="Unable to load comments" error={comments.error} onRetry={comments.retry} />
          ) : !commentItems.length ? (
            <EmptyState compact icon={MessageSquare} message="No comments yet." />
          ) : (
            <div className="feedback-list">
              {commentItems.map((comment, i) => (
                <FeedbackItem key={comment.id || i} author={comment.author} date={comment.createdAt} text={comment.text}>
                  {comment.replies.filter((r) => r.text).map((reply, j) => (
                    <div className="feedback-reply" key={reply.id || j}>
                      <strong>{reply.author}</strong>
                      <p>{reply.text}</p>
                    </div>
                  ))}
                </FeedbackItem>
              ))}
              <ListFooter list={comments} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
