import { useAtom } from 'jotai';
import { 
  leftVersionAtom,
  rightVersionAtom,
} from '../../store/atoms';
import { useEffect, useState } from 'react';
import EditorControls from './EditorControls';
import '../../styles/components/editor.css';

function CompareView() {
  const [leftVersion] = useAtom(leftVersionAtom);
  const [rightVersion] = useAtom(rightVersionAtom);
  const [leftScript, setLeftScript] = useState(null);
  const [rightScript, setRightScript] = useState(null);
  const [selectedTab, setSelectedTab] = useState('characters');

  useEffect(() => {
    const loadScript = async () => {
      try {
        const response = await fetch('/scripts/시청각실.json');
        const data = await response.json();
        
        setLeftScript(data);
        setRightScript(data);
      } catch (err) {
        console.error('스크립트 로드 실패:', err);
      }
    };

    loadScript();
  }, []); // 초기 로드 시 한 번만 실행

  const renderAnalysisPanel = (script, version) => {
    if (!script) {
      return <div className="horizontal-analysis-panel">데이터를 불러오는 중...</div>;
    }

    return (
      <div className="horizontal-analysis-panel">
        <div className="segment-controls">
          <button 
            className={`segment-button ${selectedTab === 'characters' ? 'active' : ''}`}
            onClick={() => setSelectedTab('characters')}
          >
            인물
          </button>
          <button 
            className={`segment-button ${selectedTab === 'events' ? 'active' : ''}`}
            onClick={() => setSelectedTab('events')}
          >
            사건
          </button>
          <button 
            className={`segment-button ${selectedTab === 'settings' ? 'active' : ''}`}
            onClick={() => setSelectedTab('settings')}
          >
            배경
          </button>
        </div>
        <div className="analysis-content">
          {selectedTab === 'characters' && (
            <div className="analysis-section">
              <p>주요 인물: {script?.characters?.length || 0}명</p>
            </div>
          )}
          {selectedTab === 'events' && (
            <div className="analysis-section">
              <p>총 장면 수: {script?.scenes?.length || 0}</p>
            </div>
          )}
          {selectedTab === 'settings' && (
            <div className="analysis-section">
              <p>장소 수: {script?.settings?.length || 0}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderScriptContent = (script, version) => {
    if (!script) {
      return <div className="editor-container">데이터를 불러오는 중...</div>;
    }

    if (!script.scenes || !Array.isArray(script.scenes)) {
      return <div className="editor-container">스크립트 데이터가 올바르지 않습니다.</div>;
    }

    return (
      <div className="editor-container">
        <div className="script-content">
          {script.scenes.map((scene, index) => {
            if (!scene) {
              return <div key={index}>장면 데이터가 올바르지 않습니다.</div>;
            }

            return (
              <div key={index} className="scene">
                <h3>장면 {scene.scene_number}</h3>
                {/* Directions */}
                {scene.directions?.map((item, i) => (
                  <div key={`dir-${i}`} className="script-line direction">
                    <p className="direction-text">{item.content}</p>
                  </div>
                ))}
                {/* Dialogues */}
                {scene.dialogues?.map((item, i) => (
                  <div key={`dial-${i}`} className="script-line dialogue">
                    <span className="character-name">{item.character}</span>
                    {item.lines.map((line, lineIndex) => (
                      <p key={`line-${lineIndex}`} className="dialogue-text">{line}</p>
                    ))}
                  </div>
                ))}
                {/* Post Directions */}
                {scene.directions_post?.map((item, i) => (
                  <div key={`dir-post-${i}`} className="script-line direction">
                    <p className="direction-text">{item.content}</p>
                  </div>
                ))}
                {/* Post Dialogues */}
                {scene.dialogues_post?.map((item, i) => (
                  <div key={`dial-post-${i}`} className="script-line dialogue">
                    <span className="character-name">{item.character}</span>
                    {item.lines.map((line, lineIndex) => (
                      <p key={`line-${lineIndex}`} className="dialogue-text">{line}</p>
                    ))}
                  </div>
                ))}
                {/* End Directions */}
                {scene.directions_end?.map((item, i) => (
                  <div key={`dir-end-${i}`} className="script-line direction">
                    <p className="direction-text">{item.content}</p>
                  </div>
                ))}
                {/* End Dialogues */}
                {scene.dialogues_end?.map((item, i) => (
                  <div key={`dial-end-${i}`} className="script-line dialogue">
                    <span className="character-name">{item.character}</span>
                    {item.lines.map((line, lineIndex) => (
                      <p key={`line-${lineIndex}`} className="dialogue-text">{line}</p>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 데이터가 모두 없는 경우 전체 로딩 표시
  if (!leftScript && !rightScript) {
    return <div className="compare-view">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="compare-view">
      <EditorControls />
      <div className="version-panels">
        <div className="version-panel">
          {renderAnalysisPanel(leftScript, leftVersion)}
          {renderScriptContent(leftScript, leftVersion)}
        </div>
        <div className="version-panel">
          {renderAnalysisPanel(rightScript, rightVersion)}
          {renderScriptContent(rightScript, rightVersion)}
        </div>
      </div>
    </div>
  );
}

export default CompareView; 