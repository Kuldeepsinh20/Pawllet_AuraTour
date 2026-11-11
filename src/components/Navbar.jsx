import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Sidebar from './Sidebar';
import { useButtonMotion } from '../hooks/useButtonMotion';
import {
  ensureMotionEases,
  getCubicBezierCss,
  prefersReducedMotion,
  SITE_MOTION,
} from '../utils/motionConfig';

const BOX_OPEN = 'inset 0 0 0 1px rgba(240, 211, 116, 1)';
const BOX_CLOSED = 'inset 0 0 0 1px rgba(240, 211, 116, 0)';

export default function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const menuBtnRef = useRef(null);
  const logoImgRef = useRef(null);
  const closeSvgRef = useRef(null);
  const menuTextRef = useRef(null);
  const closeTextRef = useRef(null);
  const isFirstRender = useRef(true);
  const lastRenderedOpenRef = useRef(isMenuOpen);
  const btnTimelineRef = useRef(null);
  const webAnimsRef = useRef([]);
  const usedKeyboardRef = useRef(false);

  useButtonMotion(menuBtnRef, false);

  useEffect(() => {
    const onKey = () => {
      usedKeyboardRef.current = true;
    };
    const onPointer = () => {
      usedKeyboardRef.current = false;
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer, true);
    };
  }, []);

  const handleClose = useCallback(
    ({ focusMenuBtn = false } = {}) => {
      setIsMenuOpen(false);
      if (focusMenuBtn) {
        menuBtnRef.current?.focus({ preventScroll: true });
      }
    },
    [setIsMenuOpen]
  );

  useEffect(() => {
    const btn = menuBtnRef.current;
    if (!btn) return undefined;

    const stateNodes = [
      btn,
      logoImgRef.current,
      closeSvgRef.current,
      menuTextRef.current,
      closeTextRef.current,
    ].filter(Boolean);

    const setOpenClasses = (open) => {
      stateNodes.forEach((node) => node.classList.toggle('is-open', open));
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastRenderedOpenRef.current = isMenuOpen;
      setOpenClasses(isMenuOpen);
      return undefined;
    }

    // In StrictMode dev re-run, if state matches what we already set visually, keep clean sync
    if (lastRenderedOpenRef.current === isMenuOpen) {
      setOpenClasses(isMenuOpen);
      return undefined;
    }
    lastRenderedOpenRef.current = isMenuOpen;

    ensureMotionEases();
    const reduced = prefersReducedMotion();
    const { out, in: enter } = SITE_MOTION.menuButton;

    btnTimelineRef.current?.kill();
    webAnimsRef.current.splice(0).forEach((anim) => anim.cancel());
    gsap.set(btn, { clearProps: 'width,boxShadow' });

    const partsSelector = '.navbar_button-text, .navbar_icon-svg';
    const getVisibleParts = () =>
      [...btn.querySelectorAll(partsSelector)].filter(
        (node) => getComputedStyle(node).display !== 'none'
      );

    const prevWidth = parseFloat(getComputedStyle(btn).width);
    const prevParts = getVisibleParts();
    const prevSnapshot = new Map(
      prevParts.map((node) => [
        node,
        {
          opacity: getComputedStyle(node).opacity,
          transform: getComputedStyle(node).transform,
        },
      ])
    );

    const wasOpen = btn.classList.contains('is-open');
    setOpenClasses(isMenuOpen);
    const nextWidth = parseFloat(getComputedStyle(btn).width);
    const nextParts = getVisibleParts();
    setOpenClasses(wasOpen);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(btn, { clearProps: 'width,boxShadow' });
        webAnimsRef.current.splice(0).forEach((anim) => anim.cancel());
      },
    });

    if (!(usedKeyboardRef.current && btn.matches(':focus-visible'))) {
      tl.fromTo(
        btn,
        { boxShadow: isMenuOpen ? BOX_CLOSED : BOX_OPEN },
        { boxShadow: isMenuOpen ? BOX_OPEN : BOX_CLOSED, duration: out + enter, ease: 'smooth' },
        0
      );
    }

    if (Math.abs(nextWidth - prevWidth) > 0.5) {
      gsap.set(btn, { width: prevWidth });
      if (reduced) {
        tl.set(btn, { width: nextWidth }, out);
      } else {
        tl.to(btn, { width: nextWidth, duration: out + enter, ease: 'main' }, 0);
      }
    }

    tl.call(() => setOpenClasses(isMenuOpen), [], out);
    btnTimelineRef.current = tl;

    const angle = isMenuOpen ? 90 : -90;
    const outTransform = (el) =>
      reduced
        ? 'none'
        : el.matches('.navbar_button-text')
          ? 'translateY(-100%)'
          : `rotate(${angle}deg) scale(0.5)`;
    const inTransform = (el) =>
      reduced
        ? 'none'
        : el.matches('.navbar_button-text')
          ? 'translateY(100%)'
          : `rotate(${-angle}deg) scale(0.5)`;
    const getEasing = (el, isOut) =>
      getCubicBezierCss(
        reduced || isOut
          ? 'smooth'
          : el.matches('.navbar_button-text')
            ? 'energy'
            : 'softBounce'
      );

    prevParts.forEach((node) => {
      if (typeof node.animate === 'function') {
        webAnimsRef.current.push(
          node.animate(
            [
              { opacity: 1, transform: 'none', ...prevSnapshot.get(node) },
              { opacity: 0, transform: outTransform(node) },
            ],
            { duration: out * 1000, easing: getEasing(node, true), fill: 'forwards' }
          )
        );
      }
    });

    nextParts.forEach((node) => {
      if (typeof node.animate === 'function') {
        webAnimsRef.current.push(
          node.animate(
            [
              { opacity: 0, transform: inTransform(node) },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration: enter * 1000,
              delay: out * 1000,
              easing: getEasing(node, false),
              fill: prevParts.includes(node) ? 'forwards' : 'both',
            }
          )
        );
      }
    });

    return undefined;
  }, [isMenuOpen]);

  useEffect(() => {
    const btn = menuBtnRef.current;
    return () => {
      btnTimelineRef.current?.kill();
      webAnimsRef.current.splice(0).forEach((anim) => anim.cancel());
      if (btn) gsap.set(btn, { clearProps: 'width,boxShadow' });
    };
  }, []);

  const warmSidebarImages = () => {
    const nav = document.getElementById('site-menu');
    if (!nav || !window.matchMedia(SITE_MOTION.media.desktop).matches) return;
    nav.querySelectorAll('img[data-menu-image]').forEach((img) => {
      img.loading = 'eager';
    });
  };

  return (
    <header data-reveal-ignore="" data-navbar="" className="navbar_component">
      <div className="progressive-blur">
        <div className="progressive-blur__layer is--1" />
        <div className="progressive-blur__layer is--2" />
        <div className="progressive-blur__layer is--3" />
      </div>

      <div className="padding-global">
        <div className="navbar_wrapper">
          <div className="navbar_left">
            <button
              ref={menuBtnRef}
              type="button"
              data-menu-toggle=""
              aria-controls="site-menu"
              aria-expanded={isMenuOpen}
              data-menu-state=""
              className="navbar_menu"
              data-button-status="ready"
              onPointerEnter={warmSidebarImages}
              onFocus={warmSidebarImages}
              onTouchStart={warmSidebarImages}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="navbar_icon">
                <img
                  ref={logoImgRef}
                  src="/assets/logos/PawlletLogo.jpg"
                  alt=""
                  aria-hidden="true"
                  data-menu-state=""
                  className="navbar_icon-svg navbar_icon-logo"
                />
                <svg
                  ref={closeSvgRef}
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 14 14"
                  data-menu-state=""
                  className="navbar_icon-svg is-close"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.3125"
                    stroke="currentColor"
                    d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
                  />
                </svg>
              </span>
              <span
                ref={menuTextRef}
                data-menu-state=""
                className="navbar_button-text text-style-allcaps is-menu"
              >
                Menu
              </span>
              <span
                ref={closeTextRef}
                data-menu-state=""
                className="navbar_button-text text-style-allcaps is-menu is-close"
              >
                CLOSE
              </span>
            </button>
          </div>
          <div className="navbar_right" />
        </div>
      </div>

      <Sidebar
        isOpen={isMenuOpen}
        onClose={handleClose}
        menuBtnRef={menuBtnRef}
        usedKeyboardRef={usedKeyboardRef}
      />
    </header>
  );
}
