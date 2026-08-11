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
  const FRONT_BASE_X = 1;
  const FRONT_TRAVEL_X = -1;
  const frontX = FRONT_BASE_X + FRONT_TRAVEL_X * explode;

  const frontScale = 1 - explode * 0.42;
  const decoScale = Math.max(0, 1 - explode / 0.3);

  return (
    <Canvas
      camera={{ position: [0, 3.4, 6.4], fov: 26 }}
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
        {/* Hamburguesa de fondo — más compacta que antes, dentro de
            cámara, escalón parejo respecto a la media */}
        <group rotation={[-0.1, -0.3, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.6 * decoScale}
            position={[2.6, 0.7, -3]}
          />
        </group>

        {/* Hamburguesa media — mismo paso desde la de fondo que desde
            la de enfrente */}
        <group rotation={[-0.1, -0.18, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.8 * decoScale}
            position={[1.8, 0.4, -1.5]}
          />
        </group>

        {/* Hamburguesa de enfrente — la única que explota */}
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

        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.55}
          scale={10}
          blur={1.6}
          far={2.5}
          color="#5a1613"
        />
      </Suspense>
    </Canvas>
  );
}