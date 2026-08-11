"use client";

import { useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/**
 * Cada GRUPO puede contener varios nodos del .glb que deben moverse
 * siempre juntos como una sola pieza visual (por eso "parts" es un array).
 * Los nombres de nodo (mesh) NO llevan punto; los de material SÍ.
 *
 * Agrupación:
 * - Pan superior: root3
 * - Lechuga y más: root02 (lechuga) + root00 (jitomate/pedazos sueltos)
 * - Queso y más: root03 (queso) + root2 (salsa) + root1 (cebolla)
 * - Carne: root05
 * - Pan inferior: root01
 *
 * Si al probar ves que alguna pieza se sigue separando de donde no debería,
 * solo mueve esa línea {node, material} al array "parts" del grupo correcto.
 *
 * Offsets parejos: 0.4 de distancia entre cada grupo, simétrico alrededor
 * del centro (queso y más, en offset 0).
 */
const GROUPS = [
  {
    name: "Pan superior",
    offset: 0.8,
    parts: [{ node: "root3", material: "root.3" }],
  },
  {
    name: "Lechuga y más",
    offset: 0.4,
    parts: [
      { node: "root02", material: "root.0.2" },
      { node: "root00", material: "root.0.0" },
    ],
  },
  {
    name: "Queso y más",
    offset: 0,
    parts: [
      { node: "root03", material: "root.0.3" },
      { node: "root2", material: "root.2" },
      { node: "root1", material: "root.1" },
    ],
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
  // Un ref por grupo (no por mesh individual) — así todas las partes
  // dentro de un grupo se mueven pegadas, como una sola pieza
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