import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterButton from './components/RegisterButton';
import BackButton from './components/BackButton';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Registration from './pages/Registration';
import AboutUs from './pages/AboutUs';
import { TransitionProvider } from './context/TransitionContext';
import { useLenisScroll } from './hooks/useLenisScroll';

export default function App() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useLenisScroll({ isPaused: isMenuOpen, pathname });

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleBeforeNavigate = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <TransitionProvider onBeforeNavigate={handleBeforeNavigate}>
      <CookieBanner />
      <div className="page-content" data-barba="wrapper">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <RegisterButton isMenuOpen={isMenuOpen} />
        <BackButton isMenuOpen={isMenuOpen} />
        <main
          className="main-wrapper"
          data-barba="container"
          tabIndex={-1}
          inert={isMenuOpen ? '' : undefined}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </TransitionProvider>
  );
}
