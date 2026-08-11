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
  // La hamburguesa de enfrente, además de explotar sus capas, también
  // "viaja" hacia el centro/izquierda de la pantalla conforme avanza el
  // scroll — así cruza el layout, no se queda quieta en su sitio.
  const frontTravelX = -1.8 * explode;

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
        {/* Hamburguesa de fondo — más chica y atrás, nunca explota */}
        <BurgerModel
          explode={0}
          showLabels={false}
          scale={0.5}
          position={[2.4, 0.6, -3]}
          rotation={[0, -0.3, 0]}
        />
        {/* Hamburguesa media — tamaño intermedio, nunca explota */}
        <BurgerModel
          explode={0}
          showLabels={false}
          scale={0.7}
          position={[1.4, 0.3, -1.6]}
          rotation={[0, -0.2, 0]}
        />
        {/* Hamburguesa de enfrente — la única que explota, en diagonal,
            y viaja hacia el centro de la pantalla */}
        <BurgerModel
          explode={explode}
          axisX={0.6}
          axisY={1}
          showLabels
          scale={1}
          position={[0.2 + frontTravelX, 0, 0]}
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