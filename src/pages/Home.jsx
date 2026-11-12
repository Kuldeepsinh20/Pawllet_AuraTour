import { useEffect, useRef, useState } from 'react';
import { useLetterReveal } from '../hooks/useLetterReveal';
import { useTitlePop } from '../hooks/useTitlePop';

const HERO_VIDEO_SOURCES = [
  {
    src: '/assets/videos/hero-concert.mp4',
    type: 'video/mp4',
  },
  {
    src: '/assets/videos/Diljit Dosanjh s RuPay Aura India Tour 2026 - Ahmedabad_1080p.mov',
    type: 'video/quicktime',
  },
];

export default function Home() {
  const homeRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useLetterReveal(homeRef);
  useTitlePop(homeRef);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let cancelled = false;
    let audioUnlocked = false;
    let isAttemptingPlay = false;

    const interactionEvents = ['pointerdown', 'keydown', 'touchend', 'click'];

    const removeUnlockListeners = () => {
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleFirstInteraction, true);
      });
    };

    const addUnlockListeners = () => {
      interactionEvents.forEach((evt) => {
        window.addEventListener(evt, handleFirstInteraction, { capture: true, passive: true });
      });
    };

    const attemptPlayback = async (withAudio) => {
      if (cancelled || isAttemptingPlay) return;
      isAttemptingPlay = true;

      try {
        video.defaultMuted = false;
        video.muted = !withAudio;
        if (withAudio) {
          video.volume = 1;
        }

        await video.play();
        if (cancelled) return;

        if (withAudio) {
          audioUnlocked = true;
          removeUnlockListeners();
        }
      } catch (err) {
        if (cancelled || err?.name === 'AbortError') return;

        if (withAudio) {
          // Browser blocked unmuted autoplay: fall back to muted autoplay and unlock on first gesture
          try {
            video.muted = true;
            await video.play();
          } catch {
            // Ignore if browser restricts muted playback as well
          }
          if (!cancelled && !audioUnlocked) {
            addUnlockListeners();
          }
        }
      } finally {
        isAttemptingPlay = false;
      }
    };

    function handleFirstInteraction() {
      if (cancelled || audioUnlocked) {
        removeUnlockListeners();
        return;
      }
      attemptPlayback(true);
    }

    const onReady = () => {
      if (cancelled) return;
      setIsVideoReady(true);
      if (!audioUnlocked && video.paused) {
        attemptPlayback(true);
      }
    };

    const onError = () => {
      if (cancelled) return;
      setIsVideoReady(true);
    };

    // Wait until metadata/frame data is ready before issuing the initial unmuted play request
    if (video.readyState >= 2) {
      setIsVideoReady(true);
      attemptPlayback(true);
    } else if (video.readyState >= 1) {
      video.addEventListener('canplay', onReady, { once: true });
      attemptPlayback(true);
    } else {
      video.addEventListener('loadedmetadata', onReady, { once: true });
      video.addEventListener('canplay', onReady, { once: true });
    }

    video.addEventListener('error', onError, { once: true });
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) setIsVideoReady(true);
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      removeUnlockListeners();
      video.removeEventListener('loadedmetadata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onError);
      video.muted = true;
      video.pause();
    };
  }, []);

  return (
    <section
      ref={homeRef}
      id="home"
      data-reveal-ignore=""
      data-wf--section---hero--variant="base"
      className="section_hero"
      style={{ '--shutter-after': '#080808' }}
    >
      <div
        data-mode="cover"
        data-shutter-scroll-transition=""
        className="hero_screen"
        data-shutter-scroll-transition-status="ready"
        style={{ clipPath: 'none' }}
      >
        <div className="hero_frame">
          <video
            ref={videoRef}
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className={`hero_video bg-video_media${isVideoReady ? ' is-ready' : ''}`}
            style={{ '--shutter-pass': 0 }}
          >
            {HERO_VIDEO_SOURCES.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        </div>
        <div className="hero_overlay" />
        <div
          data-shutter-scroll-text=""
          className="hero_stage-text"
          style={{ '--shutter-pass': 0 }}
        >
          <h1 className="hero_brand-title" data-reveal="fade-up" data-reveal-duration="0.75">
            PAWLLET X BUZZ BRIGADE
          </h1>
          <p className="hero_bottom-headline" data-reveal="fade-up" data-reveal-duration="0.85">
            <span className="hero_headline-lead">The Ultimate</span>
            <span className="hero_headline-main">GIVEAWAY</span>
          </p>
        </div>
      </div>
    </section>
  );
}
