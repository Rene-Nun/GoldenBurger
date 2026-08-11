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
      // Cámara más alta y un poco más cerca: al mirar hacia abajo se ve
      // más la cara del pan superior, look de foto de producto.
      camera={{ position: [0, 2.1, 6.8], fov: 28 }}
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
        {/* Hamburguesa de fondo — más lejos, más chica, más arriba */}
        <group rotation={[-0.1, -0.25, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.55 * decoScale}
            position={[2.6, 0.75, -3.6]}
          />
        </group>

        {/* Hamburguesa media — escalón intermedio, bien separada de
            la de atrás y de la de enfrente para que no se amontonen */}
        <group rotation={[-0.1, -0.15, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.78 * decoScale}
            position={[1.7, 0.4, -1.9]}
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
          opacity={0.4}
          scale={8}
          blur={2.5}
          far={2}
        />
      </Suspense>
    </Canvas>
  );
}