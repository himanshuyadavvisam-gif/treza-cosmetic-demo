"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { damp } from "@/lib/easing";
import { hasWebGL, WIDE_QUERY } from "@/lib/webgl";
import { getVariant, stage } from "@/lib/scrollStore";
import { VARIANTS } from "@/lib/showcase";
import { BOTTLE_HEIGHT_OVER_RADIUS, BOTTLE_PROFILE } from "./bottleProfile";
import { resolveAnchors, samplePose, PLINTH_REST, type Anchor, type Pose } from "./stageTimeline";

/** World height of the bottle at scale 1 (the camera frames ~5.4 units vertically). */
const BOTTLE_H = 3.2;
const BOTTLE_R = BOTTLE_H / BOTTLE_HEIGHT_OVER_RADIUS;
const CAMERA_Z = 10;
const FOV = 30;

function buildBottleGeometry(): THREE.LatheGeometry {
  const points = [new THREE.Vector2(0.0005, -BOTTLE_H / 2)];
  for (const [r, h] of BOTTLE_PROFILE) points.push(new THREE.Vector2(Math.max(r * BOTTLE_R, 0.0005), h * BOTTLE_H - BOTTLE_H / 2));
  const last = BOTTLE_PROFILE[BOTTLE_PROFILE.length - 1];
  points.push(new THREE.Vector2(0.0005, last[1] * BOTTLE_H - BOTTLE_H / 2));

  // phiStart = π puts u = 0.5 (the front label) facing the camera.
  const geometry = new THREE.LatheGeometry(points, 128, Math.PI, Math.PI * 2);
  // Lathe V follows point index; remap it to true height so the label is not stretched.
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setY(i, (pos.getY(i) + BOTTLE_H / 2) / BOTTLE_H);
  uv.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function buildShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(28,38,18,0.7)");
  gradient.addColorStop(0.35, "rgba(28,38,18,0.35)");
  gradient.addColorStop(1, "rgba(28,38,18,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = document.documentElement;
    const backdrop = document.getElementById("stage-backdrop");

    if (!hasWebGL()) {
      root.dataset.stage = "off";
      return;
    }
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      root.dataset.stage = "off";
      return;
    }

    // "mobile" = the stacked layout (phones, portrait tablets); poses come from each key's `mobile` override.
    const wideMedia = window.matchMedia(WIDE_QUERY);
    let mobile = !wideMedia.matches;
    let dprCap = mobile ? 1.5 : 1.75;
    let dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.8, CAMERA_Z);
    camera.lookAt(0, 0, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTarget = pmrem.fromScene(room, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.7;

    // Lights: warm key, gold rim from behind, cool fill, plus a sweep light for the hero entrance.
    const key = new THREE.DirectionalLight("#fffaf0", 1.9);
    key.position.set(-4, 5, 6);
    const rim = new THREE.DirectionalLight("#dfe9c0", 1.4);
    rim.position.set(5, 2.5, -4);
    const fill = new THREE.DirectionalLight("#ffffff", 0.5);
    fill.position.set(4, -1, 5);
    const sweep = new THREE.DirectionalLight("#fff3e0", 0);
    sweep.position.set(-8, 1, 5);
    scene.add(new THREE.AmbientLight("#f4f7ea", 0.3), key, rim, fill, sweep);

    // Product: one persistent bottle whose label cross-fades between variants.
    const loader = new THREE.TextureLoader();
    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const loadTexture = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) =>
        loader.load(
          url,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = anisotropy;
            resolve(texture);
          },
          undefined,
          reject,
        ),
      );

    const mix = { value: getVariant() };
    const labelB = { value: null as THREE.Texture | null };
    const bottleMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.42,
      clearcoat: 0.55,
      clearcoatRoughness: 0.28,
      envMapIntensity: 0.9,
    });
    bottleMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uMap2 = labelB;
      shader.uniforms.uMix = mix;
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform sampler2D uMap2;\nuniform float uMix;")
        .replace(
          "#include <map_fragment>",
          `#ifdef USE_MAP
            vec4 sampledDiffuseColor = mix(texture2D(map, vMapUv), texture2D(uMap2, vMapUv), uMix);
            diffuseColor *= sampledDiffuseColor;
          #endif`,
        );
    };

    const bottleGeometry = buildBottleGeometry();
    const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
    const spoutGeometry = new THREE.CylinderGeometry(0.032, 0.036, 0.3, 24);
    const spoutMaterial = new THREE.MeshPhysicalMaterial({ color: "#f4f1ec", roughness: 0.35, clearcoat: 0.4 });
    const spout = new THREE.Mesh(spoutGeometry, spoutMaterial);
    spout.rotation.z = Math.PI / 2;
    spout.position.set(-0.17, BOTTLE_H / 2 - BOTTLE_H * 0.035, 0);

    const product = new THREE.Group();
    const tilt = new THREE.Group();
    tilt.add(bottle, spout);
    product.add(tilt);
    scene.add(product);

    // Plinth that rises for the formula scene.
    const plinthGeometry = new THREE.CylinderGeometry(1.15, 1.28, 0.6, 96);
    const plinthMaterial = new THREE.MeshStandardMaterial({ color: "#8f977f", roughness: 0.82, metalness: 0 });
    const ringGeometry = new THREE.TorusGeometry(1.15, 0.012, 8, 160);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: "#5a6b2e", metalness: 0.4, roughness: 0.35 });
    const plinth = new THREE.Group();
    const plinthBody = new THREE.Mesh(plinthGeometry, plinthMaterial);
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.3;
    plinth.add(plinthBody, ring);
    scene.add(plinth);

    // Soft contact shadow.
    const shadowTexture = buildShadowTexture();
    const shadowGeometry = new THREE.PlaneGeometry(1, 1);
    const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0 });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    scene.add(shadow);

    // ---- scroll mapping
    let anchors: Anchor[] = [];
    const refreshAnchors = () => {
      anchors = resolveAnchors(window.innerHeight);
    };
    refreshAnchors();
    ScrollTrigger.addEventListener("refresh", refreshAnchors);

    const target: Pose = { x: 0, y: 0, scale: 1, rx: 0, ry: 0, rz: 0, plinth: 0, shadow: 0, glow: 0 };
    samplePose(anchors, window.scrollY, mobile, target);
    const current: Pose = { ...target };
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const intro = { value: 0 };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let resizeQueued = false;
    const onResize = () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => {
        resizeQueued = false;
        mobile = !wideMedia.matches;
        dprCap = mobile ? 1.5 : 1.75;
        // Never climbs back above a level the FPS monitor already dropped to.
        dpr = Math.min(dpr, window.devicePixelRatio || 1, dprCap);
        renderer.setPixelRatio(dpr);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        refreshAnchors();
      });
    };
    window.addEventListener("resize", onResize);

    // ---- adaptive quality (drop DPR when the device can't hold ~45fps)
    let frames = 0;
    let frameTime = 0;
    const adapt = (dt: number) => {
      frames++;
      frameTime += dt;
      if (frames < 90) return;
      const fps = frames / frameTime;
      frames = 0;
      frameTime = 0;
      if (fps < 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      }
    };

    const projected = new THREE.Vector3();
    let wasVisible = true;
    let ready = false;
    let startedAt = 0;

    const tick = (time: number, deltaMs: number) => {
      if (!ready) return;
      const dt = Math.min(deltaMs / 1000, 0.1);
      adapt(dt);

      samplePose(anchors, window.scrollY, mobile, target);
      const lambda = 5.5;
      (Object.keys(current) as (keyof Pose)[]).forEach((field) => {
        current[field] = damp(current[field], target[field], lambda, dt);
      });
      pointer.x = damp(pointer.x, pointer.tx, 3, dt);
      pointer.y = damp(pointer.y, pointer.ty, 3, dt);
      mix.value = damp(mix.value, getVariant(), 7, dt);

      const halfH = CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const halfW = halfH * camera.aspect;
      const t = time - startedAt;

      // Entrance: scale 0.85 -> 1 with a light sweep across the label.
      const introScale = 0.85 + 0.15 * intro.value;
      let scale = current.scale * introScale;
      const pulseK = (performance.now() - stage.pulseAt) / 450;
      if (pulseK > 0 && pulseK < 1) scale *= 1 + 0.03 * Math.sin(pulseK * Math.PI);

      // Idle float only lifts upward, so the bottle never sinks into the plinth.
      const float = (Math.sin((t / 7) * Math.PI * 2) + 1) * 0.03;
      product.position.set(current.x * halfW, current.y * halfH + float, 0);
      product.scale.setScalar(scale);
      product.rotation.set(current.rx, current.ry, current.rz + Math.sin((t / 9) * Math.PI * 2) * 0.015);
      tilt.rotation.set(pointer.y * 0.105, pointer.x * 0.105, 0);

      // Plinth rests under the formula pose and sinks away when not needed.
      const restY = mobile ? PLINTH_REST.mobileY : PLINTH_REST.y;
      const restScale = mobile ? PLINTH_REST.mobileScale : PLINTH_REST.scale;
      const floorY = restY * halfH - (BOTTLE_H * restScale) / 2;
      plinth.visible = current.plinth > 0.01;
      plinth.scale.setScalar(restScale);
      plinth.position.set(current.x * halfW, floorY - 0.3 * restScale - (1 - current.plinth) * 4, 0);

      // Contact shadow: on the plinth when present, otherwise just under the bottle.
      const bottom = product.position.y - (BOTTLE_H * scale) / 2;
      const floor = current.plinth > 0.5 ? floorY : bottom - 0.12;
      const lift = Math.max(0, bottom - floor);
      shadow.position.set(product.position.x, floor + 0.002, 0);
      const spread = BOTTLE_R * 2 * 2.6 * scale * (1 + lift * 1.4);
      shadow.scale.set(spread, spread * 0.8, 1);
      shadowMaterial.opacity = current.shadow * intro.value * Math.max(0, 1 - lift * 0.9);

      if (backdrop) backdrop.style.opacity = current.glow.toFixed(3);

      // Where the product is on screen, for the annotation overlay.
      projected.set(product.position.x, product.position.y, 0).project(camera);
      stage.screen.x = ((projected.x + 1) / 2) * window.innerWidth;
      stage.screen.y = ((1 - projected.y) / 2) * window.innerHeight;
      stage.screen.halfHeight = ((BOTTLE_H * scale) / 2 / (halfH * 2)) * window.innerHeight;
      const visible = Math.abs(current.y) < 1.55;
      stage.screen.visible = visible;

      // Skip GPU work while the product is parked off-screen.
      if (!visible && !wasVisible) return;
      wasVisible = visible;
      renderer.render(scene, camera);
    };

    let disposed = false;
    Promise.all(VARIANTS.slice(0, 2).map((variant) => loadTexture(variant.texture)))
      .then(([a, b]) => {
        if (disposed) {
          a.dispose();
          b.dispose();
          return;
        }
        bottleMaterial.map = a;
        labelB.value = b;
        bottleMaterial.needsUpdate = true;
        renderer.compile(scene, camera);
        ready = true;
        startedAt = gsap.ticker.time;
        stage.ready = true;
        root.dataset.stage = "on";
        gsap.to(intro, { value: 1, duration: 1.8, ease: "expo.out" });
        gsap
          .timeline({ delay: 0.25 })
          .to(sweep, { intensity: 3.2, duration: 0.5, ease: "sine.out" })
          .to(sweep.position, { x: 8, duration: 2.2, ease: "sine.inOut" }, 0)
          .to(sweep, { intensity: 0, duration: 0.8, ease: "sine.in" }, 1.6);
      })
      .catch(() => {
        root.dataset.stage = "off";
      });

    gsap.ticker.add(tick);

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      gsap.killTweensOf([intro, sweep, sweep.position]);
      ScrollTrigger.removeEventListener("refresh", refreshAnchors);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      stage.ready = false;
      stage.screen.visible = false;
      delete root.dataset.stage;
      bottleMaterial.map?.dispose();
      labelB.value?.dispose();
      [bottleGeometry, spoutGeometry, plinthGeometry, ringGeometry, shadowGeometry].forEach((g) => g.dispose());
      [bottleMaterial, spoutMaterial, plinthMaterial, ringMaterial, shadowMaterial].forEach((m) => m.dispose());
      shadowTexture.dispose();
      envTarget.dispose();
      pmrem.dispose();
      room.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (Array.isArray(object.material) ? object.material : [object.material]).forEach((m: THREE.Material) => m.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="stage-canvas pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
