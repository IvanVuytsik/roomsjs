import { useState, useEffect, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import ModelViewer from './components/ModelViewer/ModelViewer';
import './App.css';

import { initializeModelCache } from './utils/modelLoader';

type AppState = 'loading' | 'welcome' | 'viewer';

import { useProgress } from '@react-three/drei';

function App() {
  const { progress, active } = useProgress();
  const [appState, setAppState] = useState<AppState>('loading');
  const [modelsPreloaded, setModelsPreloaded] = useState(false);
  const transitionTriggered = useRef(false);

  useEffect(() => { 
    initializeModelCache();
    setModelsPreloaded(true);
  }, []);

  useEffect(() => {
    if (!active && progress === 100 && modelsPreloaded && !transitionTriggered.current) {
      transitionTriggered.current = true;
      setTimeout(() => setAppState('welcome'), 500);
    }
  }, [active, progress, modelsPreloaded]);

  const handleStartExperience = () => {
    setAppState('viewer');
  };

  const handleBackToWelcome = () => {
    setAppState('welcome');
  };

  return (
    <div className="app">
      {appState === 'loading' && (
        <LoadingScreen progress={progress} />
      )}
      
      {appState === 'welcome' && (
        <WelcomeScreen onStart={handleStartExperience} />
      )}
      
      {appState === 'viewer' && (
        <ModelViewer onBack={handleBackToWelcome} />
      )}
    </div>
  );
}

export default App;
