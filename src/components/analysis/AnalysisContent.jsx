import React from 'react';
import CharacterAnalysis from './CharacterAnalysis';
import PlotView from './PlotView';
import SceneDetailView from './SceneDetailView';
import StageAnalysis from './StageAnalysis';

export function AnalysisContent({ 
  mainTab, 
  eventViewMode, 
  onViewModeChange,
  analysisResult,
  sceneAnalysis,
  onUnitClick,
  selectedUnitId
}) {
  return (
    <div className="analysis-content">
      {mainTab === 'characters' && (
        <CharacterAnalysis />
      )}

      {mainTab === 'events' && (
        <>
          <div className="segment-control">
            <button 
              className={`segment-button ${eventViewMode === 'plot' ? 'active' : ''}`}
              onClick={() => onViewModeChange('plot')}
            >
              전체 플롯
            </button>
            <button 
              className={`segment-button ${eventViewMode === 'scene' ? 'active' : ''}`}
              onClick={() => onViewModeChange('scene')}
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
      )}

      {mainTab === 'settings' && (
        <StageAnalysis data={analysisResult?.stageAnalysis} />
      )}
    </div>
  );
} 