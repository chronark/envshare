"use client";

import {
  type MutableRefObject,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";

type Particle = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  /** Per-particle spring multiplier (0.75..1.25) — decorrelates arrival times during a morph. */
  springJitter: number;
  /** 0 = invisible, 1 = fully painted. Eases toward 1, or toward 0 while fading. */
  appear: number;
  /** Surplus particle from a prior shape — fade out and cull. */
  fading: boolean;
};

type ParticleTarget = {
  ox: number;
  oy: number;
  size: number;
  alpha: number;
};

export type ParticleFieldProps = {
  src: string;
  /** pixel step when sampling the source image. Lower = denser */
  sampleStep?: number;
  /** alpha cutoff 0-255 for including a pixel as a particle */
  threshold?: number;
  /** multiplier applied to the canvas rendering versus the sampled image */
  renderScale?: number;
  /** base dot size in device pixels */
  dotSize?: number;
  /** how strong the cursor repels dots */
  mouseForce?: number;
  /** radius around the cursor that has repelling force, in device pixels */
  mouseRadius?: number;
  /** spring constant pulling dots back to their origin */
  spring?: number;
  /** viscous damping on velocity */
  damping?: number;
  className?: string;
  /** alignment of the particle cluster inside the canvas */
  align?: "center" | "bottom";
  /** optional color override when `adaptToTheme` is false; defaults to white */
  color?: string;
  /** sample dark pixels instead of bright ones (for dark-on-light source images) */
  invert?: boolean;
  /**
   * When true (default), dot fill follows `html.dark` (light dots on dark, dark dots on light)
   * without resampling the image — only the paint color changes, so toggling theme stays smooth.
   */
  adaptToTheme?: boolean;
  /**
   * POC: parent bumps `current` on keydown (e.g. +0.12); field decays each frame and uses it
   * to add extra drift / twinkle so typing on the auth column subtly animates the figure.
   */
  typingImpulseRef?: MutableRefObject<number>;
  /**
   * When true, keeps every sampled pixel above `threshold` (skips the random luminance thinning).
   * Use for small fixed-size embeds where the default sparse falloff erases the figure.
   */
  denseParticles?: boolean;
};

function subscribeDocumentDark(callback: () => void) {
  const el = document.documentElement;
  const mo = new MutationObserver(callback);
  mo.observe(el, { attributes: true, attributeFilter: ["class"] });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", callback);
  };
}

function getDocumentDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerDarkSnapshot() {
  return false;
}

const TYPING_IMPULSE_ADD = 0.14;
const TYPING_IMPULSE_CAP = 1.35;

const SUBMIT_IMPULSE_PRIMARY = 0.52;
const SUBMIT_IMPULSE_SECOND_MS = 120;
const SUBMIT_IMPULSE_SECONDARY = 0.2;

/** Add energy to `typingImpulseRef` (keyboard, preset chips, etc.). */
export function pulseParticleTypingImpulse(
  impulseRef: MutableRefObject<number>,
  amount = TYPING_IMPULSE_ADD,
) {
  impulseRef.current = Math.min(
    impulseRef.current + amount,
    TYPING_IMPULSE_CAP,
  );
}

/**
 * Stronger two-beat pulse when a form is sent — primary hit plus a quick
 * follow-up while the first is still decaying (reads like a soft “launch”).
 */
export function pulseParticleSubmitImpulse(
  impulseRef: MutableRefObject<number>,
) {
  pulseParticleTypingImpulse(impulseRef, SUBMIT_IMPULSE_PRIMARY);
  window.setTimeout(() => {
    pulseParticleTypingImpulse(impulseRef, SUBMIT_IMPULSE_SECONDARY);
  }, SUBMIT_IMPULSE_SECOND_MS);
}

/** Bump `typingImpulseRef` from a `keydown` handler (used with `ParticleField` typing POC). */
export function bumpParticleTypingImpulse(
  impulseRef: MutableRefObject<number>,
  e: Pick<KeyboardEvent, "repeat" | "metaKey" | "ctrlKey" | "altKey" | "key">,
) {
  if (e.repeat) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "Tab" || e.key === "Escape") return;
  pulseParticleTypingImpulse(impulseRef, TYPING_IMPULSE_ADD);
}

function useDocumentDark() {
  return useSyncExternalStore(
    subscribeDocumentDark,
    getDocumentDarkSnapshot,
    getServerDarkSnapshot,
  );
}

