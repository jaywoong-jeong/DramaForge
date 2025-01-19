import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { analysisResultAtom, editorContentAtom, isAnalysisAvailableAtom } from '../store/atoms';
import { analyzeScript } from '../services/analysis/scriptAnalyzer';

export const useAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useAtom(analysisResultAtom);
  const [editorContent] = useAtom(editorContentAtom);
  const isAnalysisAvailable = useAtom(isAnalysisAvailableAtom)[0];

  const runAnalysis = useCallback(async () => {
    if (!editorContent) {
      return;
    }

    try {
      const result = await analyzeScript(editorContent);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      // 에러 처리 로직 추가 필요
    }
  }, [editorContent, setAnalysisResult]);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
  }, [setAnalysisResult]);

  return {
    analysisResult,
    runAnalysis,
    clearAnalysis,
    isAnalysisAvailable,
  };
}; 