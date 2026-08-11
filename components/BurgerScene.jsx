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
  // La hamburguesa de enfrente arranca a la derecha (junto a las otras
  // dos) y viaja hacia el CENTRO exacto de la pantalla — antes terminaba
  // en x=-1.6, muy a la izquierda; ahora termina en x=0.
  const FRONT_BASE_X = 1.6;
  const FRONT_TRAVEL_X = -1.6;
  const frontX = FRONT_BASE_X + FRONT_TRAVEL_X * explode;

  // Las 2 hamburguesas decorativas se encogen hasta desaparecer en el
  // primer 30% del scroll, para que solo quede la que explota.
  const decoScale = Math.max(0, 1 - explode / 0.3);

  return (
    <Canvas
      camera={{ position: [0, 0.8, 7], fov: 32 }}
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
        {/* Hamburguesa de fondo — más a la derecha ahora, se desvanece */}
        <BurgerModel
          explode={0}
          showLabels={false}
          scale={0.5 * decoScale}
          position={[3.2, 0.6, -3]}
          rotation={[0, -0.3, 0]}
        />
        {/* Hamburguesa media — se desvanece con el scroll */}
        <BurgerModel
          explode={0}
          showLabels={false}
          scale={0.7 * decoScale}
          position={[2.3, 0.3, -1.6]}
          rotation={[0, -0.2, 0]}
        />
        {/* Hamburguesa de enfrente — la única que queda, explota en
            diagonal y viaja del lado derecho hacia el centro exacto */}
        <BurgerModel
          explode={explode}
          axisX={0.6}
          axisY={1}
          showLabels
          scale={1}
          position={[frontX, 0, 0]}
        />

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