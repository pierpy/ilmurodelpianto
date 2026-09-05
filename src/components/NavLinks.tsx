"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VOCI = [
  { href: "/", label: "Bacheca" },
  { href: "/nuovo", label: "Scrivi un sonetto" },
  { href: "/classifica", label: "Classifica" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {VOCI.map((voce) => {
        const attivo = voce.href === "/" ? pathname === "/" : pathname.startsWith(voce.href);
        return (
          <Link
            key={voce.href}
            href={voce.href}
            className={`rounded-full px-3.5 py-1.5 transition-colors ${
              attivo
                ? "bg-emerald-700 text-white shadow-sm"
                : "hover:bg-emerald-900/5 dark:hover:bg-white/10"
            }`}
          >
            {voce.label}
          </Link>
        );
      })}
    </>
  );
}
