"use client";

import Image from "next/image";

/** Static portrait only — no canvas, no hover, no filters. */
export function HalftoneImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover object-top"
      />
    </div>
  );
}
