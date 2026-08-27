"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RunningHead } from "@/components/RunningHead";
import { StatusPill } from "@/components/StatusPill";
import { navLinks } from "@/lib/nav";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-chrome">
      <div className="site-chrome-inner">
        <div className="min-w-0">
          <Link href="/" className="font-mono-legend" data-cursor="OPEN ↗">
            Isak
          </Link>
          <RunningHead />
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 md:flex"
        >
          {navLinks.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-cursor="OPEN ↗"
                className={`font-mono-legend ${active ? "nav-active" : ""}`}
                data-dive-stagger
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <StatusPill />
          </div>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center border border-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-ink bg-paper md:hidden">
          <nav aria-label="Mobile" className="flex flex-col px-[var(--space-4)] py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-ink py-4 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
