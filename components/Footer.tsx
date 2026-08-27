import Link from "next/link";
import { CopyMail } from "@/components/CopyMail";
import { profile } from "@/lib/content";
import { navLinks } from "@/lib/nav";
import { BUILD_DATE } from "@/lib/plate";

export function Footer() {
  return (
    <footer className="border-t border-ink bg-paper">
      <div className="mx-auto grid max-w-6xl gap-[var(--space-8)] px-[var(--space-4)] py-[var(--space-8)] lg:grid-cols-4 lg:px-[var(--space-8)]">
        <div>
          <p className="font-mono-legend">Legend</p>
          <p className="mt-3 max-w-[28ch]" style={{ fontSize: "var(--text-sm)" }}>
            {profile.name}. Fullstack. {profile.city}. Sites that feel finished.
          </p>
        </div>
        <div>
          <p className="font-mono-legend">Index</p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-mono-legend">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono-legend">Signal</p>
          <div className="mt-3">
            <CopyMail email={profile.email} />
          </div>
          <p className="mt-2">
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="font-mono-legend">
              {profile.phone}
            </a>
          </p>
          <p className="mt-2">
            <a
              href="https://www.isakweb.se/"
              className="font-mono-legend"
              target="_blank"
              rel="noreferrer"
            >
              isakweb.se ↗
            </a>
          </p>
          <p className="mt-2">
            <Link href="/cv" className="font-mono-legend">
              ↓ CV
            </Link>
          </p>
        </div>
        <div>
          <p className="font-mono-legend">Colophon</p>
          <p className="mt-3 font-mono-legend text-ink-60">
            Satoshi by Indian Type Foundry / Deni Anggara
          </p>
          <p className="mt-2 font-mono-legend text-ink-60">
            Geist Mono by Vercel
          </p>
          <p className="mt-2 font-mono-legend text-ink-60">
            Next.js · React · WebGL
          </p>
          <p className="mt-2 font-mono-legend text-ink-60">
            Set in {profile.city}, Sweden · {BUILD_DATE}
          </p>
        </div>
      </div>
      <div className="border-t border-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-[var(--space-4)] py-3 lg:px-[var(--space-8)]">
          <p className="font-mono-legend">© 2026 {profile.name}</p>
          <a href="#top" className="font-mono-legend">
            ↑ Return
          </a>
        </div>
      </div>
    </footer>
  );
}
