"use client";

import { useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const GROUPS = [
  {
    name: "Pan superior",
    offset: 0.8,
    parts: [
      { node: "root02", material: "root.0.2" },
      { node: "root3", material: "root.3" },
    ],
  },
  {
    name: "Lechuga y más",
    offset: 0.4,
    parts: [
      { node: "root00", material: "root.0.0" },
      { node: "root1", material: "root.1" },
      { node: "root2", material: "root.2" },
    ],
  },
  {
    name: "Queso",
    offset: 0,
    parts: [{ node: "root03", material: "root.0.3" }],
  },
  {
    name: "Carne",
    offset: -0.4,
    parts: [{ node: "root05", material: "root.0.5" }],
  },
  {
    name: "Pan inferior",
    offset: -0.8,
    parts: [{ node: "root01", material: "root.0.1" }],
  },
];

export default function BurgerModel({
  explode = 0,
  axisX = 0.6,
  axisY = 1,
  showLabels = true,
  ...props
}) {
  const { nodes, materials } = useGLTF("/models/burger.glb");
  const groupRefs = useRef([]);

  useFrame(() => {
    groupRefs.current.forEach((el, i) => {
      if (!el) return;
      const group = GROUPS[i];
      const targetX = group.offset * axisX * explode;
      const targetY = group.offset * axisY * explode;
      el.position.x += (targetX - el.position.x) * 0.1;
      el.position.y += (targetY - el.position.y) * 0.1;
    });
  });

  const labelOpacity = showLabels
    ? Math.min(1, Math.max(0, (explode - 0.05) / 0.3))
    : 0;

  return (
    <group {...props} dispose={null}>
      {GROUPS.map((group, i) => {
        // Alterna lado: índices pares a la derecha, impares a la izquierda
        const isRight = i % 2 === 0;
        return (
          <group key={group.name} ref={(el) => (groupRefs.current[i] = el)}>
            {group.parts.map(({ node, material }) => {
              const meshNode = nodes[node];
              if (!meshNode) return null;
              return (
                <mesh
                  key={node}
                  geometry={meshNode.geometry}
                  material={materials[material] ?? meshNode.material}
                />
              );
            })}
            {labelOpacity > 0.01 && (
              // Anclado en el centro exacto del mesh (sin offset 3D) —
              // el desplazamiento izq/der se hace con CSS, así la altura
              // proyectada siempre es exacta sin importar rotaciones.
              <Html center={false} style={{ pointerEvents: "none" }}>
                <div
                  className="flex items-center gap-2 whitespace-nowrap"
                  style={{
                    opacity: labelOpacity,
                    transition: "opacity 0.2s linear",
                    transform: isRight
                      ? "translate(24px, -50%)"
                      : "translate(calc(-100% - 24px), -50%)",
                    flexDirection: isRight ? "row" : "row-reverse",
                  }}
                >
                  <span className="h-px w-8 bg-white/40" />
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-white/70">
                    {group.name}
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

useGLTF.preload("/models/burger.glb");