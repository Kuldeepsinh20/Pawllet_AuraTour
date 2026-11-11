import { useEffect } from 'react';
import gsap from 'gsap';
import { ensureMotionEases, SITE_MOTION, prefersReducedMotion, rootRemPx } from '../utils/motionConfig';

export function useButtonMotion(ref, disabled = false) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (disabled) {
      el.style.removeProperty('--button-pill-x');
      el.style.removeProperty('--button-pill-y');
      el.style.removeProperty('--button-text-x');
      el.style.removeProperty('--button-text-y');
      el.style.removeProperty('--button-dot-x');
      el.style.removeProperty('--button-dot-y');
      return undefined;
    }

    ensureMotionEases();
    el.setAttribute('data-button-status', 'ready');

    const hoverMedia = window.matchMedia(SITE_MOTION.media.hover);
    const pullState = { x: 0, y: 0 };
    let isHovered = false;
    let lastEvent = null;

    const getMultiplier = (part) => {
      const { pull, arrow } = SITE_MOTION.button;
      if (part !== 'pill') return pull[part];
      return el.matches('.areas_arrow') ? arrow : pull.pill;
    };

    const applyPullVars = () => {
      Object.keys(SITE_MOTION.button.pull).forEach((part) => {
        const mult = getMultiplier(part);
        el.style.setProperty(`--button-${part}-x`, `${(pullState.x * mult).toFixed(3)}rem`);
        el.style.setProperty(`--button-${part}-y`, `${(pullState.y * mult).toFixed(3)}rem`);
      });
    };

    const animatePull = (x, y, config) => {
      gsap.to(pullState, {
        x,
        y,
        duration: config.duration,
        ease: config.ease,
        overwrite: true,
        onUpdate: applyPullVars,
      });
    };

    const resetPull = () => {
      if (isHovered) {
        animatePull(0, 0, SITE_MOTION.button.back);
      }
      isHovered = false;
    };

    const handlePointer = (event) => {
      if (
        event.pointerType === 'touch' ||
        !hoverMedia.matches ||
        prefersReducedMotion()
      ) {
        return;
      }

      const rect = el.getBoundingClientRect();
      if (
        event.clientX < rect.left - 1 ||
        event.clientX > rect.right + 1 ||
        event.clientY < rect.top - 1 ||
        event.clientY > rect.bottom + 1
      ) {
        resetPull();
        return;
      }

      isHovered = true;
      const rootFontSize = rootRemPx();
      const pillMult = getMultiplier('pill');
      const calcAxis = (pointerPos, edgeStart, size, currentPull) => {
        if (!size) return 0;
        const offsetPx = currentPull * pillMult * rootFontSize;
        return gsap.utils.clamp(-1, 1, (pointerPos - edgeStart - offsetPx) / (size / 2) - 1);
      };

      const nextX = calcAxis(event.clientX, rect.left, rect.width, pullState.x);
      const nextY = calcAxis(event.clientY, rect.top, rect.height, pullState.y);
      animatePull(nextX, nextY, SITE_MOTION.button.follow);
    };

    const onPointerEnter = (event) => {
      lastEvent = event;
      handlePointer(event);
    };
    const onPointerMove = (event) => {
      lastEvent = event;
      handlePointer(event);
    };
    const onPointerLeave = () => {
      lastEvent = null;
      resetPull();
    };

    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (isHovered && lastEvent) {
          handlePointer(lastEvent);
        }
      });
      resizeObserver.observe(el);
    }

    const navbar = el.closest('[data-navbar]');
    let tickerFn = null;
    if (navbar) {
      tickerFn = () => {
        if (!el.matches(':hover, :focus-visible')) return;
        const rect = el.getBoundingClientRect();
        const behind = document
          .elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
          .find((node) => !navbar.contains(node));
        el.style.setProperty(
          '--button-dark',
          (behind && getComputedStyle(behind).getPropertyValue('--button-dark')) || '1'
        );
      };
      gsap.ticker.add(tickerFn);
    }

    return () => {
      el.removeEventListener('pointerenter', onPointerEnter);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      resizeObserver?.disconnect();
      if (tickerFn) gsap.ticker.remove(tickerFn);
      gsap.killTweensOf(pullState);
      el.style.removeProperty('--button-pill-x');
      el.style.removeProperty('--button-pill-y');
      el.style.removeProperty('--button-text-x');
      el.style.removeProperty('--button-text-y');
      el.style.removeProperty('--button-dot-x');
      el.style.removeProperty('--button-dot-y');
    };
  }, [ref, disabled]);
}
