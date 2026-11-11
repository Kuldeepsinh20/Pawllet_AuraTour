import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useRouteTransition } from '../context/TransitionContext';
import { ensureMotionEases, prefersReducedMotion, SITE_MOTION } from '../utils/motionConfig';

const MENU_ITEMS = [
  { key: 'home', to: '/', label: 'Home' },
  { key: 'registration-page', to: '/registration', label: 'Registration Page' },
  { key: 'about', to: '/about', label: 'ABOUT US' },
];

function routeToMenuKey(pathname) {
  if (pathname === '/registration') return 'registration-page';
  if (pathname === '/about') return 'about';
  return 'home';
}

export default function Sidebar({ isOpen, onClose, menuBtnRef, usedKeyboardRef }) {
  const { pathname } = useLocation();
  const { navigateWithTransition } = useRouteTransition();
  const navRef = useRef(null);
  const linksPanelRef = useRef(null);
  const mediaPanelRef = useRef(null);
  const tlRef = useRef(null);
  const prevOpenRef = useRef(false);

  const currentKey = routeToMenuKey(pathname);
  const [hoveredKey, setHoveredKey] = useState(null);
  const activeMediaKey = hoveredKey || currentKey;

  useEffect(() => {
    const nav = navRef.current;
    const linksPanel = linksPanelRef.current;
    const mediaPanel = mediaPanelRef.current;
    if (!nav || !linksPanel || !mediaPanel) return undefined;

    if (prevOpenRef.current === isOpen) {
      if (!isOpen && !nav.classList.contains('is-open')) {
        nav.setAttribute('data-menu-status', 'ready');
      }
      return undefined;
    }
    prevOpenRef.current = isOpen;

    ensureMotionEases();
    const reduced = prefersReducedMotion();
    tlRef.current?.kill();

    if (isOpen) {
      nav.classList.add('is-open');
      nav.setAttribute('data-menu-status', 'open');
      gsap.set([nav, linksPanel, mediaPanel], { clearProps: 'opacity,transform' });

      if (reduced) {
        tlRef.current = gsap.fromTo(
          nav,
          { opacity: 0 },
          { opacity: 1, duration: SITE_MOTION.duration.fast, ease: 'smooth' }
        );
      } else {
        tlRef.current = gsap
          .timeline()
          .fromTo(
            linksPanel,
            { xPercent: -100 },
            { xPercent: 0, duration: SITE_MOTION.duration.base, ease: 'main' },
            0
          )
          .fromTo(
            mediaPanel,
            { xPercent: 100 },
            { xPercent: 0, duration: SITE_MOTION.duration.base, ease: 'main' },
            0
          );
      }

      if (usedKeyboardRef?.current) {
        nav.querySelector('[data-menu-link]')?.focus({ preventScroll: true });
      }
    } else if (nav.classList.contains('is-open')) {
      nav.setAttribute('data-menu-status', 'closed');
      const finishClose = () => {
        nav.classList.remove('is-open');
        gsap.set([nav, linksPanel, mediaPanel], { clearProps: 'opacity,transform' });
      };

      if (reduced) {
        tlRef.current = gsap.to(nav, {
          opacity: 0,
          duration: SITE_MOTION.duration.fast,
          ease: 'smooth',
          onComplete: finishClose,
        });
      } else {
        tlRef.current = gsap
          .timeline({ onComplete: finishClose })
          .to(
            linksPanel,
            { xPercent: -100, duration: SITE_MOTION.duration.base, ease: 'main' },
            0
          )
          .to(
            mediaPanel,
            { xPercent: 100, duration: SITE_MOTION.duration.base, ease: 'main' },
            0
          );
      }
    } else {
      nav.setAttribute('data-menu-status', 'ready');
    }

    return undefined;
  }, [isOpen, usedKeyboardRef]);

  useEffect(() => {
    const nav = navRef.current;
    const linksPanel = linksPanelRef.current;
    const mediaPanel = mediaPanelRef.current;
    return () => {
      tlRef.current?.kill();
      if (nav) {
        nav.classList.remove('is-open');
        gsap.set([nav, linksPanel, mediaPanel].filter(Boolean), {
          clearProps: 'opacity,transform',
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setHoveredKey(null);
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose({ focusMenuBtn: true });
        return;
      }
      if (event.key === 'Tab' && navRef.current) {
        const headerEl = navRef.current.closest('header') || navRef.current.parentElement;
        if (!headerEl) return;
        const focusables = [...headerEl.querySelectorAll('a[href], button')].filter(
          (node) => node.getClientRects().length > 0 && !node.closest('[inert]')
        );
        if (!focusables.length) return;
        const currentIdx = focusables.indexOf(document.activeElement);
        const nextIdx = event.shiftKey
          ? currentIdx <= 0
            ? focusables.length - 1
            : currentIdx - 1
          : currentIdx === -1 || currentIdx === focusables.length - 1
            ? 0
            : currentIdx + 1;
        event.preventDefault();
        focusables[nextIdx]?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, menuBtnRef]);

  const handleLinkClick = (event, to) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    if (to === pathname) {
      onClose({ focusMenuBtn: false });
      return;
    }
    navigateWithTransition(to);
  };

  return (
    <nav
      ref={navRef}
      id="site-menu"
      aria-label="Menu"
      data-menu=""
      className="menu_component"
      data-menu-status="ready"
    >
      <div
        ref={linksPanelRef}
        data-menu-panel="links"
        className="menu_links"
        data-lenis-prevent=""
        onPointerLeave={() => setHoveredKey(null)}
      >
        {MENU_ITEMS.map((item) => {
          const isCurrent = item.key === currentKey;
          const isHovered = item.key === hoveredKey;
          return (
            <Link
              key={item.key}
              to={item.to}
              data-menu-link={item.key}
              aria-current={isCurrent ? 'page' : undefined}
              className={`menu_link w-inline-block${isCurrent ? ' w--current' : ''}${isHovered ? ' is-active' : ''}`}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                  setHoveredKey(item.key);
                }
              }}
              onFocus={() => setHoveredKey(item.key)}
              onClick={(event) => handleLinkClick(event, item.to)}
            >
              <span className="menu_link-text">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div ref={mediaPanelRef} data-menu-panel="media" aria-hidden="true" className="menu_media">
        <div className="menu_brand-heading">PAWLLET</div>
        {MENU_ITEMS.map((item) => (
          <div
            key={item.key}
            data-menu-image={item.key}
            className={`menu_image menu_logo-circle${activeMediaKey === item.key ? ' is-active' : ''}`}
          >
            <img
              src="/assets/logos/PawlletLogo.jpg"
              alt="PAWLLET Logo"
              loading="lazy"
              className="menu_logo-img"
            />
          </div>
        ))}
        <p
          data-menu-intro="home"
          className={`menu_intro is-home-tagline${activeMediaKey === 'home' ? ' is-active' : ''}`}
        >
          The Journey Begins!
        </p>
        <div className="menu_vignette" />
      </div>
    </nav>
  );
}
