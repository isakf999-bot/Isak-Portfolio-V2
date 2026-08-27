"use client";

import { Canvas } from "@react-three/fiber";
import { StrataMesh, StrataRig } from "@/components/strata/StrataMesh";

export function StrataScene({
  progress,
  reduce,
  onActive,
  onFail,
}: {
  progress: { current: number };
  reduce: boolean;
  onActive: (index: number) => void;
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
        depth: true,
      }}
      camera={{ position: [3.1, 2, 5.2], fov: 28, near: 0.1, far: 40 }}
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
      <StrataRig progress={progress} reduce={reduce} />
      <StrataMesh progress={progress} reduce={reduce} onActive={onActive} />
    </Canvas>
  );
}
