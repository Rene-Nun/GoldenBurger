"use client";

import { useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/**
 * IMPORTANTE: los nombres de "node" (mallas) NO llevan punto (root01, root2...)
 * pero los nombres de "material" SÍ llevan punto (root.0.1, root.2...).
 *
 * Orden de apilado real, de abajo hacia arriba: pan inferior, carne, queso,
 * salsa, cebolla, jitomate, lechuga, pan superior.
 *
 * Offsets reducidos a la mitad respecto a la versión original — el hero
 * ahora es un recuadro chico (280–380px), así que la explosión tiene que
 * quedarse contenida ahí y no salirse de la vista.
 */
const LAYERS = [
  { node: "root01", material: "root.0.1", name: "Pan inferior", offset: -0.7 },
  { node: "root05", material: "root.0.5", name: "Carne", offset: -0.5 },
  { node: "root03", material: "root.0.3", name: "Queso", offset: -0.3 },
  { node: "root2", material: "root.2", name: "Salsa", offset: -0.1 },
  { node: "root1", material: "root.1", name: "Cebolla", offset: 0.1 },
  { node: "root00", material: "root.0.0", name: "Jitomate", offset: 0.3 },
  { node: "root02", material: "root.0.2", name: "Lechuga", offset: 0.5 },
  { node: "root3", material: "root.3", name: "Pan superior", offset: 0.7 },
];

export default function BurgerModel({ explode = 0, ...props }) {
  const { nodes, materials } = useGLTF("/models/burger.glb");
  // Un ref por capa (mesh + etiqueta juntos)
  const layerRefs = useRef([]);

  useFrame(() => {
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      const layer = LAYERS[i];
      const targetY = layer.offset * explode;
      el.position.y += (targetY - el.position.y) * 0.1;
    });
  });

  // Las etiquetas empiezan a aparecer después de un pequeño umbral de scroll,
  // y llegan a opacidad completa a los ~35% del recorrido.
  const labelOpacity = Math.min(1, Math.max(0, (explode - 0.05) / 0.3));

  return (
    <group {...props} dispose={null}>
      {LAYERS.map((layer, i) => {
        const meshNode = nodes[layer.node];
        if (!meshNode) return null;
        return (
          <group key={layer.node} ref={(el) => (layerRefs.current[i] = el)}>
            <mesh
              geometry={meshNode.geometry}
              material={materials[layer.material] ?? meshNode.material}
              castShadow
              receiveShadow
            />
            {labelOpacity > 0.01 && (
              <Html position={[1.6, 0, 0]} center={false} style={{ pointerEvents: "none" }}>
                <div
                  className="flex items-center gap-2 whitespace-nowrap"
                  style={{ opacity: labelOpacity, transition: "opacity 0.2s linear" }}
                >
                  <span className="h-px w-8 bg-white/40" />
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-white/70">
                    {layer.name}
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