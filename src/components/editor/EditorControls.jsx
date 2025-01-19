import { useAtom } from 'jotai';
import { selectedScriptAtom, scriptAtom } from '../../store/atoms';
import { useEffect } from 'react';
import '../../styles/components/editor.css';

const AVAILABLE_SCRIPTS = ['시청각실'];

function EditorControls() {
  const [selectedScript, setSelectedScript] = useAtom(selectedScriptAtom);
  const [, setScript] = useAtom(scriptAtom);

  useEffect(() => {
    // 선택된 스크립트 로드
    fetch(`/scripts/${selectedScript}.json`)
      .then(res => res.json())
      .then(data => setScript(data))
      .catch(err => console.error('스크립트 로드 실패:', err));
  }, [selectedScript, setScript]);

  return (
    <div className="editor-controls">
      <select 
        value={selectedScript}
        onChange={(e) => setSelectedScript(e.target.value)}
        className="script-select"
      >
        {AVAILABLE_SCRIPTS.map(script => (
          <option key={script} value={script}>
            {script}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EditorControls;
