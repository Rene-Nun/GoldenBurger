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

  // Mismo paso (dx, dy, dz) entre hamburguesa 1→2 y 2→3, para que el
  // espaciado se vea parejo en todo el trío.
  const STEP_X = 1.7;
  const STEP_Y = 0.4;
  const STEP_Z = -1.9;

  return (
    <Canvas
      // Cámara mucho más elevada y más cerrada en FOV — mira más hacia
      // abajo, así se ve más la cara del pan superior.
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
        {/* Hamburguesa de fondo — mismo paso que 1→2, aplicado dos veces */}
        <group rotation={[-0.1, -0.25, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.55 * decoScale}
            position={[STEP_X * 2, STEP_Y * 2, STEP_Z * 2]}
          />
        </group>

        {/* Hamburguesa media — un paso desde la de enfrente */}
        <group rotation={[-0.1, -0.15, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.78 * decoScale}
            position={[STEP_X, STEP_Y, STEP_Z]}
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

        {/* Sombra tinte rojo oscuro (no negro puro) para que se vea como
            si la superficie donde reposan las hamburguesas fuera roja,
            no una mancha genérica flotando encima del fondo */}
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