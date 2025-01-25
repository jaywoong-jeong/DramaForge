import { useAtom } from 'jotai';
import { scriptAtom, currentSceneAtom, editorHighlightAtom, selectedScriptAtom, isCompareModeAtom, currentVersionAtom, analysisResultAtom } from '../../store/atoms';
import ScriptControls from './ScriptControls';
import EditorControls from './EditorControls';
import CompareView from './CompareView';
import '../../styles/components/editor.css';
import { uploadScript, deleteScript } from '../../api/firebase/uploadScript';
import { useEffect, useState } from 'react';
import { fetchScriptList, fetchScriptByTitle } from '../../api/firebase/fetchScript';
import { fetchAnalysis } from '../../api/firebase/fetchAnalysis';

function ScriptEditor() {
  const [script, setScript] = useAtom(scriptAtom);
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [highlight] = useAtom(editorHighlightAtom);
  const [selectedScript, setSelectedScript] = useAtom(selectedScriptAtom);
  const [selectedScriptVersion, setSelectedScriptVersion] = useAtom(currentVersionAtom);
  const [isCompareMode] = useAtom(isCompareModeAtom);
  const [availableScripts, setAvailableScripts] = useState(['대본을 선택해주세요']);
  const [, setAnalysisResult] = useAtom(analysisResultAtom);

  /*
    const AVAILABLE_SCRIPTS = [
    '대본을 선택해주세요',
    '대왕은 죽기를 거부했다',
    '시청각실',
    '파수꾼'
  ];
  */

  // 스크립트 목록 가져오기
  useEffect(() => {
    const loadScripts = async () => {
      try {
        const scripts = await fetchScriptList();
        setAvailableScripts(scripts);
      } catch (error) {
        console.error('스크립트 목록을 불러오는데 실패했습니다:', error);
        alert('스크립트 목록을 불러오는데 실패했습니다.');
      }
    };
    
    loadScripts();
  }, []);

  // 선택된 스크립트 데이터 가져오기
  useEffect(() => {
    const loadScript = async () => {
      if (selectedScript && selectedScript !== '대본을 선택해주세요') {
        try {
          const scriptData = await fetchScriptByTitle(selectedScript);
          setScript(scriptData);
          
          // 분석 결과가 있으면 가져오기
          if (scriptData.isAnalyzed && scriptData.analysisId) {
            try {
              const analysisData = await fetchAnalysis(scriptData.analysisId);
              setAnalysisResult(analysisData);
            } catch (error) {
              console.error('분석 결과를 불러오는데 실패했습니다:', error);
            }
          } else {
            setAnalysisResult(null);
          }
        } catch (error) {
          console.error('스크립트를 불러오는데 실패했습니다:', error);
          alert('스크립트를 불러오는데 실패했습니다.');
        }
      }
    };
    
    loadScript();
  }, [selectedScript, setScript, setAnalysisResult]);

  if (!script) return <div className="editor-panel">Loading...</div>;

  // 현재 라인 번호를 추적하는 함수
  const getLineInfo = (sceneIdx, contentType, itemIdx, lineIdx = null) => {
    let currentLine = 1;
    
    for (let i = 0; i < script.scenes.length; i++) {
      const scene = script.scenes[i];
      
      if (i === sceneIdx) {
        // 현재 장면에서 라인 계산
        if (contentType === 'directions' && itemIdx !== null) {
          return currentLine + itemIdx;
        }
        if (contentType === 'dialogues' && itemIdx !== null) {
          // directions의 라인 수를 더함
          currentLine += (scene.directions?.length || 0);
          
          // 이전 대사들의 라인 수를 더함
          for (let j = 0; j < itemIdx; j++) {
            currentLine += (scene.dialogues[j]?.lines?.length || 0);
            currentLine += (scene.dialogues[j]?.pre_directions?.length || 0);
          }
          
          // 현재 대사의 pre_directions를 더함
          currentLine += (scene.dialogues[itemIdx]?.pre_directions?.length || 0);
          
          // 특정 대사 라인을 요청한 경우
          if (lineIdx !== null) {
            return currentLine + lineIdx;
          }
          return currentLine;
        }
        break;
      }
      
      // 이전 장면들의 라인 수를 더함
      currentLine += (scene.directions?.length || 0);
      scene.dialogues?.forEach(dialogue => {
        currentLine += (dialogue.lines?.length || 0);
        currentLine += (dialogue.pre_directions?.length || 0);
      });
      currentLine += (scene.directions_post?.length || 0);
      scene.dialogues_post?.forEach(dialogue => {
        currentLine += (dialogue.lines?.length || 0);
        currentLine += (dialogue.pre_directions?.length || 0);
      });
    }
    
    return currentLine;
  };

  const isLineHighlighted = (lineNumber) => {
    if (!highlight.startLine || !highlight.endLine) return false;
    return lineNumber >= highlight.startLine && lineNumber <= highlight.endLine;
  };

  const renderDialogues = (dialogues, sceneIdx) => {
    if (!dialogues) return null;
    return dialogues.map((dialogue, idx) => (
      <div key={idx} className="dialogue-entry">
        {dialogue.pre_directions && Array.isArray(dialogue.pre_directions) && (
          <div className="pre-direction">
            {dialogue.pre_directions.map((dir, dirIdx) => {
              const lineNumber = getLineInfo(sceneIdx, 'dialogues', idx, dirIdx);
              return (
                <span key={dirIdx} className={`direction-line ${isLineHighlighted(lineNumber) ? 'highlighted' : ''}`}>
                  ({dir.content})
                </span>
              );
            })}
          </div>
        )}
        <span className="character-name">{dialogue.character}:</span>
        <div className="dialogue-lines">
          {dialogue.lines?.map((line, lineIdx) => {
            const lineNumber = getLineInfo(sceneIdx, 'dialogues', idx, lineIdx);
            return (
              <p key={lineIdx} className={`dialogue-line ${isLineHighlighted(lineNumber) ? 'highlighted' : ''}`}>
                {line}
              </p>
            );
          })}
        </div>
      </div>
    ));
  };

  const renderDirections = (directions, sceneIdx) => {
    if (!directions || !Array.isArray(directions)) return null;
    return directions.map((direction, idx) => {
      const lineNumber = getLineInfo(sceneIdx, 'directions', idx);
      return (
        <div key={idx} className={`direction-entry ${isLineHighlighted(lineNumber) ? 'highlighted' : ''}`}>
          ({direction.content || direction.type})
        </div>
      );
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const scriptData = JSON.parse(e.target.result);
        const scriptName = file.name.replace('.json', '');
        const scriptVersion = scriptData.version;
        
        // Firebase에 업로드
        await uploadScript(scriptData, scriptName);
        
        // 로컬 상태 업데이트
        setScript(scriptData);
        setSelectedScript(scriptName);
        setSelectedScriptVersion(scriptVersion);
        
        // 스크립트 목록 다시 불러오기
        const updatedScripts = await fetchScriptList();
        setAvailableScripts(updatedScripts);
        
        alert('스크립트가 성공적으로 업로드되었습니다.');
      } catch (error) {
        console.error('Error handling file:', error);
        alert(error.message || '스크립트 업로드 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteScript = async () => {
    if (!script?.id) return;
    
    if (window.confirm(`정말로 "${selectedScript}" 스크립트를 삭제하시겠습니까?`)) {
      try {
        await deleteScript(script.id);
        
        // 스크립트 목록 다시 불러오기
        const updatedScripts = await fetchScriptList();
        setAvailableScripts(updatedScripts);
        
        // 상태 초기화
        setScript(null);
        setSelectedScript('대본을 선택해주세요');
        setCurrentScene(-1);
        
        alert('스크립트가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting script:', error);
        alert('스크립트 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="editor-panel">
      {isCompareMode ? (
        <CompareView />
      ) : (
        <>
        <div className="editor-header">
          <div className="header">
            <h3>대본 선택 or 업로드</h3>
            <select 
            value={selectedScript}
            onChange={(e) => setSelectedScript(e.target.value)}
            className="header-script-select">
            {availableScripts.map(script => (
              <option key={script} value={script}>
                {script}
              </option>
            ))}
            </select>
            <div className="upload-script-button">
              <label htmlFor="script-upload" className="upload-label">
                대본 파일 업로드 (.json)
              </label>
              <input
                id="script-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="file-input"
                style={{ display: 'none' }}
              />
            </div>
          </div>
          
        {!selectedScript ? (
          <>
          </>
          
        ) : (
        <div className="editor-main-content">
          <EditorControls />
          <div className="script-header">
            <div className="header-content">
              <h2>
                {script.title || selectedScript}
                {script?.version && <span className="version-tag">v{script.version}</span>}
              </h2>
              <div className="header-controls">
                <button 
                  onClick={handleDeleteScript}
                  className="delete-button"
                >
                  스크립트 삭제
                </button>
                <select 
                  className="scene-selector"
                  value={currentScene}
                  onChange={(e) => setCurrentScene(Number(e.target.value))}
                >
                  <option value={-1}>전체 장면</option>
                  {script.scenes.map((scene, idx) => (
                    <option key={idx} value={idx}>
                      장면 {idx + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="content-header">
            <div className="character-list">
              <h3>등장인물</h3>
              <ul>
                {Array.isArray(script?.characters) && script.characters.map((char, idx) => (
                  <li key={idx}>{char}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="stage-description">
            <h3>무대 설명</h3>
            <p>{script?.stage?.description || '무대 설명이 없습니다.'}</p>
          </div>

          <div className="scenes">
            {Array.isArray(script?.scenes) && script.scenes.map((scene, sceneIdx) => (
              (currentScene === -1 || currentScene === sceneIdx) && (
                <div 
                  key={sceneIdx}
                  className={`scene ${currentScene === sceneIdx ? 'active' : ''}`}
                  onClick={() => setCurrentScene(sceneIdx)}
                >
                  <h3>Scene {scene.scene_number}</h3>
                  {renderDirections(scene.directions, sceneIdx)}
                  {renderDialogues(scene.dialogues, sceneIdx)}
                  {renderDirections(scene.directions_post, sceneIdx)}
                  {renderDialogues(scene.dialogues_post, sceneIdx)}
                  {renderDirections(scene.directions_final, sceneIdx)}
                  {renderDialogues(scene.dialogues_final, sceneIdx)}
                  {renderDirections(scene.directions_end, sceneIdx)}
                  {renderDialogues(scene.dialogues_end, sceneIdx)}
                </div>
              )
            ))}
          </div>
        </div>
        )}
        </div>
        </>
      )}
    </div>
  );
}

export default ScriptEditor;
