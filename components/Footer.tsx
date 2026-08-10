import Image from "next/image";
import Link from "next/link";

const menuLinks = [
  { label: "El menú", href: "#menu" },
  { label: "Combos", href: "#combos" },
  { label: "Postres", href: "#postres" },
  { label: "Bebidas", href: "#bebidas" },
];

const marcaLinks = [
  { label: "Nuestra historia", href: "#historia" },
  { label: "Sucursales", href: "#sucursales" },
  { label: "Prensa", href: "#prensa" },
  { label: "Trabaja con nosotros", href: "#empleo" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "TikTok", href: "#", icon: TikTokIcon },
];

export default function Footer() {
  return (
    <footer className="bg-[#BD2F29] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + tagline */}
          <div>
            <div className="relative h-14 w-32">
              <Image
                src="/logo2.PNG"
                alt="Golden Burger"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="mt-4 max-w-[220px] text-sm text-white/80">
              La misma esquina de siempre, desde los 2000.
            </p>
          </div>

          {/* Menú */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-wide text-white/60">
              Menú
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {menuLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marca */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-wide text-white/60">
              Golden Burger
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {marcaLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sucursal + redes */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-wide text-white/60">
              Visítanos
            </h3>
            <p className="mt-4 text-sm text-white/80">
              Av. Principal 123
              <br />
              Cd. Juárez, Chih.
            </p>
            <p className="mt-2 text-sm text-white/80">Todos los días, 12pm – 10pm</p>

            <div className="mt-5 flex items-center gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white transition-colors hover:text-gold"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Golden Burger. Todos los derechos reservados.</p>
          <p>Hecha con nostalgia.</p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5c.2 0 .3 0 .5.03" />
      <path d="M14 3c0 2.5 2 4.5 4.5 4.5" />
    </svg>
  );
}