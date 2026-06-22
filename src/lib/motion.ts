import type { Variants, Transition } from "motion/react";

// ─── Easing ───────────────────────────────────────────────
// Premium easing curves inspired by Linear/Stripe/Vercel
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: "spring", stiffness: 300, damping: 30 } as const,
  springSoft: { type: "spring", stiffness: 200, damping: 25 } as const,
} as const;

// ─── Duration ─────────────────────────────────────────────
export const duration = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const;

// ─── Base Transition ──────────────────────────────────────
export const fadeTransition: Transition = {
  duration: duration.normal,
  ease: ease.out,
};

// ─── Variants: Fade ───────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: fadeTransition,
  },
};

// ─── Variants: Fade Up ────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// ─── Variants: Fade Up (larger distance) ──────────────────
export const fadeUpLg: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: ease.out,
    },
  },
};

// ─── Variants: Fade Down ──────────────────────────────────
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: fadeTransition,
  },
};

// ─── Variants: Fade Left ──────────────────────────────────
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// ─── Variants: Fade Right ─────────────────────────────────
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// ─── Variants: Scale In ───────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// ─── Stagger Container ────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ─── Stagger Container (slower) ───────────────────────────
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// ─── Stagger Item ─────────────────────────────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// ─── Stagger Item (scale variant) ─────────────────────────
export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// ─── Common viewport config ───────────────────────────────
export const viewportConfig = {
  once: true,
  margin: "-80px",
} as const;

// ─── Reduced motion check ─────────────────────────────────
// Use in useEffect or pass to animate controls
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
