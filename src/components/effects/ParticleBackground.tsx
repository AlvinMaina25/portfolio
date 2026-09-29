import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./ParticleBackground.module.css";

/* Values carried over from legacy/script.js (initParticles). */
const MAX_DIST = 160;
const BLUE = "26, 111, 255";
const GOLD = "201, 162, 39";
const COUNT_DESKTOP = 80;
const COUNT_MOBILE = 30;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
    color: Math.random() > 0.7 ? GOLD : BLUE,
    opacity: Math.random() * 0.5 + 0.2,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.005,
  };
}

/**
 * Ambient network of drifting particles on one fixed canvas behind the page.
 * All animation state lives in refs/closures (no React renders). The loop stops while the
 * tab is hidden and, with reduced motion, never starts: one still frame is drawn instead.
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return; // no canvas support: the page simply has no background effect

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let resizeTimer = 0;

    // Size the canvas to the viewport. Setting canvas.width also clears it.
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const populate = () => {
      const count = width > 768 ? COUNT_DESKTOP : COUNT_MOBILE;
      particles = Array.from({ length: count }, () => createParticle(width, height));
    };
    const setup = () => {
      resizeCanvas();
      populate();
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, width, height);

      // connections (squared distance: no sqrt for pairs that are too far apart)
      const maxSq = MAX_DIST * MAX_DIST;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const sq = dx * dx + dy * dy;
          if (sq < maxSq) {
            const alpha = (1 - Math.sqrt(sq) / MAX_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${BLUE}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        if (move) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += p.pulseSpeed;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }
        const o = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${o})`;
        ctx.fill();
      }
    };

    const loop = () => {
      draw(true);
      frame = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const start = () => {
      if (!frame && document.visibilityState === "visible") frame = window.requestAnimationFrame(loop);
    };

    setup();

    if (reducedMotion) {
      draw(false); // one still frame
    } else {
      start();
    }

    const onVisibility = () => {
      if (reducedMotion) return;
      if (document.visibilityState === "visible") start();
      else stop();
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // Phones fire "resize" whenever the address bar slides in or out while scrolling. Only a
        // change of width (rotation, window resize) reshuffles the particles; a height-only change
        // just resizes the canvas so the network doesn't visibly jump.
        const widthChanged = window.innerWidth !== width;
        resizeCanvas();
        if (widthChanged) populate();
        if (reducedMotion) draw(false);
      }, 250);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
