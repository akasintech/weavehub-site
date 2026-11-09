import { useCallback, useRef, useState } from "react";

/** Index tracking and programmatic paging for a CSS scroll-snap track. */
export function useSnapCarousel() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const frame = useRef(0);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (track?.clientWidth) setIndex(Math.round(track.scrollLeft / track.clientWidth));
    });
  }, []);

  const goTo = useCallback((next, behavior = "smooth") => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(next);
    track.scrollTo({ left: next * track.clientWidth, behavior });
  }, []);

  return { trackRef, index, onScroll, goTo };
}
