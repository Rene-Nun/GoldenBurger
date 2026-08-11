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
          <p className="font-display text-sm uppercase tracking-[0.2em] text-ink/70">
            No se pudo cargar el modelo 3D
          </p>
          <p className="max-w-sm text-xs text-ink/40">{this.state.error.message}</p>
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

  // El texto del hero desaparece rápido, en el primer 12% del scroll —
  // así el usuario apenas empieza a deslizar y ya siente que "abrió" algo.
  const HERO_FADE_THRESHOLD = 0.12;
  const heroOpacity = Math.max(0, 1 - explode / HERO_FADE_THRESHOLD);
  const heroTranslateY = -explode * 60; // sube y se desvanece, no solo fade plano

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-cream">
        {/* Texto del hero — reemplaza este contenido por el copy real */}
        <div
          className="pointer-events-none absolute top-16 z-10 flex flex-col items-center gap-4 px-6 text-center"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
            transition: "opacity 0.1s linear, transform 0.1s linear",
          }}
        >
          <h1 className="font-display text-5xl uppercase tracking-tight text-ink sm:text-7xl">
            No cambió
          </h1>
          <p className="max-w-md font-body text-base text-ink/60 sm:text-lg">
            Golden Burger vuelve tal como la recordabas: la misma sazón, el
            mismo mostrador, la misma esquina de siempre.
          </p>
        </div>

        {/* Modelo 3D — ocupa toda la sección, queda encima/debajo del texto
            según el z-index; aquí va detrás para que el texto se lea primero */}
        <div className="absolute inset-0 z-0">
          <ErrorBoundary>
            <BurgerScene explode={explode} />
          </ErrorBoundary>
        </div>

        <p className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 font-display text-sm uppercase tracking-[0.3em] text-ink/50">
          {explode < 0.05
            ? "Desliza para ver qué lleva dentro"
            : "Ingrediente por ingrediente, como siempre"}
        </p>
      </div>
    </section>
  );
}