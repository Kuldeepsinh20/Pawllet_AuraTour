import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import VideoBackground from '../components/VideoBackground';
import { GIVEAWAY_RULES_CONTENT, GIVEAWAY_STEPS_CONTENT } from '../data/giveawayContent';
import { useButtonMotion } from '../hooks/useButtonMotion';
import { useCardTilt } from '../hooks/useCardTilt';
import { useLetterReveal } from '../hooks/useLetterReveal';
import { useTitlePop } from '../hooks/useTitlePop';

const REGISTRATION_VIDEO_SOURCES = [
  {
    src: '/assets/videos/registration-video.mp4',
    type: 'video/mp4',
  },
  {
    src: '/assets/videos/registration-video.mov',
    type: 'video/quicktime',
  },
];

const REGISTRATION_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfH48bfoQYfe35v1-9SSKvk7muB6ZeEIZ7j-Bb8tCVer22dSg/viewform?usp=publish-editor';

function ViewButton({ onClick, ariaLabel }) {
  const btnRef = useRef(null);
  useButtonMotion(btnRef);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      data-button-status="ready"
      className="reg-card_view-btn button_wrapper w-inline-block"
    >
      <span className="button_dot" aria-hidden="true" />
      <span className="button_text text-style-allcaps">VIEW</span>
      <span className="button_dot" aria-hidden="true" />
    </button>
  );
}

function RegistrationLinkButton() {
  const linkRef = useRef(null);
  useButtonMotion(linkRef);

  return (
    <a
      ref={linkRef}
      href={REGISTRATION_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-button-status="ready"
      className="reg-card_view-btn button_wrapper w-inline-block"
    >
      <span className="button_dot" aria-hidden="true" />
      <span className="button_text text-style-allcaps">REGISTRATION LINK</span>
      <span className="button_dot" aria-hidden="true" />
    </a>
  );
}

function GiveawayModal({ activeModal, onClose }) {
  const bodyRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!activeModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.lenis?.stop();

    const rafId = requestAnimationFrame(() => {
      closeBtnRef.current?.focus({ preventScroll: true });
      if (bodyRef.current) {
        bodyRef.current.scrollTop = 0;
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleKeyDown);
      window.lenis?.start();
    };
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  const isRules = activeModal === 'rules';
  const title = isRules ? GIVEAWAY_RULES_CONTENT.title : GIVEAWAY_STEPS_CONTENT.title;

  return createPortal(
    <div
      className="legal-modal_backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="legal-modal_dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="giveaway-modal-title"
      >
        <div className="legal-modal_header">
          <div className="legal-modal_heading-group">
            <span className="legal-modal_eyebrow">PAWLLET</span>
            <h2 id="giveaway-modal-title" className="legal-modal_title">
              {title}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="legal-modal_close"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div ref={bodyRef} className="legal-modal_body" data-lenis-prevent="">
          {isRules ? (
            <>
              <ol className="giveaway-modal_rules-list">
                {GIVEAWAY_RULES_CONTENT.rules.map((rule) => (
                  <li key={rule.num} className="giveaway-modal_rule-item">
                    <span className="giveaway-modal_rule-num">{rule.num}</span>{' '}
                    <span>{rule.text}</span>
                  </li>
                ))}
              </ol>
              <p className="legal-modal_paragraph giveaway-modal_note">
                <strong className="giveaway-modal_note-label">
                  {GIVEAWAY_RULES_CONTENT.noteLabel}
                </strong>{' '}
                {GIVEAWAY_RULES_CONTENT.noteText}
              </p>
            </>
          ) : (
            <>
              <p className="legal-modal_paragraph giveaway-modal_tagline">
                <em>{GIVEAWAY_STEPS_CONTENT.tagline}</em>
              </p>
              <p className="legal-modal_paragraph">{GIVEAWAY_STEPS_CONTENT.intro}</p>
              {GIVEAWAY_STEPS_CONTENT.sections.map((section) => (
                <section key={section.heading} className="legal-modal_section">
                  <h3 className="legal-modal_section-heading">{section.heading}</h3>
                  <p className="legal-modal_paragraph">{section.body}</p>
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Registration() {
  const regRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);

  useLetterReveal(regRef);
  useTitlePop(regRef);
  useCardTilt(regRef, '.reg-card', 4);

  return (
    <section
      ref={regRef}
      id="registration-page"
      data-reveal-ignore=""
      className="section_video"
      style={{ '--shutter-before': '#080808', '--shutter-after': '#080808' }}
    >
      <div
        data-mode="reveal cover"
        data-shutter-scroll-transition=""
        className="video_screen"
        data-shutter-scroll-transition-status="ready"
      >
        <div className="video_frame">
          <VideoBackground
            className="video_player"
            sources={REGISTRATION_VIDEO_SOURCES}
            style={{ '--shutter-pass': 0 }}
          />
        </div>
        <div className="container">
          <div className="padding-global">
            <div
              data-shutter-scroll-text=""
              className="video_content"
              style={{ '--shutter-pass': 0 }}
            >
              <h1
                className="hero_bottom-headline reg_hero-heading"
                data-reveal="fade-up"
                data-reveal-duration="0.85"
              >
                <span className="hero_headline-lead">The Ultimate</span>
                <span className="hero_headline-main">GIVEAWAY</span>
              </h1>
              <div
                className="reg-cards_grid"
                data-reveal-group=""
                data-reveal-stagger="0.12"
              >
                <div className="reg-card reg-card--has-action" data-reveal="card">
                  <div className="reg-card_body">
                    <h2 className="reg-card_title">RULES</h2>
                    <p className="reg-card_desc">
                      Review the official giveaway rules, eligibility criteria, and entry conditions.
                    </p>
                  </div>
                  <ViewButton
                    ariaLabel="View Giveaway Rules"
                    onClick={() => setActiveModal('rules')}
                  />
                </div>

                <div className="reg-card reg-card--has-action" data-reveal="card">
                  <div className="reg-card_body">
                    <h2 className="reg-card_title">STEPS</h2>
                    <p className="reg-card_desc">
                      Follow the 5 steps to create your Reel, share it, and submit your entry.
                    </p>
                  </div>
                  <ViewButton
                    ariaLabel="View Giveaway Entry Steps"
                    onClick={() => setActiveModal('steps')}
                  />
                </div>

                <div className="reg-card reg-card--has-action" data-reveal="card">
                  <div className="reg-card_body">
                    <h2 className="reg-card_title">REGISTER</h2>
                  </div>
                  <RegistrationLinkButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GiveawayModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </section>
  );
}
