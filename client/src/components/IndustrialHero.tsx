import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

export function IndustrialHero() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.2);
    const renderer = new THREE.WebGLRenderer({ antialias: window.innerWidth >= 768, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.15 : 1.4));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const matte = new THREE.MeshStandardMaterial({ color: 0x171717, metalness: 0.9, roughness: 0.28 });
    const lime = new THREE.MeshStandardMaterial({ color: 0x8bd32c, metalness: 0.5, roughness: 0.24, emissive: 0x223800, emissiveIntensity: 0.32 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.85, roughness: 0.38 });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), matte);
    const coreEdges = new THREE.LineSegments(new THREE.EdgesGeometry(core.geometry), new THREE.LineBasicMaterial({ color: 0x8bd32c, transparent: true, opacity: 0.8 }));
    group.add(core, coreEdges);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.045, 10, 64), new THREE.MeshBasicMaterial({ color: 0x8bd32c, transparent: true, opacity: 0.86 }));
    ring.rotation.set(0.8, 0.25, 0.15);
    group.add(ring);

    const bars: THREE.Mesh[] = [];
    for (let index = 0; index < 10; index += 1) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.35 + (index % 4) * 0.3, 0.14), index % 3 === 0 ? lime : dark);
      const angle = (index / 10) * Math.PI * 2;
      bar.position.set(Math.cos(angle) * 2.55, Math.sin(angle) * 1.65, -0.45 + (index % 2) * 0.3);
      bar.rotation.z = angle + Math.PI / 2;
      bars.push(bar);
      group.add(bar);
    }

    scene.add(new THREE.HemisphereLight(0xb8c0a8, 0x050505, 1.15));
    const greenLight = new THREE.PointLight(0x8bd32c, 26, 16);
    greenLight.position.set(2, 2, 4);
    scene.add(greenLight);
    const whiteLight = new THREE.DirectionalLight(0xffffff, 2.4);
    whiteLight.position.set(-4, 3, 5);
    scene.add(whiteLight);

    let pointerX = 0;
    let pointerY = 0;
    let scrollTarget = 0;
    let scrollValue = 0;
    const updateScrollTarget = () => {
      if (reducedMotion) return;
      const rect = mount.getBoundingClientRect();
      const travel = Math.max(rect.height, window.innerHeight * 0.85);
      scrollTarget = Math.min(1, Math.max(0, -rect.top / travel));
    };
    const onScroll = () => updateScrollTarget();
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollTarget();

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frame = 0;
    let reveal = reducedMotion ? 1 : 0;
    let isVisible = true;
    const renderFrame = () => {
      renderer.render(scene, camera);
      if (!readyRef.current) { readyRef.current = true; setReady(true); }
    };
    const animate = () => {
      if (!isVisible || document.hidden) { frame = 0; return; }
      frame = window.requestAnimationFrame(animate);
      if (!reducedMotion) {
        reveal += (1 - reveal) * 0.045;
        scrollValue += (scrollTarget - scrollValue) * 0.08;
        group.scale.setScalar(0.86 + reveal * 0.14 - scrollValue * 0.025);
        group.position.y = -0.16 + reveal * 0.16 + scrollValue * 0.28;
        group.position.z = -scrollValue * 0.55;
        group.rotation.x += (pointerY * 0.08 - group.rotation.x + scrollValue * 0.12) * 0.035;
        group.rotation.y += (pointerX * 0.12 - group.rotation.y + scrollValue * 0.34) * 0.035;
        group.rotation.z += (scrollValue * 0.18 - group.rotation.z) * 0.035;
        core.rotation.y += 0.0025;
        coreEdges.rotation.y += 0.0025;
        ring.rotation.z += 0.002 + scrollValue * 0.0015;
        ring.scale.setScalar(1 + scrollValue * 0.08);
        bars.forEach((bar, index) => { bar.position.z = -0.45 - scrollValue * 0.2 + Math.sin(frame * 0.008 + index) * 0.05; });
      }
      renderFrame();
    };
    const startAnimation = () => { if (!reducedMotion && isVisible && !document.hidden && !frame) animate(); };
    const onVisibilityChange = () => { if (document.hidden) { isVisible = false; if (frame) window.cancelAnimationFrame(frame); frame = 0; } else { isVisible = true; startAnimation(); } };
    const intersectionObserver = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; if (isVisible) startAnimation(); else if (frame) { window.cancelAnimationFrame(frame); frame = 0; } }, { rootMargin: "120px 0px" }) : null;
    intersectionObserver?.observe(mount);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (reducedMotion) renderFrame(); else animate();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      intersectionObserver?.disconnect();
      core.geometry.dispose();
      coreEdges.geometry.dispose();
      ring.geometry.dispose();
      matte.dispose();
      lime.dispose();
      dark.dispose();
      (coreEdges.material as THREE.Material).dispose();
      (ring.material as THREE.Material).dispose();
      bars.forEach(bar => bar.geometry.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className={`industrial-hero-stage ${ready ? "is-ready" : "is-loading"}`} aria-hidden="true"><div className="industrial-loader" role="status" aria-label="Loading 3D signal"><span className="industrial-loader__grid" /><span className="industrial-loader__core" /><span className="industrial-loader__label">Initializing signal / 3D</span><span className="industrial-loader__ticks">01—02—03—04</span></div><div ref={mountRef} className="industrial-hero-canvas absolute inset-0 h-full w-full" /></div>;
}
