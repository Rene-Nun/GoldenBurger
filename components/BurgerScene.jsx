"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html } from "@react-three/drei";
import BurgerModel from "./BurgerModel";

function LoadingFallback() {
  return (
    <Html center>
      <p className="whitespace-nowrap font-display text-sm uppercase tracking-[0.3em] text-white/50">
        Cargando…
      </p>
    </Html>
  );
}

export default function BurgerScene({ explode = 0 }) {
  const FRONT_BASE_X = 1;
  const FRONT_TRAVEL_X = -1;
  const frontX = FRONT_BASE_X + FRONT_TRAVEL_X * explode;

  const frontScale = 1 - explode * 0.42;
  const decoScale = Math.max(0, 1 - explode / 0.3);

  const STEP_X = 1.7;
  const STEP_Y = 0.4;
  const STEP_Z = -1.9;

  return (
    <Canvas
      camera={{ position: [0, 3.4, 6.4], fov: 26 }}
      dpr={[1, 1.5]}
    >
      {/* Luces básicas simples, sin Environment ni sombras de contacto */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.4} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />

      <Suspense fallback={<LoadingFallback />}>
        <group rotation={[-0.1, -0.25, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.55 * decoScale}
            position={[STEP_X * 2, STEP_Y * 2, STEP_Z * 2]}
          />
        </group>

        <group rotation={[-0.1, -0.15, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.78 * decoScale}
            position={[STEP_X, STEP_Y, STEP_Z]}
          />
        </group>

        <group rotation={[-0.1, 0, 0]}>
          <BurgerModel
            explode={explode}
            axisX={0.6}
            axisY={1}
            showLabels
            scale={frontScale}
            position={[frontX, 0, 0]}
          />
        </group>
      </Suspense>
    </Canvas>
  );
}