import React from 'react';
import StageNavigator from '../components/StageNavigator';

const VisualizationPage = () => {
  const containerStyle = {
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  };

  return (
    <div style={containerStyle}>
      <h1>Visualization</h1>
      <p>This page will contain visualizations of the script analysis.</p>
      <p>Content coming soon.</p>
      <StageNavigator currentStage="6" />
    </div>
  );
};

export default VisualizationPage;
