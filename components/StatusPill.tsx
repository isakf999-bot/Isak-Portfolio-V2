"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

export function StatusPill() {
  const [clock, setClock] = useState("––:––");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: profile.tz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());

    setClock(format());
    const id = window.setInterval(() => setClock(format()), 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="font-mono-legend flex items-center gap-2">
      <span
        className={`inline-block h-2 w-2 rounded-full border border-ink ${
          profile.available ? "bg-transparent" : "bg-ink"
        }`}
        aria-hidden="true"
      />
      <span>
        {clock} {profile.city} · {profile.available ? "Open" : "Booked"}
      </span>
    </p>
  );
}
