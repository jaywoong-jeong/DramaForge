import { Settings, Upload } from 'lucide-react';
import { useAtom } from 'jotai';
import { selectedScriptAtom, scriptAtom } from '../../store/atoms';
import { useEffect } from 'react';

const AVAILABLE_SCRIPTS = [
  '대왕은 죽기를 거부했다',
  '시청각실',
  '파수꾼'
];

export default function Header() {
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
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          DramaForge
          <span className="header-version">v1.0</span>
        </div>
        <div className="header-actions">
          <span className="header-select-label">대본 선택</span>
          <select 
            value={selectedScript}
            onChange={(e) => setSelectedScript(e.target.value)}
            className="header-script-select"
          >
            {AVAILABLE_SCRIPTS.map(script => (
              <option key={script} value={script}>
                {script}
              </option>
            ))}
          </select>
          {/* <Upload className="header-icon" />
          <Settings className="header-icon" /> */}
        </div>
      </div>
    </header>
  );
}
