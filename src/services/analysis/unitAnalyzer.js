import { analyzeScene } from '../api/openai';
import { ANALYSIS_PROMPTS } from '../api/config';

export async function analyzeUnits(sceneContent) {
  try {
    // Unit 분석 수행
    const unitAnalysis = await analyzeScene(
      sceneContent,
      ANALYSIS_PROMPTS.unitAnalysis
    );

    // JSON 파싱
    const cleanedResponse = cleanJsonResponse(unitAnalysis);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Unit 분석 실패:', error);
    throw error;
  }
}

function cleanJsonResponse(response) {
  // 마크다운 코드 블록 제거
  let cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // 앞뒤 공백 제거
  cleanedResponse = cleanedResponse.trim();
  
  // JSON 객체 부분만 추출
  const jsonStart = cleanedResponse.indexOf('{');
  const jsonEnd = cleanedResponse.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleanedResponse = cleanedResponse.slice(jsonStart, jsonEnd + 1);
  }
  
  return cleanedResponse;
} 