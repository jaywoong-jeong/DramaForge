import { atom } from 'jotai';

// 기존 atoms 유지
export const scriptAtom = atom(null);
export const selectedScriptAtom = atom(null);
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

// 버전 관리를 위한 atoms
export const currentVersionAtom = atom(1); // 현재 선택된 버전
export const compareVersionAtom = atom(null); // 비교할 버전 (null이면 비교모드 아님)
export const scriptVersionsAtom = atom([]); // 사용 가능한 버전 목록

// Version comparison atoms
export const leftVersionAtom = atom(1);
export const rightVersionAtom = atom(2);
export const previousVersionAtom = atom(1);
export const isCompareModeAtom = atom(false);
