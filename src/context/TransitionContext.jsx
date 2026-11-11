import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createCurtainPolygon, getMidPolygonY } from '../utils/curtainMath';
import { ensureMotionEases, prefersReducedMotion, SITE_MOTION } from '../utils/motionConfig';

const TransitionContext = createContext({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

const CLOSED_POLYGON = 'polygon(0 0, 0 0, 0 0)';

export function TransitionProvider({ children, onBeforeNavigate }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const curtainRef = useRef(null);
  const emblemRef = useRef(null);
  const tweenRef = useRef(null);
  const logoTweenRef = useRef(null);
  const inFlightRef = useRef(false);
  const programmaticNavRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cleanupTweens = useCallback(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
    logoTweenRef.current?.kill();
    logoTweenRef.current = null;
  }, []);

  useEffect(() => {
    ensureMotionEases();
    return () => {
      cleanupTweens();
    };
  }, [cleanupTweens]);

  // Ensure native browser Back/Forward triggers route-entered & ScrollTrigger refresh
  useEffect(() => {
    if (programmaticNavRef.current) {
      programmaticNavRef.current = false;
      return;
    }
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new CustomEvent('pawllet:route-entered', { detail: { pathname } }));
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  const navigateWithTransition = useCallback(
    (to) => {
      if (!to) return;
      const targetPath = to.startsWith('/') ? to : `/${to}`;

      if (targetPath === pathname) {
        onBeforeNavigate?.({ sameRoute: true });
        return;
      }

      if (inFlightRef.current) return;

      const curtain = curtainRef.current;
      const emblem = emblemRef.current;
      const reduced = prefersReducedMotion();

      if (!curtain || reduced) {
        onBeforeNavigate?.({ sameRoute: false });
        programmaticNavRef.current = true;
        navigate(targetPath);
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          window.dispatchEvent(
            new CustomEvent('pawllet:route-entered', { detail: { pathname: targetPath } })
          );
        });
        return;
      }

      ensureMotionEases();
      cleanupTweens();
      inFlightRef.current = true;
      setIsTransitioning(true);

      const { inDuration, outDuration, holdDuration, foldsWide, foldsNarrow, logoPop } =
        SITE_MOTION.curtain;
      const folds = window.matchMedia(SITE_MOTION.media.desktop).matches ? foldsWide : foldsNarrow;
      const buildClip = createCurtainPolygon({
        width: window.innerWidth,
        height: window.innerHeight,
        folds,
      });

      curtain.style.display = 'block';
      curtain.style.clipPath = CLOSED_POLYGON;
      if (emblem) {
        gsap.set(emblem, { xPercent: -50, yPercent: -50, scale: 0, opacity: 1 });
      }

      let logoStarted = false;
      let logoPromise = Promise.resolve();
      const startLogoPop = () => {
        if (logoStarted) return logoPromise;
        logoStarted = true;
        if (!emblem) {
          logoPromise = Promise.resolve();
          return logoPromise;
        }
        logoPromise = new Promise((resolve) => {
          logoTweenRef.current = gsap.to(emblem, {
            scale: 1,
            duration: logoPop.duration,
            ease: logoPop.ease,
            onComplete: () => {
              window.setTimeout(resolve, holdDuration * 1000);
            },
          });
        });
        return logoPromise;
      };

      const progress = { p: 0 };
      const enterDone = new Promise((resolve) => {
        tweenRef.current = gsap.to(progress, {
          p: 1,
          duration: inDuration,
          ease: 'main',
          onUpdate: () => {
            const clip = progress.p < 1 ? buildClip(1, progress.p, true) : 'none';
            curtain.style.clipPath = clip;
            if (!logoStarted && (clip === 'none' || getMidPolygonY(clip) <= window.innerHeight / 2)) {
              startLogoPop();
            }
          },
          onComplete: () => {
            curtain.style.clipPath = 'none';
            startLogoPop().then(resolve);
          },
        });
      });

      enterDone.then(() => {
        onBeforeNavigate?.({ sameRoute: false });
        programmaticNavRef.current = true;
        navigate(targetPath);

        window.scrollTo(0, 0);
        window.lenis?.scrollTo(0, { immediate: true, force: true });

        // Wait two frames for React route mount and CSS layout before lifting curtain
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            window.dispatchEvent(
              new CustomEvent('pawllet:route-entered', { detail: { pathname: targetPath } })
            );

            const exitProgress = { p: 0 };
            const exitClip = createCurtainPolygon({
              width: window.innerWidth,
              height: window.innerHeight,
              folds: window.matchMedia(SITE_MOTION.media.desktop).matches ? foldsWide : foldsNarrow,
            });

            if (emblem) {
              gsap.to(emblem, {
                scale: 0.72,
                opacity: 0,
                duration: 0.25,
                ease: 'smooth',
              });
            }

            tweenRef.current = gsap.to(exitProgress, {
              p: 1,
              duration: outDuration,
              ease: 'main',
              onUpdate: () => {
                curtain.style.clipPath =
                  exitProgress.p < 1 ? exitClip(exitProgress.p, 0, true) : CLOSED_POLYGON;
              },
              onComplete: () => {
                curtain.style.display = 'none';
                curtain.style.clipPath = '';
                if (emblem) {
                  gsap.set(emblem, { scale: 0, opacity: 0 });
                }
                inFlightRef.current = false;
                setIsTransitioning(false);
              },
            });
          });
        });
      });
    },
    [pathname, navigate, onBeforeNavigate, cleanupTweens]
  );

  const value = useMemo(
    () => ({ navigateWithTransition, isTransitioning }),
    [navigateWithTransition, isTransitioning]
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={curtainRef}
        data-barba-curtain=""
        aria-hidden="true"
        className="route-curtain"
      >
        <div ref={emblemRef} className="route-curtain_emblem">
          <img
            src="/assets/logos/PawlletLogo.jpg"
            alt=""
            loading="eager"
            decoding="async"
            className="route-curtain_logo"
          />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function useRouteTransition() {
  return useContext(TransitionContext);
}

