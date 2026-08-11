"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// El Canvas de three.js solo debe existir en el navegador — dynamic +
// ssr:false evita que Next.js intente renderizarlo en el servidor.
const BurgerScene = dynamic(() => import("./BurgerScene"), { ssr: false });

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
    // h-[300vh]: tres pantallas de alto de "scroll recorrido" para que la
    // explosión tenga espacio de sobra para sentirse gradual, no brusca.
    // Ajusta este número si quieres el efecto más rápido o más lento.
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-cream">
        <BurgerScene explode={explode} />

        <p className="absolute bottom-10 font-display text-sm uppercase tracking-[0.3em] text-ink/50">
          {explode < 0.05
            ? "Desliza para ver qué lleva dentro"
            : "Ingrediente por ingrediente, como siempre"}
        </p>
      </div>
    </section>
  );
}