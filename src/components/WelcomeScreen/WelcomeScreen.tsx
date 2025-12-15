import React, { useEffect, useState } from 'react';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onStart: () => void;
}

const welcomeMessages = [
  { text: 'Добро пожаловать.', lang: 'Russian' },
  { text: 'Welcome.', lang: 'English' },
  { text: 'Bienvenido.', lang: 'Spanish' },
  { text: 'Bienvenue.', lang: 'French' },
  { text: 'Willkommen.', lang: 'German' },
  { text: 'Benvenuto.', lang: 'Italian' },
  { text: '欢迎.', lang: 'Chinese' },
  { text: 'ようこそ.', lang: 'Japanese' }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % welcomeMessages.length);
        setIsTransitioning(false);
      }, 1000); // Longer transition for smooth fade
    }, 3500); // Change every 3.5 seconds for better timing

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-screen">
      <div className={`welcome-message ${isVisible ? 'visible' : ''}`}>
        <div className="welcome-text-container">
          <h1 className={`welcome-text ${isTransitioning ? 'sliding-out' : 'sliding-in'}`}>
            {welcomeMessages[currentMessageIndex].text}
          </h1>
          <p className={`language-indicator ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
            {welcomeMessages[currentMessageIndex].lang}
          </p>
        </div>
        <button 
          className="enter-button"
          onClick={onStart}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;