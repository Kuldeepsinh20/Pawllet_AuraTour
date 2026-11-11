import { useEffect, useRef, useState } from 'react';

export default function VideoBackground({
  className = '',
  sources = [],
  style,
  poster,
}) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.muted = true;
    video.defaultMuted = true;

    const markReady = () => setIsReady(true);

    if (video.readyState >= 2) {
      markReady();
    } else {
      video.addEventListener('loadeddata', markReady, { once: true });
      video.addEventListener('canplay', markReady, { once: true });
    }

    // Fallback so background video never remains invisible if browser throttles events
    const fallbackTimer = window.setTimeout(markReady, 450);

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      poster={poster}
      className={`${className} bg-video_media${isReady ? ' is-ready' : ''}`}
      style={style}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
