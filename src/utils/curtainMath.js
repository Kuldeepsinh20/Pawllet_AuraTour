const TWO_PI = 2 * Math.PI;

const SHUTTER_CONF = {
  uneven: 0.02,
  depth: 0.3,
  bounce: 0.4,
  swings: 1.75,
  lag: 0.12,
  sway: 0.035,
  step: 3,
};

/**
 * Exact folded wave clip-path generator ported from scripts.js `As()`.
 */
export function createCurtainPolygon({ width, height, folds, drift = 0 }) {
  const safeHeight = Math.max(1, height);
  const safeFolds = Math.max(1, folds);
  const depth = (SHUTTER_CONF.depth * width) / safeFolds / safeHeight;
  const peak = depth * (1 + SHUTTER_CONF.bounce);
  const samples = Math.max(8, Math.ceil(width / safeFolds / SHUTTER_CONF.step));
  const cosTable = Array.from(
    { length: samples + 1 },
    (_, i) => -Math.cos((Math.PI * i) / samples)
  );
  const unevenCurve = (x) => x + SHUTTER_CONF.uneven * Math.sin(TWO_PI * 1.5 * x);

  return (inProgress, outProgress, reverse = false, trailProgress) => {
    const isEntering = inProgress < 1;
    const progress = isEntering ? inProgress : outProgress;
    const wavePhase = trailProgress ?? progress;
    const driftShift = drift * wavePhase;
    const edgeY = isEntering !== reverse ? safeHeight + 1 : -1;

    const point = (nx, foldIdx, cosVal) => {
      const ripple =
        depth *
        (1 +
          SHUTTER_CONF.bounce *
            Math.sin(TWO_PI * (SHUTTER_CONF.swings * wavePhase - SHUTTER_CONF.lag * foldIdx))) *
        Math.sqrt(Math.max(0, 1 - cosVal * cosVal));
      const base =
        (1 + peak) * progress +
        SHUTTER_CONF.sway *
          Math.sin(Math.PI * progress) *
          Math.sin(TWO_PI * (0.6 * nx - 0.5 * wavePhase)) +
        (isEntering ? -ripple : ripple - peak);
      return `${(nx * (width + 2) - 1).toFixed(1)}px ${(safeHeight * (1 - base)).toFixed(1)}px,`;
    };

    const solveX = (target) => {
      const normalized = (target - driftShift) / safeFolds;
      let guess = normalized;
      for (let iter = 0; iter < 3; iter += 1) {
        guess -=
          (unevenCurve(guess) - normalized) /
          (1 + SHUTTER_CONF.uneven * TWO_PI * 1.5 * Math.cos(TWO_PI * 1.5 * guess));
      }
      return guess;
    };

    const startFold = unevenCurve(0) * safeFolds + driftShift;
    const endFold = unevenCurve(1) * safeFolds + driftShift;
    const firstFold = drift ? Math.floor(startFold) : 0;
    let polygonPoints = point(0, firstFold, 2 * (startFold - firstFold) - 1);

    for (let fold = firstFold; fold < endFold; fold += 1) {
      for (let sample = 1; sample <= samples; sample += 1) {
        const foldedX = fold + (1 + cosTable[sample]) / 2;
        if (foldedX <= startFold) continue;
        if (foldedX >= endFold) break;
        polygonPoints += point(solveX(foldedX), fold, cosTable[sample]);
      }
    }

    const lastFold = drift ? Math.floor(endFold) : safeFolds - 1;
    polygonPoints += point(1, lastFold, 2 * (endFold - lastFold) - 1);

    return `polygon(${polygonPoints}${width + 1}px ${edgeY}px,-1px ${edgeY}px)`;
  };
}

export function getMidPolygonY(clipPath) {
  const inner = clipPath.slice(clipPath.indexOf('(') + 1, -1);
  const pts = inner.split(',').slice(0, -2);
  if (!pts.length) return Number.POSITIVE_INFINITY;
  const mid = pts[Math.round((pts.length - 1) / 2)].trim().split(' ');
  return parseFloat(mid[1]);
}

