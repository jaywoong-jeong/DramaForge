import { analyzeWholeScene, analyzeScene, analyzeUnit } from '../api/openai';
import { ANALYSIS_PROMPTS } from '../api/config';
//import { analyzeUnits } from './unitAnalyzer';

export async function analyzePlot(parsedScript) {
  try {
    // 전체 플롯 분석
    const plotAnalysis = await analyzeWholeScene( parsedScript );

    // JSON 형식으로 파싱
    const plotStructure = JSON.parse(plotAnalysis);

    // 각 장면별 분석 (2단계로 나누어 수행)
    const sceneAnalyses = await Promise.all(
      parsedScript.scenes.map(async (scene) => {
        // 1단계: 장면의 기본 정보 분석
        const sceneAnalysis = await analyzeScene( scene.content );
        const baseAnalysis = JSON.parse(sceneAnalysis);

        // 2단계: unit 분석
        const unitAnalysis = await analyzeUnit(scene.content);

        // 두 분석 결과 병합
        return {
          ...scene,
          analysis: {
            ...baseAnalysis,
            ...unitAnalysis
          }
        };
      })
    );

    return {
      plotStructure,
      sceneAnalyses
    };
  } catch (error) {
    console.error('플롯 분석 실패:', error);
    throw error;
  }
}

function cleanJsonResponse(response) {
  let cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  cleanedResponse = cleanedResponse.trim();
  
  const jsonStart = cleanedResponse.indexOf('{');
  const jsonEnd = cleanedResponse.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleanedResponse = cleanedResponse.slice(jsonStart, jsonEnd + 1);
  }
  
  return cleanedResponse;
}
