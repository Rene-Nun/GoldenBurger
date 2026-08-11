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
          <p className="max-w-sm text-xs text-ink/40">
            {this.state.error.message}
          </p>
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
      <div className="sticky top-0 h-screen overflow-hidden bg-cream">
        {/* Contenedor con tamaño explícito para el Canvas — sin esto,
            el Canvas queda con altura 0 dentro de un flex-col sin flex-1 */}
        <div className="absolute inset-0">
          <ErrorBoundary>
            <BurgerScene explode={explode} />
          </ErrorBoundary>
        </div>

        <p className="absolute bottom-10 left-1/2 -translate-x-1/2 font-display text-sm uppercase tracking-[0.3em] text-ink/50">
          {explode < 0.05
            ? "Desliza para ver qué lleva dentro"
            : "Ingrediente por ingrediente, como siempre"}
        </p>
      </div>
    </section>
  );
}