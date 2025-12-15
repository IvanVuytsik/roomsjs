import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment  } from '@react-three/drei';
import { EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { useModelLoader } from '../../utils/modelLoader'; 
import * as THREE from 'three';
import { SideBar } from '../index';
import nightRoomImage from '/images/comp_night_room.png';
import dayRoomImage from '/images/comp_day_room.png';
//import { DebugMenu, InteractiveAxisHelper, CameraDebugMenu, ColorDebugMenu } from '../../utils/DebugHelpers';
import gsap from 'gsap';
import { BlendFunction } from 'postprocessing';

import './ModelViewer.css';
import { GridLayer } from './GridLayer';

interface ModelViewerProps {
  onBack: () => void;
}

interface SceneProps {
  position: [number, number, number];
  helperPosition: [number, number, number];
  onHelperPositionChange: (pos: [number, number, number]) => void;
  onModelLoad: (loaded: boolean) => void;
  mode: 'DAY' | 'NIGHT';
  surfaceColor: string;
}

const Scene: React.FC<SceneProps> = ({ position, helperPosition, onHelperPositionChange, onModelLoad, mode, surfaceColor }) => {
  const modelName = mode === 'NIGHT' ? 'compNightRoom' : 'compDayRoom';
  const { model } = useModelLoader(modelName);
 
  useEffect(() => {
    if (model) {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
 
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (material.name.toLowerCase().includes('glass')) {
              material.transparent = true;
              material.opacity = 0.3;
              material.envMapIntensity = 2;
              material.roughness = 0.1;
              material.metalness = 0.1;
            }
          });
        }
      });
      onModelLoad(true);
    } else {
      onModelLoad(false);
    }
  }, [model, onModelLoad]);
  
  return (
    <>  
      <ambientLight intensity={mode === 'DAY' ? 1.0 : 0.7} />
      <Environment preset={mode === 'DAY' ? 'sunset' : 'night'} />
       
      {mode === 'NIGHT' && (
        <>
          <pointLight 
            position={[1.8, 2.2, -1.3]} 
            color="#E7921B" 
            intensity={20.0} 
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-bias={-0.005}
            shadow-radius={3}
            shadow-blur={2} 
            shadow-camera-near={0.1}
            shadow-camera-far={10}
            //shadow-camera-fov={120}
          />
          <pointLight 
            position={[-2.5, 1.6, 0.4]} 
            color="#E7921B" 
            intensity={3.0} 
            castShadow 
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-bias={-0.005}
            shadow-radius={3} 
            shadow-blur={2} 
            shadow-camera-near={0.1}
            shadow-camera-far={10}
            //shadow-camera-fov={120}
          />
        </>
      )}

      {mode === 'DAY' && (
        <>
          <directionalLight
            position={[-2.5, 1.75, -2.0]} 
            intensity={12.0} 
            color="#FFDAB9" 
            castShadow
            shadow-mapSize-width={2048}  
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
            shadow-bias={-0.005}
            shadow-radius={5} 
            shadow-blur={3}
          />
        </>
      )}
   
      <mesh renderOrder={1} name="surfacePlane" position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color={mode === 'DAY' ? '#C8C8C8' : '#454545'} opacity={0.1} transparent={false}/>
      </mesh>

      {/* <InteractiveAxisHelper 
        position={helperPosition} 
        onPositionChange={onHelperPositionChange}
      /> */}

      <group renderOrder={2}>
        <GridLayer mode={mode} />
      </group>
       
      {model ? (
        <primitive 
          object={model} 
          position={position} 
          rotation={[0, -Math.PI / 4, 0]}   
          castShadow
          receiveShadow
        />
      ) : (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#666" wireframe />
        </mesh>
      )} 
      <EffectComposer>
        <ToneMapping
          blendFunction={BlendFunction.NORMAL}
          adaptive={true}
          resolution={1024}
          middleGrey={0.6}
          maxLuminance={16.0}
          averageLuminance={1.0}
          adaptationRate={2.0}
        />
      </EffectComposer>
    </>
  );
};

