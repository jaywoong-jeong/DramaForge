import { useAtom } from 'jotai';
import { scriptAtom, analysisResultAtom, analysisStatusAtom } from './atoms';
import { parseScript } from '../services/analysis/scriptParser';
import { analyzePlot } from '../services/analysis/plotAnalyzer';

export function useScriptAnalysis() {
  const [script] = useAtom(scriptAtom);
  const [, setAnalysisResult] = useAtom(analysisResultAtom);
  const [, setAnalysisStatus] = useAtom(analysisStatusAtom);

  const analyzeScript = async () => {
    if (!script) return;

    try {
      setAnalysisStatus({ isAnalyzing: true, error: null });
      
      // 1. 대본 파싱
      const parsedScript = parseScript(script);
      
      // 2. 플롯 분석
      const analysis = await analyzePlot(parsedScript);
      
      // 3. 결과 저장
      setAnalysisResult(analysis);
      
      setAnalysisStatus({ isAnalyzing: false, error: null });
    } catch (error) {
      setAnalysisStatus({ isAnalyzing: false, error: error.message });
    }
  };

  return { analyzeScript };
}
