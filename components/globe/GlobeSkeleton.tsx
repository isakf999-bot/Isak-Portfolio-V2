export function GlobeSkeleton() {
  return (
    <svg
      className="h-full w-full text-ink"
      viewBox="0 0 200 200"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="78" fill="#fff" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="100" cy="100" rx="78" ry="28" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      <ellipse cx="100" cy="100" rx="78" ry="52" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="100" y1="22" x2="100" y2="178" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <path
        d="M42 78 C70 70 90 92 118 86 C140 80 156 96 168 90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M38 118 C66 108 96 128 128 116 C148 108 162 124 170 122"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
