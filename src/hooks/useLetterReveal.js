import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import {
  ensureMotionEases,
  prefersReducedMotion,
  rootRemPx,
  SITE_MOTION,
} from '../utils/motionConfig';

function matchesOnlyFilter(el) {
  const only = (el.getAttribute('data-reveal-only') || '').toLowerCase();
  if (!only) return true;
  if (only === 'mobile') return window.matchMedia(SITE_MOTION.media.mobile).matches;
  if (only === 'desktop') return !window.matchMedia(SITE_MOTION.media.mobile).matches;
  if (only === 'tablet') return window.matchMedia(SITE_MOTION.media.tablet).matches;
  return true;
}

function getRevealOffsetY(mode) {
  if (mode === 'fade' || mode === 'chars' || mode === 'pop') return 0;
  const key = mode === 'fade-up' ? 'fadeUp' : mode;
  const rems = SITE_MOTION.reveal.distance[key] ?? SITE_MOTION.reveal.distance.fadeUp;
  return rems * rootRemPx();
}

function getRevealDuration(el, mode) {
  const custom = parseFloat(el.getAttribute('data-reveal-duration'));
  if (!Number.isNaN(custom)) return custom;
  const key = mode === 'fade-up' ? 'fadeUp' : mode;
  return SITE_MOTION.reveal.duration[key] ?? SITE_MOTION.reveal.duration.fadeUp;
}

/**
 * Unified GSAP SplitText + ScrollTrigger + group reveal hook matching `scripts.js` (`Ml`/`Cf`/`Pf`),
 * with strict React StrictMode restoration and `SplitText.revert()` on completion.
 */
