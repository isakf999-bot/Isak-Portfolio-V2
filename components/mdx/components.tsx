import type { ReactNode } from "react";

export function Code({
  file,
  children,
}: {
  file: string;
  children: ReactNode;
}) {
  return (
    <figure className="note-code my-8" data-note-code>
      <figcaption className="note-code-bar font-mono-legend">{file}</figcaption>
      <pre className="overflow-x-auto px-4 py-4">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export const mdxComponents = {
  h2: (props: { children?: ReactNode }) => (
    <h2 className="survey-num mt-12" {...props} />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="mt-8 font-medium tracking-tight" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="mt-5 leading-relaxed text-pretty" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="mt-5 space-y-2" {...props} />
  ),
  li: (props: { children?: ReactNode }) => (
    <li className="flex gap-3" style={{ fontSize: "var(--text-sm)" }}>
      <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-ink" />
      <span>{props.children}</span>
    </li>
  ),
  a: (props: { href?: string; children?: ReactNode }) => (
    <a href={props.href} className="underline underline-offset-4">
      {props.children}
    </a>
  ),
  Code,
};
