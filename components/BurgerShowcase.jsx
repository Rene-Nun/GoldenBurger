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
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Grid de 2 columnas: texto a la izquierda, canvas a la derecha
            ocupando el resto del ancho — en mobile se apila (texto arriba,
            canvas abajo, ambos a ancho completo) */}
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center px-6 sm:grid sm:grid-cols-2 sm:items-center">
          <div className="z-10 flex flex-col items-start gap-6 pt-16 text-left sm:pt-0">
            <h2 className="font-display text-4xl uppercase tracking-tight text-white sm:text-6xl">
              Al carbón,
              <br />
              como siempre
            </h2>
            <p className="max-w-sm font-body text-sm text-white/60 sm:text-base">
              Sabor original y sin igual — la misma receta, el mismo fuego,
              capa por capa.
            </p>
            <button className="rounded-full border border-ember px-8 py-3 font-display text-xs uppercase tracking-[0.25em] text-ember transition hover:bg-ember hover:text-black">
              Menú completo
            </button>
          </div>

          {/* El canvas se sale del grid a propósito (col-span completo,
              posición absoluta) para que la diagonal de la explosión pueda
              cruzar libremente hacia el centro/izquierda de la pantalla
              sin quedar recortada por la columna de la derecha */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <ErrorBoundary>
              <BurgerScene explode={explode} />
            </ErrorBoundary>
          </div>
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