const ModelViewer: React.FC<ModelViewerProps> = ({ onBack }) => {
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helperPosition, setHelperPosition] = useState<[number, number, number]>([0, 2, 0]);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(8, 20, 8));
  const [cameraRotation, setCameraRotation] = useState(new THREE.Euler(0, 0, 0));
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0));

  const controlsRef = useRef<any>(null);
  const [zoom, setZoom] = useState(1);

  const [mode, setMode] = useState<'DAY' | 'NIGHT'>('NIGHT');
  const [surfaceColor, setSurfaceColor] = useState('#FFDAB9');

  const handleModeChange = (newMode: 'DAY' | 'NIGHT') => {
    if (!isModelLoading) {
      setMode(newMode);
      setIsModelLoading(true); 
    }
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.object.zoom = zoom;
      controlsRef.current.object.updateProjectionMatrix();
    }
  }, [zoom]);

  const handleZoom = (zoomIn: boolean) => {
    const newZoom = zoomIn ? zoom * 1.1 : zoom / 1.1;
    setZoom(newZoom);
  };

  const handleCameraPositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    if (cameraRef.current) {
      const newPosition = cameraRef.current.position.clone();
      newPosition[axis] = parseFloat(value) || 0;
      cameraRef.current.position.copy(newPosition);
      setCameraPosition(newPosition);
    }
  };

  const handleCameraRotationChange = (axis: 'x' | 'y' | 'z', value: string) => {
    if (cameraRef.current) {
      const newRotation = cameraRef.current.rotation.clone();
      (newRotation as any)[axis] = parseFloat(value) || 0;
      cameraRef.current.rotation.copy(newRotation);
      setCameraRotation(newRotation);
    }
  };

  const handleCameraTargetChange = (axis: 'x' | 'y' | 'z', value: string) => {
    if (controlsRef.current) {
      const newTarget = controlsRef.current.target.clone();
      newTarget[axis] = parseFloat(value) || 0;
      controlsRef.current.target.copy(newTarget);
      setCameraTarget(newTarget);
    }
  };

  const handleExplore = () => {
    if (controlsRef.current) {
      const newPosition = { x: 2.11, y: 1.71, z: 4.29 };
      const newRotation = { x: -0.15, y: 0.35, z: 0.05 };
      const newTarget = { x: 0.26, y: 0.94, z: -0.8 };

      gsap.to(controlsRef.current.object.position, {
        ...newPosition,
        duration: 2,
        ease: "power3.inOut",
      });

      gsap.to(controlsRef.current.object.rotation, {
        ...newRotation,
        duration: 2,
        ease: "power3.inOut",
      });

      gsap.to(controlsRef.current.target, {
        ...newTarget,
        duration: 2,
        ease: "power3.inOut",
        onComplete: () => {
          setCameraPosition(new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z));
          setCameraRotation(new THREE.Euler(newRotation.x, newRotation.y, newRotation.z));
          setCameraTarget(new THREE.Vector3(newTarget.x, newTarget.y, newTarget.z));
        },
      });
    }
  };

  return (
    <div className={`model-viewer ${mode === 'DAY' ? 'day-theme' : 'night-theme'}`}>
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title="Toggle Info Panel"
      >
        INFO
      </button>

      <div className="theme-controls">
        <button
            className={`mode-button ${mode === 'DAY' ? 'active' : ''}`}
            onClick={() => handleModeChange('DAY')}
            disabled={isModelLoading}
          >
            {isModelLoading && mode === 'NIGHT' ? 'Loading...' : 'DAY'}
          </button>
          <button
            className={`mode-button ${mode === 'NIGHT' ? 'active' : ''}`}
            onClick={() => handleModeChange('NIGHT')}
            disabled={isModelLoading}
          >
            {isModelLoading && mode === 'DAY' ? 'Loading...' : 'NIGHT'}
          </button> 
        <div className="model-controls">
          <button className="model-control-button" onClick={() => handleZoom(true)}>
            Zoom In
          </button>
          <button className="model-control-button" onClick={() => handleZoom(false)}>
            Zoom Out
          </button>
          <button
            className="model-control-button"
            onClick={() => {
              setModelPosition([0, 0, 0]);
              if (controlsRef.current) {
                controlsRef.current.reset();
                setCameraTarget(new THREE.Vector3(0, 0, 0));
              }
            }}
          >
            Reset
          </button>
        </div>
      </div>
  
      {/* {modelLoaded && (
        <>
          <DebugMenu 
            position={helperPosition} 
            onPositionChange={setHelperPosition} 
          />
          <CameraDebugMenu 
            position={cameraPosition}
            rotation={cameraRotation}
            target={cameraTarget}
            onPositionChange={handleCameraPositionChange}
            onRotationChange={handleCameraRotationChange}
            onTargetChange={handleCameraTargetChange}
          />
          <ColorDebugMenu color={surfaceColor} onColorChange={setSurfaceColor} />
        </>
      )} */}
 
      <Canvas 
        shadows={true} 
        camera={{ position: [8, 20, 8], fov: 45 }}
        className="canvas-container"
        onCreated={({ camera, gl }) => {
          if (camera instanceof THREE.PerspectiveCamera) {
            (cameraRef as React.RefObject<THREE.PerspectiveCamera>).current = camera;
          }

          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.shadowMap.autoUpdate = true;
          gl.shadowMap.needsUpdate = true;
        }}
      >
        <Suspense fallback={null}>
          <Scene
            position={modelPosition}
            helperPosition={helperPosition}
            onHelperPositionChange={setHelperPosition}
            onModelLoad={(loaded) => {
              setModelLoaded(loaded);
              setIsModelLoading(!loaded);
            }}
            mode={mode}
            surfaceColor={surfaceColor}
          />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 3.2}
            maxAzimuthAngle={Math.PI / 9}
            minAzimuthAngle={-Math.PI / 9}
            target={[0, 0, 0]}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.2}
            zoomSpeed={0.8}

            onEnd={() => {
              if (controlsRef.current) {
                setCameraPosition(controlsRef.current.object.position.clone());
                setCameraRotation(controlsRef.current.object.rotation.clone());
                setCameraTarget(controlsRef.current.target.clone());
              }
            }}
          />
        </Suspense>
      </Canvas>

      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onExplore={handleExplore}
        imageSrc={mode === 'DAY' ? dayRoomImage : nightRoomImage}
        title={mode === 'DAY' ? 'Day Room' : 'Night Room'}
        description={mode === 'DAY' ? 'Explore the bright and spacious day room, perfect for showcasing furniture in natural light.' : 'Discover the cozy and intimate night room with ambient lighting and peaceful atmosphere. Ideal for evening furniture presentations.'}
        theme={mode === 'DAY' ? 'day' : 'night'}
      />
    </div>
  );
};

export default ModelViewer;