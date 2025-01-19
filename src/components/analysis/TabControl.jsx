import React from 'react';

export function TabControl({ activeTab, onTabChange }) {
  return (
    <div className="segment-control main-segment">
      <button
        className={`segment-button ${activeTab === 'characters' ? 'active' : ''}`}
        onClick={() => onTabChange('characters')}
      >
        인물
      </button>
      <button 
        className={`segment-button ${activeTab === 'events' ? 'active' : ''}`}
        onClick={() => onTabChange('events')}
      >
        사건
      </button>
      <button 
        className={`segment-button ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onTabChange('settings')}
      >
        배경
      </button>
    </div>
  );
} 