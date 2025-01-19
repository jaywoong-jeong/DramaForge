import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';

import { 
  settingsAnalysisResultAtom, 
  selectedSceneIdAtom, 
  sceneLayoutAtom,
  scriptAtom 
} from '../../../store/atoms';
import { analyzeSettings, saveSceneLayout, loadSceneLayout } from '../../../services/analysis/settingsAnalyzer';
import StageLayout from './StageLayout';
import PropsList from './PropsList';
import '../../../styles/components/analysis/settings.css';

const SettingsAnalysis = () => {
  const [script] = useAtom(scriptAtom);
  const [analysisResult, setAnalysisResult] = useAtom(settingsAnalysisResultAtom);
  const [selectedSceneId, setSelectedSceneId] = useAtom(selectedSceneIdAtom);
  const [sceneLayout, setSceneLayout] = useAtom(sceneLayoutAtom);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  console.log('Rendering SettingsAnalysis - script:', script);
  console.log('Rendering SettingsAnalysis - analysisResult:', analysisResult);

  useEffect(() => {
    console.log('analysisResult changed:', analysisResult);
  }, [analysisResult]);

  useEffect(() => {
    if (script) {
      handleAnalyze();
    }
  }, [script]);

  useEffect(() => {
    if (selectedSceneId) {
      const savedLayout = loadSceneLayout(selectedSceneId);
      if (savedLayout) {
        setSceneLayout(prev => ({
          ...prev,
          [selectedSceneId]: savedLayout
        }));
      }
    }
  }, [selectedSceneId]);

  const handleAnalyze = async () => {
    if (!script) return;
    
    try {
      setIsAnalyzing(true);
      const result = await analyzeSettings(script);
      
      if (!result) {
        throw new Error('분석 결과가 없습니다.');
      }
      
      setAnalysisResult({
        stage: result.stage || { mainBackground: '', areas: [] },
        fixtures: result.fixtures || [],
        props: result.props || []
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult({ 
        stage: { mainBackground: '', areas: [] },
        fixtures: [], 
        props: [] 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!selectedSceneId || !sceneLayout[selectedSceneId]) return;
    
    try {
      saveSceneLayout(selectedSceneId, sceneLayout[selectedSceneId]);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  if (!script) {
    return (
      <div className="settings-analysis empty">
        <div className="empty-message">
          대본을 먼저 불러와주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="settings-analysis">
      <div className="stage-container">
        <div className="stage-header">
          <select
            className="scene-select"
            value={selectedSceneId || ""}
            onChange={(e) => setSelectedSceneId(e.target.value)}
          >
            <option value="" disabled>장면 선택</option>
            {script.scenes.map((scene, index) => (
              <option key={index} value={String(index)}>
                {scene.title || `${index + 1}장`}
              </option>
            ))}
          </select>
          <button 
            className="save-button"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
        <div className="stage-content">
          <StageLayout
            fixtures={analysisResult?.fixtures || []}
            props={analysisResult?.props || []}
            layout={sceneLayout[selectedSceneId]}
            onLayoutChange={(newLayout) => 
              setSceneLayout(prev => ({
                ...prev,
                [selectedSceneId]: newLayout
              }))
            }
            isLoading={isAnalyzing}
          />
        </div>
      </div>

      <div className="props-section">
        <h3 className="section-title">소품 & 설비 목록</h3>
        <p className="section-description">아이템을 드래그하여 무대에 배치하세요</p>
        <PropsList 
          fixtures={analysisResult?.fixtures || []}
          props={analysisResult?.props || []}
        />
      </div>
    </div>
  );
};

export default SettingsAnalysis; 