"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";

const BurgerScene = dynamic(() => import("./BurgerScene"), { ssr: false });

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("BurgerScene error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-white/70">
            No se pudo cargar el modelo 3D
          </p>
          <p className="max-w-sm text-xs text-white/40">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BurgerShowcase() {
  const containerRef = useRef(null);
  const [explode, setExplode] = useState(0);

  useEffect(() => {
    let ticking = false;
    function updateProgress() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / scrollable));
      setExplode(progress);
      ticking = false;
    }
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const TEXT_FADE_THRESHOLD = 0.15;
  const textOpacity = Math.max(0, 1 - explode / TEXT_FADE_THRESHOLD);
  const textTranslateY = -explode * 40;

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Franja diagonal roja de fondo — ajusta los porcentajes del
            clip-path si quieres mover el ángulo o dónde empieza/termina */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundColor: "#BD2F29",
            clipPath: "polygon(38% 0%, 100% 0%, 100% 100%, 22% 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center px-6 sm:grid sm:grid-cols-2 sm:items-center">
          <div
            className="flex flex-col items-start gap-6 pt-16 text-left sm:pt-0"
            style={{
              opacity: textOpacity,
              transform: `translateY(${textTranslateY}px)`,
              transition: "opacity 0.1s linear, transform 0.1s linear",
            }}
          >
            <h2 className="font-display text-4xl uppercase tracking-tight text-white sm:text-6xl">
              Al carbón,
              <br />
              como siempre
            </h2>
            <p className="max-w-sm font-body text-sm text-white/60 sm:text-base">
              Sabor original y sin igual — la misma receta, el mismo fuego,
              capa por capa.
            </p>
            <button
              className="rounded-full px-8 py-3 font-display text-xs uppercase tracking-[0.25em] text-white transition hover:opacity-90"
              style={{ backgroundColor: "#BD2F29" }}
            >
              Menú completo
            </button>
          </div>
        </div>

        {/* Canvas 3D — va después de la franja en el DOM para quedar
            visualmente encima (fondo transparente, se ve la franja
            alrededor del modelo) */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <ErrorBoundary>
            <BurgerScene explode={explode} />
          </ErrorBoundary>
        </div>

        <p
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 font-display text-xs uppercase tracking-[0.3em] text-white/40"
          style={{ opacity: textOpacity, transition: "opacity 0.1s linear" }}
        >
          Desliza para ver qué lleva dentro
        </p>
      </div>
    </section>
  );
}