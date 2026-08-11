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
  return (
    <Canvas
      camera={{ position: [0, 1.1, 6], fov: 30 }}
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

      {/* resolution baja + sin fondo visible: mismo look de estudio,
          pero mucho más ligero — el HDR completo era lo que probablemente
          crasheaba Safari en iPad */}
      <Environment preset="studio" resolution={128} background={false} />

      <Suspense fallback={<LoadingFallback />}>
        {/* Sin SpinningRig — el modelo ya no rota, queda estático */}
        <BurgerModel explode={explode} scale={0.9} position={[0, -0.4, 0]} />
        <ContactShadows
          position={[0, -0.9, 0]}
          opacity={0.5}
          scale={5}
          blur={2.2}
          far={2}
        />
      </Suspense>
    </Canvas>
  );
}