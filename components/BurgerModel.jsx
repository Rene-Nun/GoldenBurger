"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

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
      const targetY = (i - 3.5) * 0.5 * explode;
      el.position.y += (targetY - el.position.y) * 0.1;
    });
  });

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
          </group>
        );
      })}
    </group>
  );
}

// Exportamos la lista para que BurgerShowcase pueda pintar la leyenda
// fuera del Canvas, como HTML normal — así nunca se corta.
export { NODES };

useGLTF.preload("/models/burger.glb");