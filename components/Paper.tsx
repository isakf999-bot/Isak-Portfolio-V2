"use client";

import { useEffect, useState } from "react";

function tile(): string {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(size, size);
  const data = img.data;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = x / size;
      const ny = y / size;
      const n =
        Math.sin(nx * 6.2 + ny * 1.7) * 0.35 +
        Math.sin(nx * 13.1 - ny * 9.4) * 0.22 +
        Math.sin(nx * 2.1 + ny * 18.6) * 0.18 +
        Math.sin((nx + ny) * 31.0) * 0.08;
      const v = 210 + n * 28;
      const i = (y * size + x) * 4;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

export function Paper() {
  const [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(tile());
  }, []);

  if (!src) return <div className="paper" aria-hidden="true" />;

  return (
    <div
      className="paper"
      aria-hidden="true"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}
