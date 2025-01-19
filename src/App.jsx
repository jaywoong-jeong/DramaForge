import { useEffect } from 'react';
import ScriptEditor from './components/editor/ScriptEditor';
import AnalysisPanel from './components/analysis/AnalysisPanel';
import { useAtom } from 'jotai';
import { scriptAtom } from './store/atoms';
import { initializeOpenAI } from './services/api/openai';
import './styles/global.css';
import Header from './components/common/Header';

function App() {
  const [, setScript] = useAtom(scriptAtom);

  useEffect(() => {
    // OpenAI 초기화
    try {
      initializeOpenAI(import.meta.env.VITE_OPENAI_API_KEY);
    } catch (error) {
      console.error('OpenAI 초기화 실패:', error);
    }

    // 초기 스크립트 로드
    fetch('/scripts/시청각실.json')
      .then(res => res.json())
      .then(data => setScript(data))
      .catch(err => console.error('스크립트 로드 실패:', err));
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <AnalysisPanel />
        <ScriptEditor />
      </div>
    </div>
  );
}

export default App;
