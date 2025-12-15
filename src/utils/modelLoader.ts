import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';

const MODEL_REGISTRY = {
  compNightRoom: '/models/comp_night_room.glb',
  compDayRoom: '/models/comp_day_room.glb', 
} as const;

const preloadedModels = new Set<string>();

export type ModelName = keyof typeof MODEL_REGISTRY;

export const useModelLoader = (modelName: ModelName | string) => {
  const modelPath = MODEL_REGISTRY[modelName as ModelName];
  const gltf = useGLTF(modelPath, true);
  
  return useMemo(() => ({
    model: gltf.scene,
    animations: gltf.animations,
    materials: gltf.materials,
    nodes: gltf.nodes,
  }), [gltf]);
};

export const preloadModels = (modelNames: ModelName[]) => {
  modelNames.forEach(name => {
    const path = MODEL_REGISTRY[name];
    if (path && !preloadedModels.has(path)) {
      useGLTF.preload(path);
      preloadedModels.add(path);
    }
  });
};

export const initializeModelCache = () => {
  preloadModels(['compNightRoom', 'compDayRoom']);
  console.log('Model cache initialized');
};

export const isModelPreloaded = (modelName: ModelName): boolean => {
  const path = MODEL_REGISTRY[modelName];
  return !!path && preloadedModels.has(path);
};

export { MODEL_REGISTRY };