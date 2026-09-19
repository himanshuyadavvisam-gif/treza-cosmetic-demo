"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { hasWebGL } from "@/lib/webgl";

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uAspect;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime * (0.35 + aSeed * 0.5);
    // Slow upward drift that wraps, plus a lazy sideways sway.
    p.y = mod(p.y + 1.0 + t * 0.045, 2.2) - 1.1;
    p.x += sin(t * 0.9 + aSeed * 40.0 + p.y * 3.0) * 0.025;

    // Cursor repels nearby particles.
    vec2 d = (p.xy - uMouse) * uAspect;
    float dist = length(d);
    float push = smoothstep(0.32, 0.0, dist);
    p.xy += (normalize(d + 1e-5) / uAspect) * push * 0.16;

    gl_Position = vec4(p.xy, 0.0, 1.0);
    gl_PointSize = (1.2 + aSeed * 3.2) * uPixelRatio * (0.6 + p.z);
    vAlpha = (0.18 + 0.7 * aSeed) * (0.5 + p.z);
  }
`;

const FRAGMENT = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(vec3(0.78, 0.88, 0.52) * (0.8 + 0.4 * a), a);
  }
`;

/** Dust / spark particle field that drifts and reacts to the cursor. Renders only while visible. */
export default function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasWebGL()) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      return;
    }

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = mobile ? 1200 : 4200;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);

    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = Math.random() * 2.2 - 1.1;
      positions[i * 3 + 1] = Math.random() * 2.2 - 1.1;
      positions[i * 3 + 2] = Math.random();
      seeds[i] = Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(10, 10) },
      uAspect: { value: new THREE.Vector2(1, 1) },
      uPixelRatio: { value: dpr },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    const scene = new THREE.Scene();
    scene.add(points);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const mouseTarget = new THREE.Vector2(10, 10);
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      renderer.setSize(width, height, false);
      uniforms.uAspect.value.set(width / Math.max(height, 1), 1);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseTarget.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -(((event.clientY - rect.top) / rect.height) * 2 - 1));
    };
    const onLeave = () => mouseTarget.set(10, 10);
    // Listen on the surrounding footer: the canvas sits behind its content.
    const host = canvas.closest("footer") ?? canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    const tick = (time: number) => {
      uniforms.uTime.value = time;
      uniforms.uMouse.value.lerp(mouseTarget, 0.12);
      renderer.render(scene, camera);
    };

    let running = false;
    const visibility = new IntersectionObserver(([entry]) => {
      if (reduced) {
        renderer.render(scene, camera);
        return;
      }
      if (entry.isIntersecting && !running) {
        gsap.ticker.add(tick);
        running = true;
      } else if (!entry.isIntersecting && running) {
        gsap.ticker.remove(tick);
        running = false;
      }
    });
    visibility.observe(canvas);

    return () => {
      gsap.ticker.remove(tick);
      visibility.disconnect();
      observer.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none h-full w-full ${className}`} />;
}
