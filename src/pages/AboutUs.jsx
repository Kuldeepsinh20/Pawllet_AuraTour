import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BottomBar from '../components/BottomBar';
import { useRouteTransition } from '../context/TransitionContext';
import { useButtonMotion } from '../hooks/useButtonMotion';
import { useCardTilt } from '../hooks/useCardTilt';
import { useLetterReveal } from '../hooks/useLetterReveal';
import { useTitlePop } from '../hooks/useTitlePop';

export default function AboutUs() {
  const aboutRef = useRef(null);
  const ctaBtnRef = useRef(null);
  const { navigateWithTransition } = useRouteTransition();

  useLetterReveal(aboutRef);
  useTitlePop(aboutRef);
  useCardTilt(aboutRef, '.about-badge_card', 4);
  useButtonMotion(ctaBtnRef);

  useEffect(() => {
    const root = aboutRef.current;
    if (!root) return undefined;

    const onAnchorClick = (event) => {
      const link = event.target.closest?.('a[href^="#about-"]');
      if (!link) return;
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 24;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (window.lenis) {
        window.lenis.scrollTo(y, reduced ? { immediate: true } : { duration: 1.0 });
      } else {
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      }
    };

    root.addEventListener('click', onAnchorClick);
    return () => root.removeEventListener('click', onAnchorClick);
  }, []);

  const handleCtaClick = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigateWithTransition('/registration');
  };

  return (
    <footer
      ref={aboutRef}
      id="about"
      data-section-fade=""
      className="footer_component"
      style={{
        '--section-fade-other':
          'radial-gradient(50% 50%, rgba(197, 31, 53, 0.24) 0%, rgba(197, 31, 53, 0) 100%), linear-gradient(#080808 0%, #151515 100%)',
        '--section-fade': 1,
        '--section-faded': 1,
      }}
    >
      <div className="section-fade_in" data-layer="" style={{ '--section-fade': 1 }} />
      <div className="container">
        <div className="padding-global padding-section-top">
          <div className="footer_wrapper">
            <div className="about-archive">
              <section
                className="about-unified-card"
                data-reveal-group=""
                data-reveal-stagger="0.12"
                aria-label="About Pawllet"
              >
                <div id="about-dossier" className="about-dossier">
                  <div id="about-pass" className="about-badge_stage">
                    <div className="about-badge_card" data-reveal="fade-up" data-reveal-with-first="">
                      <div className="about-badge_top">
                        <span className="about-badge_dot" aria-hidden="true" />
                        <span className="about-badge_tag" data-reveal="chars">
                          PAWLLET | VERIFIED
                        </span>
                      </div>
                      <div className="about-badge_logo-wrap">
                        <img
                          src="/assets/logos/PawlletLogo.jpg"
                          alt="PAWLLET Logo"
                          loading="eager"
                          decoding="async"
                          className="about-badge_logo-img"
                        />
                      </div>
                    </div>
                  </div>

                  <div id="about-manifesto" className="about-manifesto">
                    <div className="about-section-label" data-reveal="chars">
                      01. THE ORIGIN
                    </div>
                    <blockquote className="about-quote" data-reveal="chars">
                      &ldquo;Pawllet is a centralized digital pet identity and health management
                      platform designed to replace fragmented paper booklets with a single,
                      verifiable digital dossier for your pet.&rdquo;
                    </blockquote>
                    <p className="about-copy" data-reveal="chars">
                      Pawllet transforms pet identity into a seamless digital experience.
                    </p>
                  </div>
                </div>

                <div className="about-cta">
                  <h2 className="about-cta_title" data-reveal="chars">
                    ARE YOU READY TO GRAB YOUR TICKETS?
                  </h2>
                  <Link
                    ref={ctaBtnRef}
                    to="/registration"
                    onClick={handleCtaClick}
                    data-button-status="ready"
                    className="about-ticket-btn button_wrapper w-inline-block"
                  >
                    <span className="button_dot" aria-hidden="true" />
                    <span className="button_text text-style-allcaps">GET REGISTERED</span>
                    <span className="button_dot" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </div>
            <BottomBar />
          </div>
        </div>
      </div>
    </footer>
  );
}
