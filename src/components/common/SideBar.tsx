import React from 'react';
import './SideBar.css';

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
  imageSrc: string;
  title: string;
  description: string;
  features?: string[];
  theme?: 'day' | 'night';
}

const SideBar: React.FC<SideBarProps> = ({ 
  isOpen, 
  onClose, 
  onExplore,
  imageSrc, 
  title, 
  description,  
  theme = 'day' 
}) => {
  const themeStyles = {
    day: {
      bg: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-200',
      button: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      featureBg: 'bg-blue-50',
      featureText: 'text-blue-800'
    },
    night: {
      bg: 'bg-gray-900',
      text: 'text-white',
      border: 'border-gray-700',
      button: 'bg-gray-800 hover:bg-gray-700 text-gray-300',
      featureBg: 'bg-blue-900',
      featureText: 'text-blue-200'
    }
  };
 
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className={`sidebar-content ${theme === 'day' ? 'sidebar-day' : 'sidebar-night'}`}>
          {/* Header */}
          <div className="sidebar-header">
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`sidebar-close-button ${theme}`}
            >
              ✕
            </button>

            {/* Image */}
            <div className="sidebar-image-container">
              <img 
                src={imageSrc} 
                alt={title}
                className="sidebar-image"
              />
              <div className="sidebar-image-overlay" />
              <div className="sidebar-title">
                <h2>{title}</h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="sidebar-body">
            {/* Description */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">About This Room</h3>
              <p className="sidebar-description">
                {description}
              </p>
            </div>



            {/* Call to Action */}
            <div className="sidebar-cta">
              <button
                onClick={onExplore}
                className={`sidebar-cta-button ${theme}`}
              >
                Explore Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;