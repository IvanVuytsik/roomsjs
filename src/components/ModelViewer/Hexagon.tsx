import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface HexagonProps {
  position: [number, number, number];
  size: number;
  color: string;
}

export const Hexagon: React.FC<HexagonProps> = ({ position, size, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (i * 2 * Math.PI) / 6 + Math.PI / 6;  
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        hovered ? 1 : 0,
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color={color}
        transparent={true}
        opacity={0}
       // visible={hovered}
      />
    </mesh>
  );
};