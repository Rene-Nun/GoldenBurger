"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/**
 * Orden de apilado real (calculado desde las posiciones Y del .glb, de
 * abajo hacia arriba) y confirmado visualmente con el render en
 * gltf.report: pan inferior, carne, queso, salsa, cebolla, jitomate,
 * lechuga, pan superior — 8 capas, coincide exacto con las 8 mallas.
 * Si al probarlo ves que dos capas están cambiadas (p. ej. salsa/cebolla),
 * solo hay que intercambiar esas dos líneas de orden, el resto no se toca.
 */
const LAYERS = [
  { node: "root.0.1", name: "pan inferior", offset: -1.4 },
  { node: "root.0.5", name: "carne", offset: -1.0 },
  { node: "root.0.3", name: "queso", offset: -0.6 },
  { node: "root.2", name: "salsa", offset: -0.2 },
  { node: "root.1", name: "cebolla", offset: 0.2 },
  { node: "root.0.0", name: "jitomate", offset: 0.6 },
  { node: "root.0.2", name: "lechuga", offset: 1.0 },
  { node: "root.3", name: "pan superior", offset: 1.4 },
];

export default function BurgerModel({ explode = 0, ...props }) {
  const { nodes, materials } = useGLTF("/models/burger.glb");
  const group = useRef();

  // Interpola suavemente hacia el offset objetivo en vez de saltar de golpe
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
      {LAYERS.map(({ node }, i) => {
        const meshNode = nodes[node];
        if (!meshNode) return null;
        return (
          <mesh
            key={node}
            geometry={meshNode.geometry}
            material={materials[node] ?? meshNode.material}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}

useGLTF.preload("/models/burger.glb");