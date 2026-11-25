import { useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export function Waveform() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const reducedMotion = useReducedMotion();
  return (
    <div ref={ref} className="waveform" aria-hidden="true">
      {Array.from({ length: 63 }, (_, i) => (
        <i
          key={i}
          style={{
            height: `${16 + Math.abs(Math.sin(i * 0.72) * Math.cos(i * 0.17)) * 110}px`,
            animationDelay: `${i * -0.07}s`,
            animationPlayState: visible && !reducedMotion ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}
