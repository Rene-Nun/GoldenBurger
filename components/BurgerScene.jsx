"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Html, Environment, ContactShadows } from "@react-three/drei";
import BurgerModel from "./BurgerModel";

function SpinningRig({ children }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return <group ref={ref}>{children}</group>;
}

function LoadingFallback() {
  return (
    <Html center>
      <p className="whitespace-nowrap font-display text-sm uppercase tracking-[0.3em] text-ink/50">
        Cargando…
      </p>
    </Html>
  );
}

export default function BurgerScene({ explode = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 5], fov: 35 }}
      dpr={[1, 2]}
      shadows
      gl={{ toneMappingExposure: 1.1 }}
    >
      {/* Luz ambiental suave, muy baja — la mayoría del "look realista"
          viene del Environment de abajo, no de luces planas */}
      <ambientLight intensity={0.3} />

      {/* Luz principal tipo "key light" de fotografía de producto,
          con sombra activada para que se vea el contacto con la mesa */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Luz de relleno tenue del lado opuesto, sin sombra, solo para
          que el lado oscuro no se vea negro puro */}
      <directionalLight position={[-3, 2, -2]} intensity={0.3} />

      {/* Simula un entorno de estudio fotográfico — esto es lo que le da
          reflejos realistas al pan, al queso derretido, etc. "city" da un
          ambiente neutro cálido; prueba también "apartment" o "studio" */}
      <Environment preset="city" />

      <Suspense fallback={<LoadingFallback />}>
        <SpinningRig>
          <BurgerModel explode={explode} scale={1.2} position={[0, -0.5, 0]} />
        </SpinningRig>
        {/* Sombra suave de contacto — ancla visualmente el modelo a una
            "mesa" invisible, evita que se sienta flotando en el vacío */}
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={2}
        />
      </Suspense>
    </Canvas>
  );
}