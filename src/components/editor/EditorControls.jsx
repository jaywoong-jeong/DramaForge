import { useAtom } from 'jotai';
import { 
  selectedScriptAtom, 
  scriptAtom, 
  currentVersionAtom, 
  scriptVersionsAtom,
  leftVersionAtom,
  rightVersionAtom,
  previousVersionAtom,
  isCompareModeAtom
} from '../../store/atoms';
import { useEffect, useState } from 'react';
import '../../styles/components/editor.css';

// 테스트용 버전 데이터 수정
const TEST_VERSIONS = [
  { script: '시청각실', version: 1, timestamp: '2024-03-15' },
  { script: '시청각실', version: 2, timestamp: '2024-03-16' },
  { script: '친전한 식구들', version: 1, timestamp: '2024-03-15' }
];

function EditorControls() {
  const [selectedScript, setSelectedScript] = useAtom(selectedScriptAtom);
  const [script, setScript] = useAtom(scriptAtom);
  const [currentVersion, setCurrentVersion] = useAtom(currentVersionAtom);
  const [versions, setVersions] = useAtom(scriptVersionsAtom);
  const [leftVersion, setLeftVersion] = useAtom(leftVersionAtom);
  const [rightVersion, setRightVersion] = useAtom(rightVersionAtom);
  const [previousVersion, setPreviousVersion] = useAtom(previousVersionAtom);
  const [isCompareMode, setIsCompareMode] = useAtom(isCompareModeAtom);
  const [showVersionMenu, setShowVersionMenu] = useState(false);

  useEffect(() => {
    loadScript(selectedScript, currentVersion);
    setVersions(TEST_VERSIONS);
  }, [selectedScript, currentVersion]);

  const loadScript = async (scriptName, version) => {
    try {
      const response = await fetch(`/scripts/${scriptName}.json`);
      const data = await response.json();
      setScript(data);
    } catch (err) {
      console.error('스크립트 로드 실패:', err);
    }
  };

  const handleSave = async () => {
    try {
      const newVersion = currentVersion + 1;
      setCurrentVersion(newVersion);
      setVersions(prev => [...prev, { version: newVersion, timestamp: new Date().toISOString().split('T')[0] }]);
    } catch (err) {
      console.error('저장 실패:', err);
    }
  };

  const enterCompareMode = () => {
    setPreviousVersion(currentVersion);
    setLeftVersion(currentVersion);
    setRightVersion(versions.length > 1 ? versions[versions.length - 2].version : 1);
    setIsCompareMode(true);
    setShowVersionMenu(false);
  };

  const exitCompareMode = (targetVersion) => {
    setCurrentVersion(targetVersion);
    setIsCompareMode(false);
    setShowVersionMenu(false);
  };

  return (
    <div className="editor-controls">
      <div className="control-group">
        {!isCompareMode ? (
          <div className="version-select-group">
            <label>Version:</label>
            <select
              value={`${selectedScript}-${currentVersion}`}
              onChange={(e) => {
                const [script, version] = e.target.value.split('-');
                setSelectedScript(script);
                setCurrentVersion(Number(version));
              }}
              className="script-select"
            >
              {TEST_VERSIONS.map(v => (
                <option key={`${v.script}-${v.version}`} value={`${v.script}-${v.version}`}>
                  {v.script} (v{v.version})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="compare-version-selects">
            <div className="version-select-group">
              <label>Left:</label>
              <select
                value={`${selectedScript}-${leftVersion}`}
                onChange={(e) => {
                  const [script, version] = e.target.value.split('-');
                  setSelectedScript(script);
                  setLeftVersion(Number(version));
                }}
                className="script-select"
              >
                {TEST_VERSIONS.map(v => (
                  <option key={`${v.script}-${v.version}`} value={`${v.script}-${v.version}`}>
                    {v.script} (v{v.version})
                  </option>
                ))}
              </select>
            </div>
            <div className="version-select-group">
              <label>Right:</label>
              <select
                value={`${selectedScript}-${rightVersion}`}
                onChange={(e) => {
                  const [script, version] = e.target.value.split('-');
                  setSelectedScript(script);
                  setRightVersion(Number(version));
                }}
                className="script-select"
              >
                {TEST_VERSIONS.map(v => (
                  <option key={`${v.script}-${v.version}`} value={`${v.script}-${v.version}`}>
                    {v.script} (v{v.version})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="button-group">
          <button 
            onClick={isCompareMode ? () => exitCompareMode(previousVersion) : enterCompareMode}
            className={`compare-toggle ${isCompareMode ? 'active' : ''}`}
          >
            버전 비교
          </button>

          <button className="ai-rewrite-button" disabled>
            AI 각색
          </button>

          <button onClick={handleSave} className="save-button" disabled={isCompareMode}>
            저장
          </button>

          {isCompareMode && (
            <button 
              onClick={() => setShowVersionMenu(!showVersionMenu)}
              className="version-menu-button"
            >
              ⋮
            </button>
          )}
          {showVersionMenu && (
            <div className="version-menu">
              <button onClick={() => exitCompareMode(leftVersion)}>
                왼쪽 버전으로 계속
              </button>
              <button onClick={() => exitCompareMode(rightVersion)}>
                오른쪽 버전으로 계속
              </button>
              <button onClick={() => exitCompareMode(previousVersion)}>
                이전 버전으로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorControls;
