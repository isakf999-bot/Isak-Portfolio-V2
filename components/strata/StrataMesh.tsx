"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  InstancedMesh,
  Object3D,
  Vector2,
  Vector3,
} from "three";
import { STRATA_COUNT, STRATA_TOP, strata } from "@/lib/strata";
import { wind } from "@/lib/wind";
import { strataFragment, strataVertex } from "@/shaders/strata";

const dummy = new Object3D();

export function StrataRig({
  progress,
  reduce,
}: {
  progress: { current: number };
  reduce: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const look = useRef(new Vector3());
  const pos = useRef(new Vector3(3.1, 0, 5.2));

  useFrame(() => {
    const y = STRATA_TOP - progress.current * STRATA_TOP;
    if (reduce) {
      pos.current.set(3.1, STRATA_TOP * 0.72, 5.2);
    } else {
      pos.current.set(3.1, y, 5.2);
    }
    look.current.set(0, pos.current.y - 0.15, 0);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
    camera.updateMatrixWorld();
  });

  return null;
}

export function StrataMesh({
  progress,
  reduce,
  onActive,
}: {
  progress: { current: number };
  reduce: boolean;
  onActive: (index: number) => void;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const last = useRef(-1);
  const rock = useMemo(() => {
    const data = new Float32Array(STRATA_COUNT);
    strata.forEach((item, i) => {
      data[i] = item.rock;
    });
    return data;
  }, []);
  const index = useMemo(() => {
    const data = new Float32Array(STRATA_COUNT);
    strata.forEach((item, i) => {
      data[i] = item.index;
    });
    return data;
  }, []);

  const uniforms = useMemo(
    () => ({
      uWindTime: { value: 0 },
      uWindDir: { value: new Vector2(1, 0) },
      uWindStrength: { value: 0.35 },
      uGustPhase: { value: 0 },
      uReduce: { value: 0 },
      uActive: { value: STRATA_COUNT - 1 },
    }),
    [],
  );

  useLayoutEffect(() => {
    const inst = mesh.current;
    if (!inst) return;
    strata.forEach((item, i) => {
      dummy.position.set(0, item.y0 + item.height * 0.5, 0);
      dummy.scale.set(1.55, item.height, 0.95);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(() => {
    return () => {
      mesh.current?.geometry.dispose();
      const mat = mesh.current?.material;
      if (mat && !Array.isArray(mat)) mat.dispose();
    };
  }, []);

  useFrame(() => {
    uniforms.uWindTime.value = wind.time;
    uniforms.uWindDir.value.set(wind.direction[0], wind.direction[1]);
    uniforms.uWindStrength.value = wind.strength;
    uniforms.uGustPhase.value = wind.gustPhase;
    uniforms.uReduce.value = reduce ? 1 : 0;
    const y = STRATA_TOP - progress.current * STRATA_TOP;
    let active = strata[strata.length - 1].index;
    for (const item of strata) {
      if (y >= item.y0 - 0.08 && y <= item.y1 + 0.12) active = item.index;
    }
    uniforms.uActive.value = active;
    if (active !== last.current) {
      last.current = active;
      onActive(active);
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, STRATA_COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes.aRock" args={[rock, 1]} />
        <instancedBufferAttribute attach="attributes.aIndex" args={[index, 1]} />
      </boxGeometry>
      <shaderMaterial
        vertexShader={strataVertex}
        fragmentShader={strataFragment}
        uniforms={uniforms}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
