"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  ClampToEdgeWrapping,
  DataTexture,
  FloatType,
  LinearFilter,
  NearestFilter,
  NoColorSpace,
  RGBAFormat,
  Vector2,
} from "three";
import { wind } from "@/lib/wind";
import { waveformFragment, waveformVertex } from "@/shaders/waveform";

const BINS = 64;

function digest(text: string, into: Float32Array) {
  into.fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    const bin = code % BINS;
    into[bin] += 0.14 + (code % 5) * 0.05;
    into[(bin + 7) % BINS] += 0.06;
  }
  for (let i = 0; i < BINS; i += 1) {
    into[i] = Math.min(1.2, into[i]);
  }
}

export function WaveformMesh({
  text,
  reduce,
}: {
  text: string;
  reduce: boolean;
}) {
  const target = useRef(new Float32Array(BINS));
  const current = useRef(new Float32Array(BINS));
  const packed = useRef(new Float32Array(BINS * 4));
  const tex = useMemo(() => {
    const map = new DataTexture(packed.current, BINS, 1, RGBAFormat, FloatType);
    map.magFilter = LinearFilter;
    map.minFilter = NearestFilter;
    map.wrapS = ClampToEdgeWrapping;
    map.wrapT = ClampToEdgeWrapping;
    map.flipY = false;
    map.colorSpace = NoColorSpace;
    map.internalFormat = "RGBA32F";
    map.needsUpdate = true;
    return map;
  }, []);

  const uniforms = useMemo(
    () => ({
      uWindTime: { value: 0 },
      uWindDir: { value: new Vector2(1, 0) },
      uWindStrength: { value: 0.35 },
      uGustPhase: { value: 0 },
      uBins: { value: tex },
      uReduce: { value: 0 },
    }),
    [tex],
  );

  useEffect(() => {
    digest(text, target.current);
  }, [text]);

  useEffect(() => {
    return () => tex.dispose();
  }, [tex]);

  useFrame((_, dt) => {
    uniforms.uWindTime.value = wind.time;
    uniforms.uWindDir.value.set(wind.direction[0], wind.direction[1]);
    uniforms.uWindStrength.value = wind.strength;
    uniforms.uGustPhase.value = wind.gustPhase;
    uniforms.uReduce.value = reduce ? 1 : 0;
    const k = 1 - Math.exp(-dt / 0.09);
    for (let i = 0; i < BINS; i += 1) {
      current.current[i] += (target.current[i] - current.current[i]) * k;
      current.current[i] *= 0.985;
      packed.current[i * 4] = current.current[i];
    }
    tex.needsUpdate = true;
  });

  return (
    <mesh>
      <planeGeometry args={[4.2, 1.15, 128, 1]} />
      <shaderMaterial
        vertexShader={waveformVertex}
        fragmentShader={waveformFragment}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}
