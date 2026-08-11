"use client";

import { useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// --- MODO DEBUG: 8 nodos por separado, cada uno con color y nombre propio ---
const NODES = [
  { node: "root00", material: "root.0.0", color: "#ff3b30" },   // rojo
  { node: "root01", material: "root.0.1", color: "#ff9500" },   // naranja
  { node: "root02", material: "root.0.2", color: "#ffcc00" },   // amarillo
  { node: "root03", material: "root.0.3", color: "#34c759" },   // verde
  { node: "root05", material: "root.0.5", color: "#00c7be" },   // turquesa
  { node: "root1", material: "root.1", color: "#007aff" },      // azul
  { node: "root2", material: "root.2", color: "#5856d6" },      // morado
  { node: "root3", material: "root.3", color: "#ff2d55" },      // rosa
];

export default function BurgerModel({ explode = 0, ...props }) {
  const { nodes } = useGLTF("/models/burger.glb");
  const groupRefs = useRef([]);

  useFrame(() => {
    groupRefs.current.forEach((el, i) => {
      if (!el) return;
      // Separación amplia y pareja para verlos bien distinguidos
      const targetY = (i - 3.5) * 0.5 * explode;
      el.position.y += (targetY - el.position.y) * 0.1;
    });
  });

  const labelOpacity = Math.min(1, Math.max(0, (explode - 0.05) / 0.3));

  return (
    <group {...props} dispose={null}>
      {NODES.map((item, i) => {
        const meshNode = nodes[item.node];
        if (!meshNode) return null;
        return (
          <group key={item.node} ref={(el) => (groupRefs.current[i] = el)}>
            <mesh geometry={meshNode.geometry} castShadow receiveShadow>
              <meshStandardMaterial color={item.color} />
            </mesh>
            {labelOpacity > 0.01 && (
              <Html position={[1.4, 0, 0]} center={false} style={{ pointerEvents: "none" }}>
                <div
                  className="whitespace-nowrap rounded px-2 py-1 font-display text-xs uppercase tracking-wider text-white"
                  style={{
                    opacity: labelOpacity,
                    backgroundColor: item.color,
                    transition: "opacity 0.2s linear",
                  }}
                >
                  {item.node}
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