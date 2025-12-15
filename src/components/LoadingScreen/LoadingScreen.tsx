import React from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0 }) => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="pulse-line-container">
          <div className="pulse-line-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="loading-text">
          Loading
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;