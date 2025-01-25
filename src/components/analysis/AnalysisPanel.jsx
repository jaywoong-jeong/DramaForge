import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';

import { 
  analysisResultAtom, 
  analysisStatusAtom, 
  currentSceneAtom, 
  editorHighlightAtom, 
  scriptAtom,
  selectedScriptAtom
} from '../../store/atoms';
import { useScriptAnalysis } from '../../store/hooks';
import { calculateTotalTime, calculateSceneTime, formatTime } from '../../services/analysis/timeAnalyzer';

import CharacterAnalysis from './characters/CharacterAnalysis';
import PlotAnalysis from './plot/PlotAnalysis';
import SettingsAnalysis from './settings/SettingsAnalysis';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/components/sceneDetail.css';
import '../../styles/components/analysis.css';

function AnalysisPanel() {
  const [mainTab, setMainTab] = useState('characters');
  const [eventViewMode, setEventViewMode] = useState('plot');
  const [analysisResult] = useAtom(analysisResultAtom);
  const [analysisStatus] = useAtom(analysisStatusAtom);
  const [currentScene] = useAtom(currentSceneAtom);
  const [script] = useAtom(scriptAtom);
  const { analyzeScript } = useScriptAnalysis();
  const [, setEditorHighlight] = useAtom(editorHighlightAtom);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [currentSceneTime, setCurrentSceneTime] = useState(null);
  const [selectedScript, setSelectedScript] = useAtom(selectedScriptAtom);

  useEffect(() => {
    if (script && analysisResult) {
      calculateTotalTime(script).then(time => {
        setTotalTime(formatTime(time));
      });
    }
  }, [script, analysisResult]);

  useEffect(() => {
    if (script && analysisResult && currentScene !== undefined) {
      calculateSceneTime(script.scenes[currentScene]).then(time => {
        setCurrentSceneTime(formatTime(time));
      });
    }
  }, [script, analysisResult, currentScene]);

  if (!script) {
    return (
      <div className="analysis-panel">
        <div className="analysis-start-container">
          <h2>대본 로딩 중</h2>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (analysisStatus.isAnalyzing) {
    return (
      <div className="analysis-panel">
        <div className="analysis-start-container">
          <img 
            src="/image/200w.gif" 
            alt="분석 중" 
            className="loading-gif"
          />
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="analysis-panel">
        <div className="analysis-start-container">
          <h2>대본 분석</h2>
          <p>대본의 전체적인 구조와 각 장면을 상세히 분석합니다.</p>
          <button 
            className="analyze-button"
            onClick={analyzeScript}
            disabled={!selectedScript}
          >
            분석 시작
          </button>
        </div>
      </div>
    );
  }

  const sceneAnalysis = analysisResult.sceneAnalyses[currentScene];

  const handleUnitClick = ({ startLine, endLine, unitId }) => {
    setSelectedUnitId(unitId);
    setEditorHighlight({
      startLine,
      endLine,
      type: 'unit'
    });
  };

  return (
    <div className="analysis-panel">
      <div className="time-info-panel">
        <div className="time-info-item">
          <span className="time-label">전체 시간</span>
          <span className="time-value">{totalTime || '계산 중...'}</span>
        </div>
        <div className="time-info-divider" />
        <div className="time-info-item">
          <span className="time-label">현재 장면</span>
          <span className="time-value">{currentSceneTime || '계산 중...'}</span>
        </div>
      </div>

      <div className="segment-control main-segment">
        <button 
          className={`segment-button ${mainTab === 'characters' ? 'active' : ''}`}
          onClick={() => setMainTab('characters')}
        >
          인물
        </button>
        <button 
          className={`segment-button ${mainTab === 'events' ? 'active' : ''}`}
          onClick={() => setMainTab('events')}
        >
          사건
        </button>
        <button 
          className={`segment-button ${mainTab === 'settings' ? 'active' : ''}`}
          onClick={() => setMainTab('settings')}
        >
          배경
        </button>
      </div>

      <div className="analysis-content">
        {mainTab === 'characters' && (
          <CharacterAnalysis />
        )}

        {mainTab === 'events' && (
          <PlotAnalysis 
            analysisResult={analysisResult}
            currentScene={currentScene}
            onUnitClick={handleUnitClick}
            selectedUnitId={selectedUnitId}
          />
        )}

        {mainTab === 'settings' && (
          <SettingsAnalysis />
        )}
      </div>
    </div>
  );
}

export default AnalysisPanel;
