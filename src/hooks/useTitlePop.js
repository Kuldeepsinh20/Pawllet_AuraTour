import { useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ensureMotionEases, prefersReducedMotion, SITE_MOTION } from '../utils/motionConfig';

function createSpringEase({ duck, peak, spring: { rise, rest } }) {
  const ratio = Math.log(duck / peak);
  const zeta = ratio / Math.sqrt(Math.PI ** 2 + ratio ** 2);
  const omega = Math.PI / rise;
  const decay = (zeta * omega) / Math.sqrt(1 - zeta ** 2);
  return (progress) => {
    if (progress >= 1) return 1;
    const t = progress * rest;
    return 1 - Math.exp(-decay * t) * (Math.cos(omega * t) + (decay / omega) * Math.sin(omega * t));
  };
}

/**
 * Character squash-and-stretch pointer spring interaction (`Sl` / `w1` from `scripts.js`)
 * on heading elements (`h1`, `h2`) for desktop fine-pointer devices.
 */
export function useTitlePop(containerRef) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;
    if (!window.matchMedia(SITE_MOTION.media.hover).matches || prefersReducedMotion()) {
      return undefined;
    }

    ensureMotionEases();
    const springEase = createSpringEase(SITE_MOTION.titlePop);
    const headings = [...root.querySelectorAll('h1, h2')];
    const cleanups = [];

    headings.forEach((heading) => {
      if (!heading.textContent?.trim()) return;

      let state = null;
      let bounds = null;
      let activeIdx = -1;
      let isHovering = false;
      let settleCall = null;

      const isReadyToSplit = () =>
        !heading.querySelector('.reveal-char') &&
        !gsap.isTweening(heading) &&
        parseFloat(getComputedStyle(heading).opacity) > 0.9;

      const splitForHover = () => {
        const split = SplitText.create(heading, {
          type: 'words,chars',
          wordsClass: 'reveal-word',
          charsClass: 'reveal-char',
        });
        const chars = split.chars || [];
        if (!chars.length) {
          split.revert();
          return;
        }
        bounds = heading.getBoundingClientRect();
        const first = chars[0];
        const padTop = parseFloat(getComputedStyle(first).paddingTop) || 0;
        const baselineMarker = document.createElement('span');
        baselineMarker.style.cssText = 'display:inline-block;width:0;height:0';
        first.appendChild(baselineMarker);
        const baselineTop =
          baselineMarker.getBoundingClientRect().top - first.getBoundingClientRect().top;
        baselineMarker.remove();

        const metrics = chars.map((ch) => {
          const r = ch.getBoundingClientRect();
          gsap.set(ch, { transformOrigin: `50% ${baselineTop}px` });
          return {
            x: r.left + r.width / 2 - bounds.left,
            y: r.top + r.height / 2 - bounds.top,
            halfW: Math.max(1, r.width / 2 - padTop),
            line: Math.max(1, r.height - 2 * padTop),
            rise: Math.max(1, baselineTop - padTop),
            duck: 0,
            side: 0,
            set: gsap.quickSetter(ch, 'css'),
          };
        });

        state = { split, first, chars: metrics, tweens: [] };
      };

      const cleanupSplit = () => {
        settleCall?.kill();
        settleCall = null;
        if (!state) return;
        state.tweens.forEach((tw) => tw?.kill());
        if (state.first.isConnected) {
          state.split.revert();
        }
        state = null;
        activeIdx = -1;
      };

      const renderChar = (charObj) => {
        const conf = SITE_MOTION.titlePop;
        const d = charObj.duck;
        const sy = 1 - conf.duck * d;
        const sx = d > 0 ? 1 - (conf.duck - conf.squash) * d : 1 / sy;
        const skew =
          (Math.max(-1, Math.min(1, charObj.side)) *
            conf.lean *
            ((1 - sx) * charObj.halfW)) /
          (sy * Math.max(charObj.rise, charObj.line - charObj.rise));
        charObj.set({
          scaleX: sx,
          scaleY: sy,
          skewX: (-Math.atan(skew) * 180) / Math.PI,
        });
      };

      const popChar = (idx, amount, side) => {
        const conf = SITE_MOTION.titlePop;
        const charObj = state.chars[idx];
        if (!charObj) return;
        const update = () => renderChar(charObj);
        state.tweens[idx]?.kill();
        state.tweens[idx] = gsap
          .timeline()
          .to(charObj, { duck: amount, side, ...conf.down, onUpdate: update })
          .to(charObj, { duck: 0, duration: conf.spring.rest, ease: springEase, onUpdate: update });
      };

      const pickAffected = (px, py) => {
        let closest = -1;
        let bestDist = Infinity;
        state.chars.forEach((ch, idx) => {
          const dist = (ch.x - px) ** 2 + (ch.y - py) ** 2;
          if (dist < bestDist) {
            bestDist = dist;
            closest = idx;
          }
        });
        if (closest < 0) return [];
        const center = state.chars[closest];
        const hits = [[closest, 1, Math.max(-1, Math.min(1, (center.x - px) / center.halfW))]];
        [
          [closest - 1, -1],
          [closest + 1, 1],
        ].forEach(([neighborIdx, dir]) => {
          const neighbor = state.chars[neighborIdx];
          if (neighbor && Math.abs(neighbor.y - center.y) < center.line / 2) {
            hits.push([neighborIdx, SITE_MOTION.titlePop.near, dir]);
          }
        });
        return hits;
      };

      const onPointerMove = (event) => {
        if (event.pointerType !== 'mouse' || prefersReducedMotion()) return;
        if (state && !state.first.isConnected) cleanupSplit();
        if (!state) {
          if (!isReadyToSplit()) return;
          splitForHover();
          if (!state) return;
        }
        isHovering = true;
        if (!bounds) bounds = heading.getBoundingClientRect();
        const hits = pickAffected(event.clientX - bounds.left, event.clientY - bounds.top);
        if (!hits.length || hits[0][0] === activeIdx) return;
        activeIdx = hits[0][0];
        hits.forEach(([idx, amt, dir]) => popChar(idx, amt, dir));
        const conf = SITE_MOTION.titlePop;
        settleCall?.kill();
        settleCall = gsap.delayedCall(conf.down.duration + conf.spring.rest, () => {
          settleCall = null;
          if (!isHovering) cleanupSplit();
        });
      };

      const onPointerLeave = () => {
        isHovering = false;
        activeIdx = -1;
        if (state && !settleCall) {
          cleanupSplit();
        }
      };

      const onScroll = () => {
        bounds = null;
      };

      heading.addEventListener('pointermove', onPointerMove);
      heading.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('scroll', onScroll, { passive: true });

      cleanups.push(() => {
        heading.removeEventListener('pointermove', onPointerMove);
        heading.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', onScroll);
        cleanupSplit();
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [containerRef]);
}

