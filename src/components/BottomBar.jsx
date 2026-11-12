import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useButtonMotion } from '../hooks/useButtonMotion';
import { LEGAL_DOCUMENT } from '../data/legalDocument';

function LegalButton({ label, onClick }) {
  const btnRef = useRef(null);
  useButtonMotion(btnRef);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      className="footer_link is-legal footer_legal-btn w-inline-block"
      data-button-status="ready"
    >
      <div className="text-size-small text-weight-semibold text-style-allcaps is-legal">
        {label}
      </div>
    </button>
  );
}

function InstagramLink({ href, label, ariaLabel }) {
  const linkRef = useRef(null);
  useButtonMotion(linkRef);

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      data-button-status="ready"
      className="footer_instagram-link w-inline-block"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="footer_instagram-icon"
      >
        <rect
          x="2.75"
          y="2.75"
          width="18.5"
          height="18.5"
          rx="5.25"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="17.25" cy="6.75" r="1.15" fill="currentColor" />
      </svg>
      <span className="text-size-small text-weight-semibold text-style-allcaps is-legal">
        {label}
      </span>
    </a>
  );
}

function LegalModal({ activeDoc, onClose }) {
  const bodyRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!activeDoc) return undefined;

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
  }, [activeDoc, onClose]);

  if (!activeDoc) return null;

  const isPrivacy = activeDoc === 'privacy';
  const modalTitle = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
  const visibleSections = LEGAL_DOCUMENT.sections.filter((section) =>
    isPrivacy ? section.id === 'privacy' : section.id !== 'privacy'
  );

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
        aria-labelledby="legal-modal-title"
      >
        <div className="legal-modal_header">
          <div className="legal-modal_heading-group">
            <span className="legal-modal_eyebrow">{LEGAL_DOCUMENT.brand}</span>
            <h2 id="legal-modal-title" className="legal-modal_title">
              {modalTitle}
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
          <p className="legal-modal_doc-campaign">{LEGAL_DOCUMENT.campaign}</p>
          <p className="legal-modal_doc-meta">{LEGAL_DOCUMENT.meta}</p>
          <p className="legal-modal_paragraph">{LEGAL_DOCUMENT.intro}</p>

          {visibleSections.map((section, sectionIdx) => {
            const headingText = `${sectionIdx + 1}. ${section.heading.replace(/^\d+\.\s*/, '')}`;
            return (
              <section
                key={section.id}
                id={`legal-section-${section.id}`}
                className="legal-modal_section"
              >
                <h3 className="legal-modal_section-heading">{headingText}</h3>
                {section.blocks.map((block, idx) => {
                  if (block.type === 'h4') {
                    return (
                      <h4 key={idx} className="legal-modal_subheading">
                        {block.text}
                      </h4>
                    );
                  }
                  if (block.type === 'ul') {
                    return (
                      <ul key={idx} className="legal-modal_list">
                        {block.items.map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="legal-modal_paragraph">
                      {block.text}
                    </p>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function BottomBar() {
  const [activeDoc, setActiveDoc] = useState(null);
  const creditsRef = useRef(null);

  useButtonMotion(creditsRef);

  return (
    <>
      <div data-reveal-only="tablet" data-reveal="fade-up" className="footer_bottom">
        <div className="footer_legal">
          <div className="text-size-small text-weight-semibold text-style-allcaps is-legal">
            © 2026 PAWLLET
          </div>
          <a
            ref={creditsRef}
            href="https://kuldeepsinhchauhan.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="footer_link is-legal w-inline-block"
            data-button-status="ready"
          >
            <div className="text-size-small text-weight-semibold text-style-allcaps is-legal">
              Web credits
            </div>
          </a>
        </div>

        <div className="footer_socials footer_instagram-group">
          <InstagramLink
            href="https://www.instagram.com/pawllet.tech?exln=M2x5bjVsdzI0bjQ%3D&utm_source=qr"
            label="PAWLLET"
            ariaLabel="PAWLLET Instagram"
          />
        </div>

        <div className="footer_legal">
          <LegalButton label="Terms & Conditions" onClick={() => setActiveDoc('terms')} />
          <LegalButton label="Privacy Policy" onClick={() => setActiveDoc('privacy')} />
        </div>
      </div>

      <LegalModal activeDoc={activeDoc} onClose={() => setActiveDoc(null)} />
    </>
  );
}
