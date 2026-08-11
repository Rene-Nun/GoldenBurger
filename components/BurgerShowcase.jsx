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

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-black">
        {/* Título + subtítulo + CTA — ajusta el copy a lo que necesites */}
        <div className="z-10 flex flex-col items-center gap-6 px-6 text-center">
          <h1 className="font-display text-4xl uppercase tracking-tight text-white sm:text-6xl">
            No cambió
          </h1>
          <p className="max-w-md font-body text-sm text-white/60 sm:text-base">
            Golden Burger vuelve tal como la recordabas: la misma sazón, el
            mismo mostrador, la misma esquina de siempre.
          </p>

          {/* Recuadro CONTENIDO donde vive el modelo 3D — chico, centrado,
              con tamaño fijo para que la explosión de capas nunca se salga */}
          <div className="relative h-[280px] w-[280px] sm:h-[380px] sm:w-[380px]">
            <ErrorBoundary>
              <BurgerScene explode={explode} />
            </ErrorBoundary>
          </div>

          <button className="rounded-full border border-white/30 px-8 py-3 font-display text-xs uppercase tracking-[0.25em] text-white transition hover:bg-white hover:text-black">
            Ver menú
          </button>
        </div>

        <p className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 font-display text-xs uppercase tracking-[0.3em] text-white/40">
          {explode < 0.05
            ? "Desliza para ver qué lleva dentro"
            : "Ingrediente por ingrediente, como siempre"}
        </p>
      </div>
    </section>
  );
}