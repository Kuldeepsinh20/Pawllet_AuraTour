import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useRouteTransition } from '../context/TransitionContext';
import { useButtonMotion } from '../hooks/useButtonMotion';

export default function BackButton({ isMenuOpen }) {
  const { pathname } = useLocation();
  const { navigateWithTransition } = useRouteTransition();
  const backBtnRef = useRef(null);

  const isRegistration = pathname === '/registration';
  const isAbout = pathname === '/about';
  const shouldRender = isRegistration || isAbout;
  const targetRoute = isAbout ? '/registration' : '/';

  useButtonMotion(backBtnRef, !shouldRender || isMenuOpen);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const menuBtn = document.querySelector('.navbar_menu');
    const syncBackDimensions = () => {
      const backBtn = backBtnRef.current;
      if (!backBtn || !menuBtn) return;

      // Never sample Menu button dimensions while it is open or mid-tween
      if (isMenuOpen || menuBtn.classList.contains('is-open') || gsap.isTweening(menuBtn)) {
        return;
      }

      const rect = menuBtn.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      if (width > 0 && height > 0) {
        backBtn.style.width = `${width}px`;
        backBtn.style.height = `${height}px`;
        backBtn.style.minWidth = `${width}px`;
        backBtn.style.minHeight = `${height}px`;
      }
    };

    const rafId = requestAnimationFrame(syncBackDimensions);
    const settleTimer = window.setTimeout(syncBackDimensions, 650);
    let resizeObserver = null;
    if (menuBtn && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncBackDimensions);
      resizeObserver.observe(menuBtn);
    }

    window.addEventListener('resize', syncBackDimensions, { passive: true });
    document.fonts?.ready?.then(syncBackDimensions).catch(() => {});

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', syncBackDimensions);
    };
  }, [shouldRender, pathname, isMenuOpen]);

  if (!shouldRender) return null;

  const handleClick = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    navigateWithTransition(targetRoute);
  };

  return (
    <a
      ref={backBtnRef}
      href={targetRoute}
      onClick={handleClick}
      data-anchor-ignore=""
      data-page-back={targetRoute}
      data-button-status="ready"
      aria-hidden={isMenuOpen ? 'true' : undefined}
      tabIndex={isMenuOpen ? -1 : undefined}
      className={`page_back-btn button_wrapper w-inline-block${isMenuOpen ? ' is-hidden' : ''}`}
    >
      <span className="page_back-icon" aria-hidden="true">
        <svg viewBox="0 0 14 14" fill="none" className="page_back-svg">
          <path
            d="M8.75 3.25L5 7L8.75 10.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="button_text text-style-allcaps">BACK</span>
    </a>
  );
}
