import { useState } from 'react';
import PlotView from './PlotView';
import SceneDetailView from './SceneDetailView';

function PlotAnalysis({ analysisResult, currentScene, onUnitClick, selectedUnitId }) {
  const [eventViewMode, setEventViewMode] = useState('plot');
  const sceneAnalysis = analysisResult.sceneAnalyses[currentScene];

  return (
    <>
      <div className="segment-control">
        <button 
          className={`segment-button ${eventViewMode === 'plot' ? 'active' : ''}`}
          onClick={() => setEventViewMode('plot')}
        >
          전체 플롯
        </button>
        <button 
          className={`segment-button ${eventViewMode === 'scene' ? 'active' : ''}`}
          onClick={() => setEventViewMode('scene')}
        >
          현재 장면
        </button>
      </div>

      <div className="event-content">
        {eventViewMode === 'plot' ? (
          <PlotView plotStructure={analysisResult?.plotStructure} />
        ) : (
          <SceneDetailView 
            sceneAnalysis={sceneAnalysis} 
            onUnitClick={onUnitClick}
            selectedUnitId={selectedUnitId}
          />
        )}
      </div>
    </>
  );
}

export default PlotAnalysis; 