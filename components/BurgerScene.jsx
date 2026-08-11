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
  // La hamburguesa de enfrente arranca junto a las otras dos y viaja
  // hacia el centro exacto de la pantalla.
  const FRONT_BASE_X = 0.9;
  const FRONT_TRAVEL_X = -0.9;
  const frontX = FRONT_BASE_X + FRONT_TRAVEL_X * explode;

  // Se encoge conforme explota — la separación de capas crece en altura,
  // así que sin esto el pan superior se sale de la pantalla al final.
  const frontScale = 1 - explode * 0.42;

  // Las 2 hamburguesas decorativas se desvanecen en el primer 30% del scroll.
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
        {/* Inclinación leve en X en las 3 — simula ángulo de foto de
            comida visto un poco desde arriba, no de frente plano.
            Si se ve al revés (como si viéramos por debajo), cambia el
            signo de -0.18 a 0.18 */}
        <group rotation={[-0.18, -0.35, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.62 * decoScale}
            position={[1.9, 0.55, -1.9]}
          />
        </group>
        <group rotation={[-0.18, -0.22, 0]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={0.8 * decoScale}
            position={[1.3, 0.35, -0.9]}
          />
        </group>
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