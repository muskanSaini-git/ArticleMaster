import React from 'react';
import config from '../config';

const HybridModeToggle = ({ onToggle, isEnabled }) => {
  const handleToggle = () => {
    // Update config
    config.hybridMode.enabled = !isEnabled;
    onToggle(!isEnabled);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: isEnabled ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease'
    }} onClick={handleToggle}>
      {isEnabled ? '🔄 Hybrid Mode ON' : '🌐 Real APIs Only'}
    </div>
  );
};

export default HybridModeToggle;
