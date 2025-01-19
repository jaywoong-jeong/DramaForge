import { useAtom } from 'jotai';
import { scriptAtom, currentSceneAtom, editorHighlightAtom, selectedScriptAtom } from '../../store/atoms';
import '../../styles/components/editor.css';

function ScriptEditor() {
  const [script] = useAtom(scriptAtom);
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [highlight] = useAtom(editorHighlightAtom);
  const [selectedScript] = useAtom(selectedScriptAtom);

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

  return (
    <div className="editor-panel">
      <div className="script-header">
        <div className="header-main">
          <h2>대본: {selectedScript}</h2>
          <select 
            className="scene-selector"
            value={currentScene}
            onChange={(e) => setCurrentScene(Number(e.target.value))}
          >
            <option value={-1}>전체</option>
            {script.scenes.map((scene, index) => (
              <option key={index} value={index}>
                {index + 1}장: {scene.title || `장면 ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
        <div className="character-list">
          <h3>등장인물</h3>
          <ul>
            {Array.isArray(script?.characters) && script.characters.map((char, idx) => (
              <li key={idx}>{char}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="script-content">
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
    </div>
  );
}

export default ScriptEditor;
