import { useMemo } from 'react';
import '../../../../src/styles/components/sceneDetail.css';

function SceneDetailView({ sceneAnalysis, onUnitClick, selectedUnitId }) {
  if (!sceneAnalysis || !sceneAnalysis.analysis) return null;

  const analysis = typeof sceneAnalysis.analysis === 'string' 
    ? JSON.parse(sceneAnalysis.analysis) 
    : sceneAnalysis.analysis;

  const { units } = analysis;

  const handleUnitClick = (unit) => {
    onUnitClick?.({
      startLine: unit.startLine,
      endLine: unit.endLine,
      unitId: unit.id
    });
  };

  return (
    <div className="scene-detail-view">
      <div className="scene-summary card">
        <h3>장면 요약</h3>
        <p>{analysis.summary}</p>
      </div>

      <div className="scene-units">
        {units.map((unit, index) => (
          <div 
            key={unit.id} 
            className={`unit-card card ${unit.significance} ${selectedUnitId === unit.id ? 'selected' : ''}`}
            onClick={() => handleUnitClick(unit)}
          >
            <div className="unit-header">
              <h4>Unit {index + 1}</h4>
              <span className="unit-type">{unit.type}</span>
              <span className="unit-significance">{unit.significance}</span>
            </div>
            
            <div className="unit-description">
              <p>{unit.description}</p>
              <div className="unit-lines text-sm text-gray-500">
                ({unit.startLine}-{unit.endLine})
              </div>
            </div>

            <div className="unit-characters">
              <h5>등장인물</h5>
              <div className="character-list">
                {unit.characters.map((char, idx) => (
                  <div key={idx} className="character-item">
                    <span className="character-name">{char.name}</span>
                    <div className="character-details">
                      <span className="action">{char.action}</span>
                      <span className="emotion">{char.emotion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {unit.dialogueTopics.length > 0 && (
              <div className="dialogue-topics">
                <h5>대화 주제</h5>
                <div className="topic-list">
                  {unit.dialogueTopics.map((topic, idx) => (
                    <span key={idx} className="topic-tag">{topic}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="unit-details">
              <div className="situation-change">
                <h5>상황 변화</h5>
                <p>{unit.situationChange}</p>
              </div>
              <div className="mood">
                <h5>분위기</h5>
                <p>{unit.mood}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SceneDetailView; 