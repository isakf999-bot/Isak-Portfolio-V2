"use client";

import { Canvas } from "@react-three/fiber";
import { GlobePlanet, GlobeRig } from "@/components/globe/GlobeMesh";

export function GlobeScene({
  detail,
  reduce,
  active,
  interactive,
  onFail,
}: {
  detail: 5 | 6 | 7;
  reduce: boolean;
  active: boolean;
  interactive: boolean;
  onFail: (log: string) => void;
}) {
  return (
    <Canvas
      className="h-full w-full"
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
      }}
      dpr={[1, 1.5]}
      frameloop={active || interactive ? "always" : "never"}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0.15, 0.35, 3.55], fov: 32, near: 0.1, far: 20 }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor("#ffffff", 1);
        gl.debug.checkShaderErrors = true;
        invalidate();
        const canvas = gl.domElement;
        canvas.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
          },
          false,
        );
        canvas.addEventListener("webglcontextrestored", () => invalidate());
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
      <GlobeRig reduce={reduce} interactive={interactive} />
      <GlobePlanet detail={detail} reduce={reduce} />
    </Canvas>
  );
}
