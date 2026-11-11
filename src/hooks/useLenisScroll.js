import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureMotionEases, prefersReducedMotion } from '../utils/motionConfig';

export function useLenisScroll({ isPaused, pathname }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      window.lenis = null;
      return undefined;
    }

    ensureMotionEases();

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      syncTouch: true,
    });
    lenisRef.current = lenis;
    window.lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    let resizeTimer = 0;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
              lenis.resize();
              ScrollTrigger.refresh();
            }, 120);
          })
        : null;
    resizeObserver?.observe(document.body);

    return () => {
      window.clearTimeout(resizeTimer);
      resizeObserver?.disconnect();
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      if (window.lenis === lenis) {
        window.lenis = null;
      }
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (isPaused) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isPaused]);

  useEffect(() => {
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    lenisRef.current?.resize();
    ScrollTrigger.refresh();
  }, [pathname]);
}
