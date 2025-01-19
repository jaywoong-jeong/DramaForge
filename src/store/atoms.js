import { atom } from 'jotai';

// 기존 atoms 유지
export const scriptAtom = atom(null);
export const selectedScriptAtom = atom('시청각실');
export const currentSceneAtom = atom(0);
export const analysisResultAtom = atom(null);
export const analysisStatusAtom = atom({
  isAnalyzing: false,
  error: null
});

// API 키를 위한 atom 추가
export const apiKeyAtom = atom(import.meta.env.VITE_OPENAI_API_KEY || '');

export const editorHighlightAtom = atom({
  startLine: null,
  endLine: null,
  type: null
});

export const stageAnalysisAtom = atom({
  props: [],
  layouts: {},  // sceneId를 키로 사용하는 레이아웃 맵
  selectedProp: null
});

export const settingsAnalysisResultAtom = atom({
  fixtures: [],  // 설비 목록
  props: [],     // 소품 목록
  key: 'settingsAnalysisResult'
});

export const sceneLayoutAtom = atom(
  {},  // 초기값: 빈 객체
  (get, set, newLayout) => {
    const currentScene = get(currentSceneAtom);
    set(stageAnalysisAtom, prev => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [currentScene]: newLayout
      }
    }));
  }
);

export const selectedSceneIdAtom = atom(null);  // 선택된 장면 ID를 추적하는 atom

export const selectedPropsTypeAtom = atom('all');
