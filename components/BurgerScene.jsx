"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Html } from "@react-three/drei";
import BurgerModel from "./BurgerModel";

// Gira lentamente la hamburguesa completa sobre su eje — le da vida aunque
// el usuario no esté haciendo scroll todavía.
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
    <Canvas camera={{ position: [0, 1.2, 5], fov: 35 }} dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.4} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />

      <Suspense fallback={<LoadingFallback />}>
        <SpinningRig>
          <BurgerModel explode={explode} scale={1.2} position={[0, -0.5, 0]} />
        </SpinningRig>
      </Suspense>
    </Canvas>
  );
}