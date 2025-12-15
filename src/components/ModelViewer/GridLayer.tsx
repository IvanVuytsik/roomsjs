import React from 'react'; 
import { Hexagon } from './Hexagon';

interface GridLayerProps {
  mode: 'DAY' | 'NIGHT';
}

const autumnColors = ['#DAA520', '#B8860B', '#CD853F', '#D2691E', '#8B4513', '#A0522D'];
const summerColors = ['#556B2F', '#6B8E23', '#8FBC8F', '#9ACD32', '#ADFF2F', '#F0E68C'];

export const GridLayer: React.FC<GridLayerProps> = ({ mode }) => {
  const hexagons = [];
  const numX = 10;
  const numZ = 10;
  const size = 1;

  const hexWidth = Math.sqrt(3) * size;
  const hexHeight = 2 * size;

  const gridWidth = (numX - 1) * hexWidth + (hexWidth / 2);
  const gridDepth = (numZ - 1) * (hexHeight * 0.75);

  for (let i = 0; i < numX; i++) {
    for (let j = 0; j < numZ; j++) {
      const x = i * hexWidth + (j % 2) * (hexWidth / 2);
      const z = j * (hexHeight * 0.75);
      const colors = mode === 'DAY' ? summerColors : autumnColors;
      const color = colors[Math.floor(Math.random() * colors.length)];
      hexagons.push(
        <Hexagon
          key={`${i}-${j}`}
          position={[x - gridWidth / 2, 0, z - gridDepth / 2]}
          size={size}
          color={color}
        />
      );
    }
  }

  return <group position={[0, -0.205, 0]}>{hexagons}</group>;
};