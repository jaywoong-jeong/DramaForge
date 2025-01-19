import { analyzeText } from '../api/openai';
import { ANALYSIS_PROMPTS } from '../api/config';

/**
 * 소품과 설비를 분석하고 추출하는 함수
 * @param {Object} script - 분석할 스크립트 데이터
 * @returns {Object} 분석 결과 (fixtures, props)
 */
export const analyzeSettings = async (script) => {
  if (!script) {
    throw new Error('스크립트가 제공되지 않았습니다.');
  }

  try {
    // OpenAI API를 사용한 분석
    const analysisResult = await analyzeText(
      ANALYSIS_PROMPTS.settingsAnalysis,
      JSON.stringify(script)
    );
    
    // 응답 정제 및 결과 파싱
    const cleanedResponse = cleanJsonResponse(analysisResult);
    const result = JSON.parse(cleanedResponse);
    
    // fixtures와 props 데이터 추출 및 포맷팅
    const formattedFixtures = (result.fixtures || []).map(fixture => ({
      name: fixture.name,
      type: 'fixtures',
      firstAppearance: fixture.firstAppearance,
      relatedCharacters: fixture.relatedCharacters || [],
      stateChanges: fixture.stateChanges || []
    }));

    const formattedProps = (result.props || []).map(prop => ({
      name: prop.name,
      type: 'props',
      firstAppearance: prop.firstAppearance,
      relatedCharacters: prop.relatedCharacters || [],
      stateChanges: prop.stateChanges || []
    }));

    return {
      stage: {
        mainBackground: result.stage?.mainBackground || '',
        areas: result.stage?.areas || []
      },
      fixtures: formattedFixtures,
      props: formattedProps
    };
  } catch (error) {
    console.error('Settings analysis failed:', error);
    return { 
      stage: {
        mainBackground: '',
        areas: []
      },
      fixtures: [], 
      props: [] 
    };
  }
};

/**
 * 장면 레이아웃을 저장하는 함수
 * @param {string} sceneId - 장면 ID
 * @param {Object} layout - 저장할 레이아웃 데이터
 */
export const saveSceneLayout = (sceneId, layout) => {
  try {
    const key = `scene_layout_${sceneId}`;
    localStorage.setItem(key, JSON.stringify(layout));
  } catch (error) {
    console.error('레이아웃 저장 실패:', error);
  }
};

/**
 * 장면 레이아웃을 불러오는 함수
 * @param {string} sceneId - 장면 ID
 * @returns {Object|null} 저장된 레이아웃 데이터
 */
export const loadSceneLayout = (sceneId) => {
  try {
    const key = `scene_layout_${sceneId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('레이아웃 불러오기 실패:', error);
    return null;
  }
};

// 헬퍼 함수들
const firstAppearances = new Map();

const updateFirstAppearance = (prop, sceneIndex) => {
  if (!firstAppearances.has(prop) || firstAppearances.get(prop) > sceneIndex) {
    firstAppearances.set(prop, sceneIndex);
  }
};

const getFirstAppearance = (prop) => {
  return firstAppearances.has(prop) ? firstAppearances.get(prop) : null;
};

const updateCharacterRelation = (prop, character) => {
  if (!characterRelations.has(prop)) {
    characterRelations.set(prop, new Set());
  }
  characterRelations.get(prop).add(character);
};

const extractFixturesFromText = (text) => {
  // 설비 추출 로직 (예: 문, 창문, 책상, 의자 등)
  const fixturePatterns = [
    /문|창문|책상|의자|테이블|선반|칠판|게시판|스크린|프로젝터/g
  ];
  
  const fixtures = new Set();
  fixturePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => fixtures.add(match));
    }
  });
  
  return fixtures;
};

const extractFromDirections = (text) => {
  const fixtures = new Set();
  const props = new Set();
  
  // 설비와 소품 패턴 매칭
  const fixtureMatches = text.match(/문|창문|책상|의자|테이블|선반|칠판|게시판|스크린|프로젝터/g);
  const propMatches = text.match(/책|노트|펜|가방|휴대폰|종이|지갑|열쇠|안경/g);
  
  if (fixtureMatches) fixtureMatches.forEach(match => fixtures.add(match));
  if (propMatches) propMatches.forEach(match => props.add(match));
  
  return { extractedFixtures: fixtures, extractedProps: props };
};

const extractPropsFromDialogue = (text) => {
  // 대사에서 소품 언급 추출 (예: "이 책을 보세요", "그 가방은 누구 거예요?")
  const propPatterns = [
    /책|노트|펜|가방|휴대폰|종이|지갑|열쇠|안경/g
  ];
  
  const props = new Set();
  propPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => props.add(match));
    }
  });
  
  return props;
};

const extractStateChanges = (text) => {
  // 상태 변화 추출 (예: "책을 내려놓는다", "가방을 연다")
  const changes = new Map();
  const stateChangePatterns = [
    { pattern: /([\w]+)을 ([\w]+)다/, type: 'action' },
    { pattern: /([\w]+)가 ([\w]+)다/, type: 'state' }
  ];
  
  stateChangePatterns.forEach(({ pattern, type }) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const [, prop, action] = match;
      changes.set(prop, `${action}다`);
    }
  });
  
  return changes;
};

/**
 * OpenAI 응답에서 JSON 부분만 추출하고 정제하는 함수
 * @param {string} response - OpenAI API 응답
 * @returns {string} 정제된 JSON 문자열
 */
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