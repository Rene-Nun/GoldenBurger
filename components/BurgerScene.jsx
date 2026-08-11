"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html, Environment } from "@react-three/drei";
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
  const FRONT_BASE_X = 0.7;
  const FRONT_TRAVEL_X = -0.7;
  const frontX = FRONT_BASE_X + FRONT_TRAVEL_X * explode;

  const frontScale = 1 - explode * 0.42;
  const decoScale = Math.max(0, 1 - explode / 0.3);

  const SIZE = 0.8;

  return (
    <Canvas
      camera={{ position: [0, 3.4, 6.2], fov: 26 }}
      dpr={[1, 1.5]}
      gl={{ toneMappingExposure: 1.1 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 2]} intensity={2.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />
      <Environment preset="studio" resolution={128} background={false} />

      <Suspense fallback={<LoadingFallback />}>
        {/* Hamburguesa IZQUIERDA — rotación en Z (tercer valor) inclina
            en diagonal hacia su izquierda, como recostada */}
        <group rotation={[-0.15, 0, -0.25]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.92 * decoScale * SIZE}
            position={[-0.7, 0, 0]}
          />
        </group>

        {/* Hamburguesa DERECHA — rotación en Z inclina hacia su derecha */}
        <group rotation={[-0.15, 0, 0.25]}>
          <BurgerModel
            explode={explode}
            axisX={0.6}
            axisY={1}
            showLabels
            scale={frontScale * SIZE}
            position={[frontX, 0, 0]}
          />
        </group>
      </Suspense>
    </Canvas>
  );
}