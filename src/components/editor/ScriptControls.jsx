import { useAtom } from 'jotai';
import { selectedScriptAtom, scriptAtom, currentVersionAtom, compareVersionAtom, scriptVersionsAtom } from '../../store/atoms';
import { useEffect } from 'react';
import '../../styles/components/editor.css';

// 테스트용 버전 데이터
const TEST_VERSIONS = [
  { version: 1, timestamp: '2024-03-15' },
  { version: 2, timestamp: '2024-03-16' }
];

function ScriptControls() {
  const [selectedScript, setSelectedScript] = useAtom(selectedScriptAtom);
  const [script, setScript] = useAtom(scriptAtom);
  const [currentVersion, setCurrentVersion] = useAtom(currentVersionAtom);
  const [compareVersion, setCompareVersion] = useAtom(compareVersionAtom);
  const [versions, setVersions] = useAtom(scriptVersionsAtom);

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

  const toggleCompareMode = () => {
    if (compareVersion) {
      setCompareVersion(null);
    } else {
      const latestVersion = Math.max(...versions.map(v => v.version));
      setCompareVersion(latestVersion === currentVersion ? latestVersion - 1 : latestVersion);
    }
  };

  // 대본과 버전을 통합한 옵션 생성
  const scriptVersionOptions = versions.map(v => ({
    id: `${selectedScript}_v${v.version}`,
    label: `${selectedScript} v${v.version}`,
    script: selectedScript,
    version: v.version
  }));

  const handleScriptVersionChange = (e) => {
    const [script, version] = e.target.value.split('_v');
    setSelectedScript(script);
    setCurrentVersion(Number(version));
  };

  return (
    <div className="script-controls">
      <div className="script-controls-content">
        <div className="controls-row">
          <div className="version-control">
            <label>Version: </label>
            <select
              value={`${selectedScript}_v${currentVersion}`}
              onChange={handleScriptVersionChange}
              className="version-select"
            >
              {scriptVersionOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-buttons">
            <button 
              onClick={toggleCompareMode}
              className={`control-button compare-button ${compareVersion ? 'active' : ''}`}
            >
              버전 비교
            </button>
            <button className="control-button ai-rewrite-button" disabled>
              AI 각색
            </button>
            <button onClick={handleSave} className="control-button save-button">
              저장
            </button>
          </div>
        </div>

        {compareVersion && (
          <div className="compare-control">
            <select
              value={`${selectedScript}_v${compareVersion}`}
              onChange={(e) => {
                const [, version] = e.target.value.split('_v');
                setCompareVersion(Number(version));
              }}
              className="compare-version-select"
            >
              {scriptVersionOptions
                .filter(option => option.version !== currentVersion)
                .map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScriptControls; 