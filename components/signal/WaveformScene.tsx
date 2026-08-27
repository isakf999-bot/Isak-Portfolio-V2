"use client";

import { Canvas } from "@react-three/fiber";
import { WaveformMesh } from "@/components/signal/WaveformMesh";

export function WaveformScene({
  text,
  reduce,
  onFail,
}: {
  text: string;
  reduce: boolean;
  onFail: (log: string) => void;
}) {
  return (
    <Canvas
      className="h-full w-full"
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      dpr={[1, 1.25]}
      frameloop="always"
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0, 3.2], fov: 32, near: 0.1, far: 10 }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor("#ffffff", 1);
        gl.debug.checkShaderErrors = true;
        invalidate();
        const debug = gl.debug as typeof gl.debug & {
          onShaderError?: (
            glCtx: WebGLRenderingContext,
            program: WebGLProgram,
            vs: WebGLShader,
            fs: WebGLShader,
          ) => void;
        };
        debug.onShaderError = (ctx, _program, vs, fs) => {
          const vlog = ctx.getShaderInfoLog(vs) ?? "";
          const flog = ctx.getShaderInfoLog(fs) ?? "";
          onFail(`${vlog}\n${flog}`.trim() || "shader compile failed");
        };
      }}
    >
      <WaveformMesh text={text} reduce={reduce} />
    </Canvas>
  );
}
