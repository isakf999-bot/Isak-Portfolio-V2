"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Waveform } from "@/components/signal/Waveform";
import { profile } from "@/lib/content";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [mailError, setMailError] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const from = String(data.get("email") ?? "");
    if (!from.includes("@")) {
      setMailError("that email is missing an @");
      return;
    }
    setMailError("");
    const subject = encodeURIComponent(`Portfolio — from ${name || from}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${from}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      <Waveform text={message} />
      <Field label="Name">
        <input
          required
          name="name"
          type="text"
          autoComplete="name"
          placeholder=" "
          className="field"
        />
      </Field>
      <Field label="Email">
        <input
          required
          name="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder=" "
          className="field"
          aria-invalid={mailError ? true : undefined}
          aria-describedby={mailError ? "mail-error" : undefined}
        />
      </Field>
      {mailError ? (
        <p id="mail-error" className="mt-2 font-mono-legend">
          {mailError}
        </p>
      ) : null}
      <Field label="Message">
        <textarea
          required
          name="message"
          rows={6}
          placeholder=" "
          className="field"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </Field>
      <button
        type="submit"
        className="mt-8 rounded-[4px] bg-ink px-[var(--space-4)] py-[var(--space-2)] text-sm text-paper"
      >
        {sent ? "Opening mail…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field-wrap mt-8 block">
      <span className="font-mono-legend field-label">{label}</span>
      {children}
    </label>
  );
}
