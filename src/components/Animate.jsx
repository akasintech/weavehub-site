import { motion } from "framer-motion";

// ── Shared easing presets ────────────────────────────────────────────────
const ease = [0.25, 0.1, 0.25, 1];
const easeOut = [0, 0, 0.2, 1];

// ── Viewport settings — trigger once when 15% visible ───────────────────
const viewport = { once: true, amount: 0.15 };

/**
 * Fade + slide up  (section headers, body copy, cards)
 */
export function FadeUp({ children, delay = 0, duration = 0.55, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pure fade-in  (trust bar, overlays, badges)
 */
export function FadeIn({ children, delay = 0, duration = 0.5, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewport}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide in from left  (text / left-column content)
 */
export function SlideLeft({ children, delay = 0, duration = 0.6, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x: -48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide in from right  (phone mockup, images, right-column visuals)
 */
export function SlideRight({ children, delay = 0, duration = 0.6, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x: 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale + fade in  (cards, images, icons)
 */
export function ScaleIn({ children, delay = 0, duration = 0.5, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewport}
      transition={{ duration, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger parent — wraps a list so children animate one-by-one
 * Use with StaggerItem for each child
 */
export function StaggerParent({ children, delay = 0, stagger = 0.1, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger child — must be a direct child of StaggerParent
 */
export function StaggerItem({ children, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Page-level entry animation — wraps the entire page content
 */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated image with a subtle scale-in on scroll
 */
export function AnimatedImage({ src, alt, className, style, delay = 0 }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.6, delay, ease: easeOut }}
    />
  );
}
