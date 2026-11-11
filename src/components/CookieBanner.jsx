import { useState } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [prefs, setPrefs] = useState({
    preferences: false,
    statistics: false,
    marketing: false,
  });

  if (!visible) return null;

  const closeBanner = () => {
    setVisible(false);
    setExpanded(false);
  };

  return (
    <div
      id="CybotCookiebotDialog"
      className={`tilcb${visible ? ' tilcb--visible' : ''}`}
      data-state={expanded ? 'expanded' : 'collapsed'}
      data-lenis-prevent=""
      role="dialog"
      aria-labelledby="tilcb-title"
      aria-describedby="tilcb-text"
      lang="nl"
      name="CybotCookiebotDialog"
    >
      <div className="tilcb__inner">
        <div className="tilcb__intro">
          <h2 id="tilcb-title" className="tilcb__title" tabIndex={-1}>
            This website uses cookies
          </h2>
          <div id="tilcb-text" className="tilcb__text">
            We use cookies to personalize content and ads, to provide social media features and to
            analyze our traffic. We also share information about your use of our site with our
            social media, advertising and analytics partners who may combine it with other
            information that you&apos;ve provided to them or that they&apos;ve collected from your
            use of their services.
          </div>
        </div>

        <div className="tilcb__levels" id="tilcb-levels" hidden={!expanded}>
          <ul className="tilcb__cats">
            <li className="tilcb__cat">
              <div className="tilcb__cat-top">
                <span className="tilcb__cat-name" id="tilcb-cat-nec">
                  Necessary
                </span>
                <label className="tilcb__switch">
                  <input
                    type="checkbox"
                    role="switch"
                    checked
                    disabled
                    aria-labelledby="tilcb-cat-nec"
                    aria-describedby="tilcb-desc-nec"
                  />
                  <span className="tilcb__slider" aria-hidden="true" />
                </label>
              </div>
              <p className="tilcb__cat-desc" id="tilcb-desc-nec">
                Necessary cookies help make a website more usable by enabling basic functions such
                as page navigation and access to secure areas of the website.
              </p>
            </li>
            <li className="tilcb__cat">
              <div className="tilcb__cat-top">
                <span className="tilcb__cat-name" id="tilcb-cat-pref">
                  Preferences
                </span>
                <label className="tilcb__switch">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={prefs.preferences}
                    onChange={(e) => setPrefs((p) => ({ ...p, preferences: e.target.checked }))}
                    aria-labelledby="tilcb-cat-pref"
                  />
                  <span className="tilcb__slider" aria-hidden="true" />
                </label>
              </div>
            </li>
            <li className="tilcb__cat">
              <div className="tilcb__cat-top">
                <span className="tilcb__cat-name" id="tilcb-cat-stat">
                  Statistics
                </span>
                <label className="tilcb__switch">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={prefs.statistics}
                    onChange={(e) => setPrefs((p) => ({ ...p, statistics: e.target.checked }))}
                    aria-labelledby="tilcb-cat-stat"
                  />
                  <span className="tilcb__slider" aria-hidden="true" />
                </label>
              </div>
            </li>
            <li className="tilcb__cat">
              <div className="tilcb__cat-top">
                <span className="tilcb__cat-name" id="tilcb-cat-mark">
                  Marketing
                </span>
                <label className="tilcb__switch">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={prefs.marketing}
                    onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                    aria-labelledby="tilcb-cat-mark"
                  />
                  <span className="tilcb__slider" aria-hidden="true" />
                </label>
              </div>
            </li>
          </ul>
          <button
            type="button"
            className="tilcb__details-toggle"
            aria-expanded={detailsOpen}
            aria-controls="tilcb-details"
            onClick={() => setDetailsOpen((d) => !d)}
          >
            <span>{detailsOpen ? 'No details' : 'Show details'}</span>
          </button>
        </div>

        <div className="tilcb__actions" hidden={expanded}>
          <button
            type="button"
            className="tilcb__btn"
            aria-expanded={expanded}
            onClick={() => setExpanded(true)}
          >
            To adjust
          </button>
          <button type="button" className="tilcb__btn" onClick={closeBanner}>
            To refuse
          </button>
          <button type="button" className="tilcb__btn" onClick={closeBanner}>
            Allow everything
          </button>
        </div>

        <div className="tilcb__actions" hidden={!expanded}>
          <button type="button" className="tilcb__btn" onClick={closeBanner}>
            Weigeren
          </button>
          <button type="button" className="tilcb__btn" onClick={closeBanner}>
            Selectie toestaan
          </button>
          <button type="button" className="tilcb__btn" onClick={closeBanner}>
            Alles toestaan
          </button>
        </div>
      </div>
    </div>
  );
}

