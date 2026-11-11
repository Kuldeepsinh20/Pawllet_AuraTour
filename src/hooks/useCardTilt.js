import { useEffect } from 'react';
import gsap from 'gsap';
import { ensureMotionEases, prefersReducedMotion, SITE_MOTION } from '../utils/motionConfig';

/**
 * 3D pointer tilt & surface spotlight sheen on hover-capable desktop pointers,
 * preserving full StrictMode cleanup and zero layout shift.
 */
export function useCardTilt(containerRef, selector = '.reg-card, .about-badge_card', maxDeg = 4) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;
    if (!window.matchMedia(SITE_MOTION.media.hover).matches || prefersReducedMotion()) {
      return undefined;
    }

    ensureMotionEases();
    const cards = [...root.querySelectorAll(selector)];
    const cleanups = [];

    cards.forEach((card) => {
      gsap.set(card, { transformPerspective: 960, transformStyle: 'preserve-3d' });

      const onMove = (event) => {
        if (event.pointerType === 'touch' || prefersReducedMotion()) return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width) * 2 - 1);
        const ny = gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);

        card.style.setProperty('--card-glow-x', `${((nx + 1) * 50).toFixed(1)}%`);
        card.style.setProperty('--card-glow-y', `${((ny + 1) * 50).toFixed(1)}%`);

        gsap.to(card, {
          rotateY: nx * maxDeg,
          rotateX: -ny * maxDeg,
          y: -4,
          duration: SITE_MOTION.ticketCard.follow.duration,
          ease: SITE_MOTION.ticketCard.follow.ease,
          overwrite: 'auto',
        });
      };

      const onLeave = () => {
        card.style.removeProperty('--card-glow-x');
        card.style.removeProperty('--card-glow-y');
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          y: 0,
          duration: SITE_MOTION.ticketCard.back.duration,
          ease: 'elastic.out(1, 0.55)',
          overwrite: 'auto',
        });
      };

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);

      cleanups.push(() => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        gsap.killTweensOf(card);
        gsap.set(card, { clearProps: 'transform,transformPerspective,transformStyle' });
        card.style.removeProperty('--card-glow-x');
        card.style.removeProperty('--card-glow-y');
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [containerRef, selector, maxDeg]);
}

