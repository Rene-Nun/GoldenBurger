"use client";

import { useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/**
 * Confirmado visualmente con el modo debug de colores — cada grupo mueve
 * junto varios nodos del .glb para que se vean como una sola pieza.
 * OJO: root02/root03 (con cero) y root2/root3 (sin cero) son nodos distintos.
 */
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

export default function BurgerModel({ explode = 0, ...props }) {
  const { nodes, materials } = useGLTF("/models/burger.glb");
  const groupRefs = useRef([]);

  useFrame(() => {
    groupRefs.current.forEach((el, i) => {
      if (!el) return;
      const group = GROUPS[i];
      const targetY = group.offset * explode;
      el.position.y += (targetY - el.position.y) * 0.1;
    });
  });

  const labelOpacity = Math.min(1, Math.max(0, (explode - 0.05) / 0.3));

  return (
    <group {...props} dispose={null}>
      {GROUPS.map((group, i) => (
        <group key={group.name} ref={(el) => (groupRefs.current[i] = el)}>
          {group.parts.map(({ node, material }) => {
            const meshNode = nodes[node];
            if (!meshNode) return null;
            return (
              <mesh
                key={node}
                geometry={meshNode.geometry}
                material={materials[material] ?? meshNode.material}
                castShadow
                receiveShadow
              />
            );
          })}
          {labelOpacity > 0.01 && (
            <Html position={[1.2, 0, 0]} center={false} style={{ pointerEvents: "none" }}>
              <div
                className="flex items-center gap-2 whitespace-nowrap"
                style={{ opacity: labelOpacity, transition: "opacity 0.2s linear" }}
              >
                <span className="h-px w-8 bg-white/40" />
                <span className="font-display text-xs uppercase tracking-[0.2em] text-white/70">
                  {group.name}
                </span>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

useGLTF.preload("/models/burger.glb");