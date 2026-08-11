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
  const SCENE_OFFSET_X = 1.1;

  const FRONT_BASE_X = SCENE_OFFSET_X - 0.6;
  const FRONT_TRAVEL_X = -0.6;
  const frontX = FRONT_BASE_X + FRONT_TRAVEL_X * explode;

  // Tamaño base más grande que antes (era 0.8), sigue encogiendo un poco
  // al explotar para no salirse de pantalla.
  const FRONT_SIZE = 0.8;
  const frontScale = FRONT_SIZE - explode * 0.35;

  // La de la derecha ahora sí desaparece con el scroll, encogiéndose
  // a 0 en el primer 30% del recorrido.
  const BACK_SIZE = 0.8;
  const decoScale = Math.max(0, 1 - explode / 0.3);
  const backScale = BACK_SIZE * decoScale;

  return (
    <Canvas
      camera={{ position: [0, 4.0, 6.2], fov: 26 }}
      dpr={[1, 1.5]}
      gl={{ toneMappingExposure: 1.1 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 2]} intensity={2.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />
      <Environment preset="studio" resolution={128} background={false} />

      <Suspense fallback={<LoadingFallback />}>
        {/* Izquierda — al frente, la que explota */}
        <group rotation={[-0.15, 0, 0.25]}>
          <BurgerModel
            explode={explode}
            axisX={0.6}
            axisY={1}
            showLabels
            scale={frontScale}
            position={[frontX, 0, 0.6]}
          />
        </group>

        {/* Derecha — decorativa, ahora desaparece con el scroll */}
        <group rotation={[-0.15, 0, -0.25]}>
          <BurgerModel
            explode={0}
            showLabels={false}
            scale={backScale}
            position={[SCENE_OFFSET_X + 0.6, 0, -0.6]}
          />
        </group>
      </Suspense>
    </Canvas>
  );
}