export function useLetterReveal(containerRef) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    ensureMotionEases();
    document.documentElement.setAttribute('data-reveal-state', 'ready');

    const reduced = prefersReducedMotion();
    const targets = [...root.querySelectorAll('[data-reveal]')].filter(matchesOnlyFilter);
    if (!targets.length || reduced) {
      targets.forEach((el) => gsap.set(el, { clearProps: 'opacity,transform' }));
      return undefined;
    }

    const activeSplits = [];
    const scrollTriggers = [];
    const timelines = [];

    const groupContainers = new Map();
    const standalone = [];

    targets.forEach((el) => {
      const groupOwner = el.closest('[data-reveal-group]');
      if (groupOwner && root.contains(groupOwner)) {
        if (!groupContainers.has(groupOwner)) groupContainers.set(groupOwner, []);
        groupContainers.get(groupOwner).push(el);
      } else {
        standalone.push(el);
      }
    });

    const groups = [
      ...[...groupContainers.entries()].map(([owner, els]) => ({ owner, els })),
      ...standalone.map((el) => ({ owner: el, els: [el] })),
    ];

    const revertChars = (el, split) => {
      if (split) {
        split.revert();
      }
      el.style.removeProperty('--reveal-height');
      el.style.removeProperty('--reveal-top');
      el.querySelectorAll('.reveal-char').forEach((n) => n.style.removeProperty('--reveal-top'));
      gsap.set(el, { clearProps: 'opacity,transform,pointerEvents' });
    };

    const prepareCharsSplit = (el) => {
      const rectBefore = el.getBoundingClientRect();
      const split = SplitText.create(el, {
        type: 'words,chars',
        wordsClass: 'reveal-word',
        charsClass: 'reveal-char',
      });
      activeSplits.push({ el, split });

      const chars = split.chars || [];
      el.style.setProperty('--reveal-height', `${rectBefore.height}px`);
      chars.forEach((c) => {
        c.style.setProperty('--reveal-top', `${c.getBoundingClientRect().top - rectBefore.top}px`);
      });

      gsap.set(el, { clearProps: 'opacity' });
      gsap.set(chars, { opacity: 0, scale: 0 });
      return { split, chars };
    };

    // Hide initial targets cleanly before entrance
    targets.forEach((el) => {
      const mode = (el.getAttribute('data-reveal') || 'fade-up').toLowerCase();
      if (mode === 'chars') {
        gsap.set(el, { opacity: 0 });
      } else {
        gsap.set(el, { opacity: 0, y: getRevealOffsetY(mode) });
      }
    });

    const playGroup = (group) => {
      if (group.played) return;
      group.played = true;

      const conf = SITE_MOTION.reveal;
      const isTablet = window.matchMedia(SITE_MOTION.media.tablet).matches;
      const customStagger = parseFloat(group.owner.getAttribute('data-reveal-stagger'));
      const staggerStep = Number.isNaN(customStagger) ? conf.stagger.group : customStagger;

      const prepared = [];
      const tl = gsap.timeline({
        delay: conf.loadDelay,
        defaults: { ease: conf.ease, overwrite: true },
        onComplete: () => {
          prepared.forEach(({ el, mode, split }) => {
            if (mode === 'chars') {
              revertChars(el, split);
            } else {
              gsap.set(el, { clearProps: 'opacity,transform' });
            }
            el.dispatchEvent(new CustomEvent('reveal:done', { bubbles: true }));
          });
        },
      });

      if (isTablet) {
        tl.timeScale(conf.narrow.speed);
      }

      let offset = 0;
      group.els.forEach((el) => {
        const mode = (el.getAttribute('data-reveal') || 'fade-up').toLowerCase();
        const duration = getRevealDuration(el, mode);

        if (mode === 'chars') {
          const { split, chars } = prepareCharsSplit(el);
          prepared.push({ el, mode, split });
          const charStagger = Math.min(
            conf.stagger.chars,
            (conf.most.chars - duration) / Math.max(chars.length - 1, 1)
          );
          tl.to(
            chars,
            {
              scale: 1,
              duration,
              ease: conf.modeEase.chars,
              stagger: charStagger,
            },
            offset
          ).to(
            chars,
            {
              opacity: 1,
              duration: conf.fade,
              ease: conf.modeEase.fade,
              stagger: charStagger,
            },
            offset
          );
        } else if (mode === 'fade') {
          prepared.push({ el, mode, split: null });
          tl.fromTo(
            el,
            { opacity: 0 },
            { opacity: 1, duration, ease: conf.modeEase.fade },
            offset
          );
        } else {
          const startY = getRevealOffsetY(mode);
          prepared.push({ el, mode, split: null });
          tl.fromTo(
            el,
            { opacity: 0, y: startY },
            { opacity: 1, y: 0, duration, ease: conf.ease },
            offset
          );
        }

        if (!el.hasAttribute('data-reveal-with-first')) {
          offset += staggerStep;
        }
      });

      timelines.push(tl);
    };

    const scheduleTriggers = () => {
      const isTablet = window.matchMedia(SITE_MOTION.media.tablet).matches;
      const defaultStart = isTablet ? SITE_MOTION.reveal.narrow.start : SITE_MOTION.reveal.start;

      groups.forEach((group) => {
        const triggerEl = isTablet ? group.els[0] : group.owner;
        const rect = triggerEl.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.96) {
          playGroup(group);
          return;
        }

        const st = ScrollTrigger.create({
          trigger: triggerEl,
          start: group.owner.getAttribute('data-reveal-start') || defaultStart,
          once: true,
          onEnter: () => playGroup(group),
        });
        scrollTriggers.push(st);
      });
    };

    // Coordinate with curtain transition: if a curtain is covering viewport, wait for route-entered
    const curtainEl = document.querySelector('[data-barba-curtain]');
    const curtainActive =
      curtainEl && getComputedStyle(curtainEl).display !== 'none';

    let fallbackTimer = 0;
    const onRouteEntered = () => {
      window.clearTimeout(fallbackTimer);
      scheduleTriggers();
    };

    if (curtainActive) {
      window.addEventListener('pawllet:route-entered', onRouteEntered, { once: true });
      fallbackTimer = window.setTimeout(onRouteEntered, 900);
    } else {
      scheduleTriggers();
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('pawllet:route-entered', onRouteEntered);
      scrollTriggers.forEach((st) => st.kill());
      timelines.forEach((tl) => tl.kill());
      activeSplits.forEach(({ el, split }) => {
        try {
          split.revert();
        } catch {
          // Ignore if already reverted
        }
        el.style.removeProperty('--reveal-height');
        el.style.removeProperty('--reveal-top');
      });
      targets.forEach((el) => gsap.set(el, { clearProps: 'opacity,transform,pointerEvents' }));
    };
  }, [containerRef]);
}
