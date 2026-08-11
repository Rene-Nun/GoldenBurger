"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/**
 * IMPORTANTE: los nombres de "node" (mallas) NO llevan punto (root01, root2...)
 * pero los nombres de "material" SÍ llevan punto (root.0.1, root.2...).
 * Por eso cada capa guarda ambos nombres por separado.
 *
 * Orden de apilado real, de abajo hacia arriba: pan inferior, carne, queso,
 * salsa, cebolla, jitomate, lechuga, pan superior.
 */
const LAYERS = [
  { node: "root01", material: "root.0.1", name: "pan inferior", offset: -1.4 },
  { node: "root05", material: "root.0.5", name: "carne", offset: -1.0 },
  { node: "root03", material: "root.0.3", name: "queso", offset: -0.6 },
  { node: "root2", material: "root.2", name: "salsa", offset: -0.2 },
  { node: "root1", material: "root.1", name: "cebolla", offset: 0.2 },
  { node: "root00", material: "root.0.0", name: "jitomate", offset: 0.6 },
  { node: "root02", material: "root.0.2", name: "lechuga", offset: 1.0 },
  { node: "root3", material: "root.3", name: "pan superior", offset: 1.4 },
];

export default function BurgerModel({ explode = 0, ...props }) {
  const { nodes, materials } = useGLTF("/models/burger.glb");
  const group = useRef();

  useFrame(() => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const layer = LAYERS[i];
      if (!layer) return;
      const targetY = layer.offset * explode;
      child.position.y += (targetY - child.position.y) * 0.1;
    });
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {LAYERS.map(({ node, material }) => {
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
    </group>
  );
}

useGLTF.preload("/models/burger.glb");