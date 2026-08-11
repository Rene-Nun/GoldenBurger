"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html, Environment, ContactShadows } from "@react-three/drei";
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
  // La hamburguesa de enfrente arranca junto a la de atrás y viaja
  // hacia el centro exacto de la pantalla.
  const FRONT_BASE_X = 0.9;
  const FRONT_TRAVEL_X = -0.9;
  const frontX = FRONT_BASE_X + FRONT_TRAVEL_X * explode;

  // Se encoge conforme explota — evita que el pan se salga de pantalla.
  const frontScale = 1 - explode * 0.42;

  // La hamburguesa decorativa se desvanece en el primer 30% del scroll.
  const decoScale = Math.max(0, 1 - explode / 0.3);

  return (
    <Canvas
      camera={{ position: [0, 1.1, 7.5], fov: 30 }}
      dpr={[1, 1.5]}
      shadows
      gl={{ toneMappingExposure: 1.1 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />
      <Environment preset="studio" resolution={128} background={false} />

      <Suspense fallback={<LoadingFallback />}>
        {/* Solo 1 hamburguesa decorativa detrás, como en la referencia */}
        <group rotation={[-0.18, -0.22, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.8 * decoScale}
            position={[1.5, 0.35, -1.1]}
          />
        </group>

        {/* Hamburguesa de enfrente — la única que explota */}
        <group rotation={[-0.18, 0, 0]}>
          <BurgerModel
            explode={explode}
            axisX={0.6}
            axisY={1}
            showLabels
            scale={frontScale}
            position={[frontX, 0, 0]}
          />
        </group>

        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.4}
          scale={8}
          blur={2.5}
          far={2}
        />
      </Suspense>
    </Canvas>
  );
}