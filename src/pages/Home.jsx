import { useRef } from 'react';
import VideoBackground from '../components/VideoBackground';
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

  useLetterReveal(homeRef);
  useTitlePop(homeRef);

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
          <VideoBackground
            className="hero_video"
            sources={HERO_VIDEO_SOURCES}
            style={{ '--shutter-pass': 0 }}
          />
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