export function ParticleField({
  src,
  sampleStep = 3,
  threshold = 50,
  renderScale = 1,
  dotSize = 1.15,
  mouseForce = 90,
  mouseRadius = 110,
  spring = 0.035,
  damping = 0.86,
  className,
  align = "center",
  color = "rgba(255, 255, 255, 0.92)",
  invert = false,
  adaptToTheme = true,
  typingImpulseRef,
  denseParticles = false,
}: ParticleFieldProps) {
  const isDark = useDocumentDark();
  const fillColorRef = useRef(color);
  fillColorRef.current = adaptToTheme
    ? isDark
      ? "rgba(255, 255, 255, 0.98)"
      : "rgba(10, 12, 16, 1)"
    : color;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const srcRef = useRef(src);
  srcRef.current = src;
  const applySrcRef = useRef<((nextSrc: string) => void) | null>(null);

  const sampleStepRef = useRef(sampleStep);
  sampleStepRef.current = sampleStep;
  const thresholdRef = useRef(threshold);
  thresholdRef.current = threshold;
  const renderScaleRef = useRef(renderScale);
  renderScaleRef.current = renderScale;
  const dotSizeRef = useRef(dotSize);
  dotSizeRef.current = dotSize;
  const mouseForceRef = useRef(mouseForce);
  mouseForceRef.current = mouseForce;
  const mouseRadiusRef = useRef(mouseRadius);
  mouseRadiusRef.current = mouseRadius;
  const springRef = useRef(spring);
  springRef.current = spring;
  const dampingRef = useRef(damping);
  dampingRef.current = damping;
  const alignRef = useRef(align);
  alignRef.current = align;
  const invertRef = useRef(invert);
  invertRef.current = invert;
  const denseParticlesRef = useRef(denseParticles);
  denseParticlesRef.current = denseParticles;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let clusterW = 0;
    let clusterH = 0;
    let offsetX = 0;
    let offsetY = 0;
    let rafId = 0;
    let time = 0;
    let destroyed = false;
    let resizeRaf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let currentImage: HTMLImageElement | null = null;
    let loadToken = 0;

    const ensureCanvasSize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const sampleTargets = (image: HTMLImageElement): ParticleTarget[] => {
      if (!image.width || !image.height) return [];

      const srcRatio = image.width / image.height;
      const dstRatio = width / height;

      let drawW = width;
      let drawH = height;
      if (srcRatio > dstRatio) {
        drawH = height;
        drawW = height * srcRatio;
      } else {
        drawW = width;
        drawH = width / srcRatio;
      }

      drawW *= renderScaleRef.current;
      drawH *= renderScaleRef.current;

      const sampleW = Math.max(80, Math.floor(drawW / sampleStepRef.current));
      const sampleH = Math.max(80, Math.floor(drawH / sampleStepRef.current));

      const off = document.createElement("canvas");
      off.width = sampleW;
      off.height = sampleH;
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return [];
      offCtx.drawImage(image, 0, 0, sampleW, sampleH);
      const data = offCtx.getImageData(0, 0, sampleW, sampleH).data;

      const cellW = drawW / sampleW;
      const cellH = drawH / sampleH;

      clusterW = drawW;
      clusterH = drawH;
      offsetX = (width - clusterW) / 2;
      offsetY =
        alignRef.current === "bottom"
          ? height - clusterH - Math.min(40, height * 0.04)
          : (height - clusterH) / 2;

      const thresholdV = thresholdRef.current;
      const invertV = invertRef.current;
      const denseV = denseParticlesRef.current;
      const dotSizeV = dotSizeRef.current;

      const targets: ParticleTarget[] = [];
      for (let y = 0; y < sampleH; y++) {
        for (let x = 0; x < sampleW; x++) {
          const idx = (y * sampleW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          const rawBrightness = (r + g + b) / 3;
          const brightness = invertV ? 255 - rawBrightness : rawBrightness;
          if (a < 200 || brightness < thresholdV) continue;

          const lum = brightness / 255;
          if (!denseV) {
            const keep =
              lum > 0.8
                ? true
                : lum > 0.5
                  ? Math.random() < 0.85
                  : lum > 0.25
                    ? Math.random() < 0.55
                    : Math.random() < 0.28;
            if (!keep) continue;
          }

          const px = (offsetX + x * cellW + cellW / 2) * dpr;
          const py = (offsetY + y * cellH + cellH / 2) * dpr;

          targets.push({
            ox: px,
            oy: py,
            size: (dotSizeV + lum * 0.9) * dpr,
            alpha: 0.35 + lum * 0.6,
          });
        }
      }
      return targets;
    };

    const randomSpringJitter = () => 0.9 + Math.random() * 0.2;

    const buildFresh = (image: HTMLImageElement) => {
      if (!image.width || !image.height) return;
      ensureCanvasSize();
      const targets = sampleTargets(image);
      particles = targets.map((t) => ({
        ox: t.ox,
        oy: t.oy,
        x: t.ox + (Math.random() - 0.5) * 40,
        y: t.oy + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        size: t.size,
        alpha: t.alpha,
        phase: Math.random() * Math.PI * 2,
        springJitter: randomSpringJitter(),
        appear: 1,
        fading: false,
      }));
    };

    const shuffleIndices = (n: number): number[] => {
      const arr = new Array<number>(n);
      for (let i = 0; i < n; i++) arr[i] = i;
      for (let i = n - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
      return arr;
    };

    const morphTo = (image: HTMLImageElement) => {
      if (!image.width || !image.height) return;
      if (particles.length === 0) {
        buildFresh(image);
        return;
      }
      ensureCanvasSize();
      const targets = sampleTargets(image);

      const n = particles.length;
      const m = targets.length;
      const matched = Math.min(n, m);
      const pOrder = shuffleIndices(n);
      const tOrder = shuffleIndices(m);

      for (let k = 0; k < matched; k++) {
        const p = particles[pOrder[k]];
        const t = targets[tOrder[k]];
        p.ox = t.ox;
        p.oy = t.oy;
        p.size = t.size;
        p.alpha = t.alpha;
        p.fading = false;
        p.springJitter = randomSpringJitter();
      }

      for (let k = matched; k < n; k++) {
        particles[pOrder[k]].fading = true;
      }

      for (let k = matched; k < m; k++) {
        const t = targets[tOrder[k]];
        const angle = Math.random() * Math.PI * 2;
        const dist = (20 + Math.random() * 40) * dpr;
        particles.push({
          ox: t.ox,
          oy: t.oy,
          x: t.ox + Math.cos(angle) * dist,
          y: t.oy + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          size: t.size,
          alpha: t.alpha,
          phase: Math.random() * Math.PI * 2,
          springJitter: randomSpringJitter(),
          appear: 0,
          fading: false,
        });
      }
    };

    const render = () => {
      if (destroyed) return;
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = fillColorRef.current;

      const mouseForceV = mouseForceRef.current;
      const mouseRadiusV = mouseRadiusRef.current;
      const springV = springRef.current;
      const dampingV = dampingRef.current;

      const px = pointerRef.current.x * dpr;
      const py = pointerRef.current.y * dpr;
      const mr = mouseRadiusV * dpr;
      const mr2 = mr * mr;

      let typing = typingImpulseRef?.current ?? 0;
      if (typingImpulseRef && typing > 1e-4) {
        typingImpulseRef.current *= 0.93;
      }
      const typingBoost = 1 + typing * 10;
      const rippleCx = (offsetX + clusterW * 0.5) * dpr;
      const rippleCy = (offsetY + clusterH * 0.48) * dpr;

      let writeIdx = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dxo = p.ox - p.x;
        const dyo = p.oy - p.y;
        const s = springV * p.springJitter;
        p.vx += dxo * s;
        p.vy += dyo * s;

        if (pointerRef.current.active) {
          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < mr2 && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const force = (1 - d / mr) * mouseForceV;
            p.vx += (dx / d) * force * 0.04;
            p.vy += (dy / d) * force * 0.04;
          }
        }

        const drift = Math.sin(time * 0.8 + p.phase) * 0.08;
        p.vx += drift * 0.05 * typingBoost;
        p.vy += Math.cos(time * 0.9 + p.phase) * 0.04 * typingBoost;

        if (typing > 1e-4) {
          p.vx += (Math.random() - 0.5) * typing * 2.8;
          p.vy += (Math.random() - 0.5) * typing * 2.8;
          const rdx = p.x - rippleCx;
          const rdy = p.y - rippleCy;
          const rd = Math.sqrt(rdx * rdx + rdy * rdy) + 0.5;
          const ripple = (typing * 22 * dpr) / rd;
          p.vx += (rdx / rd) * ripple * 0.018;
          p.vy += (rdy / rd) * ripple * 0.018;
        }

        p.vx *= dampingV;
        p.vy *= dampingV;
        p.x += p.vx;
        p.y += p.vy;

        const appearTarget = p.fading ? 0 : 1;
        p.appear += (appearTarget - p.appear) * 0.08;

        if (p.fading && p.appear < 0.02) {
          continue;
        }

        const twinkle =
          0.85 +
          Math.sin(time * (1.4 + typing * 2.2) + p.phase) *
            (0.15 + typing * 0.35);
        ctx.globalAlpha = p.alpha * p.appear * twinkle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (writeIdx !== i) particles[writeIdx] = p;
        writeIdx++;
      }
      if (writeIdx !== particles.length) particles.length = writeIdx;
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(render);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
    };
    const onPointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };

    const ro = new ResizeObserver(() => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (currentImage) buildFresh(currentImage);
        }, 120);
      });
    });

    const loadAndApply = (nextSrc: string, asMorph: boolean) => {
      const token = ++loadToken;
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.decoding = "async";
      image.onload = () => {
        if (destroyed || token !== loadToken) return;
        currentImage = image;
        if (asMorph) morphTo(image);
        else buildFresh(image);
      };
      image.src = nextSrc;
    };

    applySrcRef.current = (nextSrc: string) => loadAndApply(nextSrc, true);

    ro.observe(wrapper);
    rafId = requestAnimationFrame(render);

    loadAndApply(srcRef.current, false);

    wrapper.addEventListener("pointermove", onPointerMove);
    wrapper.addEventListener("pointerleave", onPointerLeave);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
      wrapper.removeEventListener("pointermove", onPointerMove);
      wrapper.removeEventListener("pointerleave", onPointerLeave);
      applySrcRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastAppliedSrcRef = useRef(src);
  useEffect(() => {
    if (lastAppliedSrcRef.current === src) return;
    lastAppliedSrcRef.current = src;
    applySrcRef.current?.(src);
  }, [src]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
