"use client";

import { useState } from "react";

export function CopyMail({ email }: { email: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      data-cursor="COPY"
      className="text-left"
      onClick={async () => {
        await navigator.clipboard.writeText(email);
        setDone(true);
        window.setTimeout(() => setDone(false), 1600);
      }}
    >
      <span className="font-mono-legend">{done ? "Copied to plate" : email}</span>
    </button>
  );
}
