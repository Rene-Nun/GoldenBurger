"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "El menú", href: "#menu" },
  { label: "Nuestra historia", href: "#historia" },
  { label: "Sucursales", href: "#sucursales" },
  { label: "Prensa", href: "#prensa" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50">
      {/* Nivel superior — franja negra, solo el CTA de ordenar */}
      <div className="bg-charcoal">
        <div className="mx-auto flex h-11 max-w-6xl items-center justify-end px-6 sm:h-12">
          <Link
            href="#ordenar"
            className="rounded-full bg-gold px-5 py-1.5 font-display text-xs uppercase tracking-wide text-charcoal transition-colors hover:bg-white sm:text-sm"
          >
            Ordenar ahora
          </Link>
        </div>
      </div>

      {/* Nivel inferior — franja blanca, con el logo montado sobre la costura */}
      <div className="relative bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          {/* Logo: sale de las dos franjas, como un letrero colgante de fonda */}
          <Link href="/" className="relative z-10 -mt-9 shrink-0 sm:-mt-11">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32">
              <Image
                src="/logo.PNG"
                alt="Golden Burger"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </Link>

          {/* Navegación — desktop */}
          <nav className="hidden items-center gap-8 py-5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-display text-sm uppercase tracking-wide text-ink transition-colors hover:text-ember"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botón hamburguesa — móvil */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            className="relative flex h-5 w-6 flex-col justify-between py-5 md:hidden"
          >
            <span
              className={`h-px w-full bg-ink transition-transform duration-300 ${
                isMenuOpen ? "translate-y-[9px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-ink transition-opacity duration-200 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-px w-full bg-ink transition-transform duration-300 ${
                isMenuOpen ? "-translate-y-[9px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Panel de navegación — móvil */}
        <div
          id="mobile-nav-panel"
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${
            isMenuOpen ? "grid-rows-[1fr] border-t border-ink/10" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 font-display text-lg uppercase tracking-wide text-ink transition-colors hover:text-ember"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}