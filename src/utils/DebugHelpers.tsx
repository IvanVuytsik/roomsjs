import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AxesHelper } from 'three';

// Debug Menu for manual position input
export const DebugMenu: React.FC<{ position: [number, number, number]; onPositionChange: (pos: [number, number, number]) => void }> = ({ position, onPositionChange }) => {
  const [x, setX] = useState(position[0].toString());
  const [y, setY] = useState(position[1].toString());
  const [z, setZ] = useState(position[2].toString());

  useEffect(() => {
    const newX = parseFloat(x) || 0;
    const newY = parseFloat(y) || 0;
    const newZ = parseFloat(z) || 0;
    onPositionChange([newX, newY, newZ]);
  }, [x, y, z, onPositionChange]);

  return (
    <div className="debug-menu">
      <h3>Axis Helper Position</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label>X:</label>
          <input
            type="number"
            step="0.1"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Y:</label>
          <input
            type="number"
            step="0.1"
            value={y}
            onChange={(e) => setY(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Z:</label>
          <input
            type="number"
            step="0.1"
            value={z}
            onChange={(e) => setZ(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

// Simplified Interactive Axis Helper without on-screen coordinates
export const InteractiveAxisHelper: React.FC<{ position: [number, number, number]; onPositionChange: (pos: [number, number, number]) => void }> = ({ position, onPositionChange }) => {
  const helperRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useFrame((state) => {
    if (isDragging && helperRef.current) {
      const camera = state.camera;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      mouse.x = (window.innerWidth / 2) / window.innerWidth * 2 - 1;
      mouse.y = -(window.innerHeight / 2) / window.innerHeight * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        const newPosition: [number, number, number] = [intersection.x, position[1], intersection.z];
        helperRef.current.position.set(...newPosition);
        onPositionChange(newPosition);
      }
    }
  });

  return (
    <group ref={helperRef} position={position}>
      <primitive object={new AxesHelper(1)} />
      
      {/* Interactive handle */}
      <mesh 
        position={[0, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial 
          color={isDragging ? "#ff6b6b" : "#4ecdc4"} 
          transparent 
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

export const CameraDebugMenu: React.FC<{
  position: THREE.Vector3;
  rotation: THREE.Euler;
  target: THREE.Vector3;
  onPositionChange: (axis: 'x' | 'y' | 'z', value: string) => void;
  onRotationChange: (axis: 'x' | 'y' | 'z', value: string) => void;
  onTargetChange: (axis: 'x' | 'y' | 'z', value: string) => void;
}> = ({ position, rotation, target, onPositionChange, onRotationChange, onTargetChange }) => {
  return (
    <div className="debug-menu camera-debug">
      <h3>Camera Controls</h3>
      <div className="input-group">
        <label>Pos X:</label>
        <input
          type="number"
          step="0.1"
          value={position.x.toFixed(2)}
          onChange={(e) => onPositionChange('x', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Pos Y:</label>
        <input
          type="number"
          step="0.1"
          value={position.y.toFixed(2)}
          onChange={(e) => onPositionChange('y', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Pos Z:</label>
        <input
          type="number"
          step="0.1"
          value={position.z.toFixed(2)}
          onChange={(e) => onPositionChange('z', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Rot X:</label>
        <input
          type="number"
          step="0.1"
          value={rotation.x.toFixed(2)}
          onChange={(e) => onRotationChange('x', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Rot Y:</label>
        <input
          type="number"
          step="0.1"
          value={rotation.y.toFixed(2)}
          onChange={(e) => onRotationChange('y', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Rot Z:</label>
        <input
          type="number"
          step="0.1"
          value={rotation.z.toFixed(2)}
          onChange={(e) => onRotationChange('z', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Target X:</label>
        <input
          type="number"
          step="0.1"
          value={target.x.toFixed(2)}
          onChange={(e) => onTargetChange('x', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Target Y:</label>
        <input
          type="number"
          step="0.1"
          value={target.y.toFixed(2)}
          onChange={(e) => onTargetChange('y', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Target Z:</label>
        <input
          type="number"
          step="0.1"
          value={target.z.toFixed(2)}
          onChange={(e) => onTargetChange('z', e.target.value)}
        />
      </div>
    </div>
  );
};

export const ColorDebugMenu: React.FC<{
  color: string;
  onColorChange: (color: string) => void;
}> = ({ color, onColorChange }) => {
  return (
    <div className="debug-menu color-debug">
      <h3>Surface Color</h3>
      <div className="input-group">
        <label>Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>
    </div>
  );
};