import { useRef } from 'react';
import VideoBackground from '../components/VideoBackground';
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

const REGISTRATION_CARDS = ['RULES', 'STEPS', 'REGISTER'];

export default function Registration() {
  const regRef = useRef(null);

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
              <div
                className="reg-cards_grid"
                data-reveal-group=""
                data-reveal-stagger="0.12"
              >
                {REGISTRATION_CARDS.map((title) => (
                  <div key={title} className="reg-card" data-reveal="card">
                    <h2 className="reg-card_title">{title}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
