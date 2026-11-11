import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRouteTransition } from '../context/TransitionContext';
import { useButtonMotion } from '../hooks/useButtonMotion';

export default function RegisterButton({ isMenuOpen }) {
  const { pathname } = useLocation();
  const { navigateWithTransition } = useRouteTransition();
  const btnRef = useRef(null);

  const isHome = pathname === '/';
  const isRegistration = pathname === '/registration';
  const isVisible = (isHome || isRegistration) && !isMenuOpen;

  useButtonMotion(btnRef, !isVisible);

  if (!isHome && !isRegistration) {
    return null;
  }

  const target = isRegistration ? '/about' : '/registration';
  const label = isRegistration ? 'ABOUT' : 'REGISTER';

  const handleClick = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigateWithTransition(target);
  };

  return (
    <Link
      ref={btnRef}
      to={target}
      onClick={handleClick}
      data-button-status="ready"
      aria-hidden={!isVisible ? 'true' : undefined}
      tabIndex={!isVisible ? -1 : undefined}
      className={`hero_register-btn button_wrapper w-inline-block${!isVisible ? ' is-hidden' : ''}`}
    >
      <span className="button_dot" />
      <span className="button_text text-style-allcaps" data-register-label="">
        {label}
      </span>
      <span className="button_dot" />
    </Link>
  );
}
