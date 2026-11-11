import { useRef } from 'react';
import { useButtonMotion } from '../hooks/useButtonMotion';

function LegalLink({ href, label }) {
  const linkRef = useRef(null);
  useButtonMotion(linkRef);

  return (
    <a
      ref={linkRef}
      href={href}
      className="footer_link is-legal w-inline-block"
      data-button-status="ready"
    >
      <div className="text-size-small text-weight-semibold text-style-allcaps is-legal">
        {label}
      </div>
    </a>
  );
}

export default function BottomBar() {
  return (
    <div data-reveal-only="tablet" data-reveal="fade-up" className="footer_bottom">
      <div className="footer_legal">
        <div className="text-size-small text-weight-semibold text-style-allcaps is-legal">
          © 2026 PAWLLET
        </div>
        <div className="footer_credits-static">
          <div className="text-size-small text-weight-semibold text-style-allcaps is-legal">
            Web credits
          </div>
        </div>
      </div>

      <div className="footer_legal">
        <LegalLink href="/algemene-voorwaarden" label="General Terms and Conditions" />
        <LegalLink href="/privacy-policy" label="Privacy policy" />
      </div>
    </div>
  );
}

