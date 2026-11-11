import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

let pluginsRegistered = false;

export const SITE_MOTION = {
  eases: {
    main: 'M0,0 C0.625,0.05 0,1 1,1',
    energy: 'M0,0 C0.16,1 0.3,1 1,1',
    smooth: 'M0,0 C0.5,0 0.5,1 1,1',
    punch: 'M0,0 C0.34,1.56 0.64,1 1,1',
    relaxed: 'M0,0 C0.42,0 0.58,1 1,1',
    bounce: 'M0,0 C0.35,1.35 0.5,1 1,1',
    softBounce: 'M0,0 C0.25,1.25 0.5,1 1,1',
    pull: 'M0,0 C0.06,0 0.1,-0.035 0.16,-0.035 0.26,-0.035 0.3,1.03 0.55,1.03 0.7,1.03 0.8,1 1,1',
  },
  duration: {
    fast: 0.3,
    base: 0.6,
    slow: 1,
  },
  reveal: {
    ease: 'main',
    modeEase: {
      fade: 'smooth',
      chars: 'bounce',
      pop: 'softBounce',
      label: 'softBounce',
    },
    start: 'top 85%',
    narrow: {
      start: 'top bottom',
      speed: 2,
    },
    loadDelay: 0.12,
    duration: {
      fadeUp: 0.8,
      card: 1,
      fade: 0.6,
      chars: 0.6,
      pop: 0.6,
      label: 0.6,
    },
    distance: {
      fadeUp: 1,
      card: 2.5,
    },
    stagger: {
      group: 0.15,
      cards: 0.1,
      chars: 0.01,
      words: 0.02,
      label: 0,
    },
    most: {
      chars: 1.2,
    },
    fade: 0.2,
  },
  menuButton: {
    out: 0.2,
    in: 0.4,
  },
  button: {
    pull: {
      pill: 0.5,
      text: 0.25,
      dot: 0.125,
    },
    arrow: 0.125,
    follow: {
      duration: 0.6,
      ease: 'back.out(2.5)',
    },
    back: {
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)',
    },
  },
  titlePop: {
    duck: 0.3,
    squash: 0.15,
    lean: 0.9,
    near: 0.5,
    peak: 0.1,
    down: { duration: 0.12, ease: 'power2.out' },
    spring: { rise: 0.16, rest: 0.8 },
  },
  ticketCard: {
    follow: { duration: 0.6, ease: 'energy' },
    back: { duration: 0.8, ease: 'energy' },
  },
  curtain: {
    inDuration: 0.55,
    outDuration: 0.72,
    holdDuration: 0.2,
    foldsWide: 8,
    foldsNarrow: 4,
    logoPop: { duration: 0.42, ease: 'back.out(2.6)' },
  },
  media: {
    mobile: '(max-width: 479px)',
    landscape: '(max-width: 767px)',
    tablet: '(max-width: 991px)',
    desktop: '(min-width: 992px)',
    hover: '(hover: hover) and (pointer: fine)',
  },
};

export function ensureMotionEases() {
  if (pluginsRegistered) return;
  gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);
  Object.entries(SITE_MOTION.eases).forEach(([name, path]) => {
    try {
      CustomEase.create(name, path);
    } catch {
      // Safe fallback if already registered
    }
  });
  pluginsRegistered = true;
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function getCubicBezierCss(easeName) {
  const raw = SITE_MOTION.eases[easeName] || SITE_MOTION.eases.smooth;
  const part = raw.split('C')[1]?.trim().split(' ').slice(0, 2).join(',');
  return part ? `cubic-bezier(${part})` : 'ease';
}

export function rootRemPx() {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}
