'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
export default function SmoothScroll() { useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const lenis = new Lenis({ allowNestedScroll: true, lerp: 0.35 }); let frame = 0; const tick = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => { cancelAnimationFrame(frame); lenis.destroy(); }; }, []); return null; }
