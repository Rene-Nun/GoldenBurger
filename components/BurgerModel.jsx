"use client";

import { useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

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

  useFrame(() => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const layer = LAYERS[i];
      if (!layer) return;
      const targetY = layer.offset * explode;
      child.position.y += (targetY - child.position.y) * 0.1;
    });
  });

  // --- DEBUG TEMPORAL: imprime en pantalla los nombres reales de nodos ---
  const nodeKeys = Object.keys(nodes);
  const materialKeys = Object.keys(materials);

  return (
    <group ref={group} {...props} dispose={null}>
      <Html center>
        <div
          style={{
            background: "white",
            color: "black",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 11,
            fontFamily: "monospace",
            maxWidth: "80vw",
            whiteSpace: "pre-wrap",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <strong>NODOS ({nodeKeys.length}):</strong>
          {"\n"}
          {nodeKeys.join("\n")}
          {"\n\n"}
          <strong>MATERIALES ({materialKeys.length}):</strong>
          {"\n"}
          {materialKeys.join("\n")}
        </div>
      </Html>

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