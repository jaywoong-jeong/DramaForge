import OpenAI from 'openai';
import { OPENAI_CONFIG } from './config';

let openaiInstance = null;

export function initializeOpenAI(apiKey) {
  try {
    if (!apiKey) {
      throw new Error('API 키가 제공되지 않았습니다.');
    }
    
    openaiInstance = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // 브라우저에서 실행을 위해 필요
    });
    
    return openaiInstance;
  } catch (error) {
    console.error('OpenAI 초기화 실패:', error);
    throw error;
  }
}

export function getOpenAIInstance() {
  if (!openaiInstance) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    }
    initializeOpenAI(apiKey);
  }
  return openaiInstance;
}

function splitTextIntoChunks(text, maxChunkSize) {
  const chunks = [];
  let currentChunk = '';
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      if (sentence.length > maxChunkSize) {
        // 문장이 너무 길 경우 강제로 분할
        const words = sentence.split(' ');
        for (const word of words) {
          if ((currentChunk + ' ' + word).length > maxChunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + word;
          }
        }
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

export async function analyzeWholeScene(sceneContent) {
  try {
    const openai = getOpenAIInstance();
    if (!openai) {
      throw new Error('OpenAI 인스턴스가 초기화되지 않았습니다.');
    }
    console.log("analyzeWholeScene 시작!");
    const contentStr = JSON.stringify(sceneContent);
    const chunks = splitTextIntoChunks(contentStr, OPENAI_CONFIG.chunkSize);
    let combinedAnalysis = '';

    for (let i = 0; i < chunks.length; i++) {
      const chunkPrompt = i === 0 ? "다음 연극 대본을 분석하여 아래 JSON 형식으로 출력해주세요." : '이전 분석을 이어서 계속해주세요.';
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: '당신은 연극 대본 분석 전문가입니다. 대본의 내용을 깊이 있게 분석하여 구조적으로 설명해주세요.'
          },
          {
            role: 'user',
            content: `${chunkPrompt}\n\n${chunks[i]}`
          }
        ],
        temperature: OPENAI_CONFIG.temperature,
        max_tokens: OPENAI_CONFIG.max_tokens,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: "analyzeWholeScene",
            schema: {
              type: "object",
              properties: {
                mainPlot: { type: "string", description: "핵심 플롯을 명사형으로 요약" },
                subPlots: { type: "array", items: { type: "string" }, description: "부차적 플롯 배열" },
                themes: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "주요 테마 배열"
                },
                structure: { 
                  type: "object",
                  description: "연극의 구조",
                  properties: {
                    exposition: { type: "string", description: "인물과 배경의 소개" },
                    development: { type: "string", description: "갈등의 전개" },
                    climax: { type: "string", description: "절정의 순간" },
                    conclusion: { type: "string", description: "문제의 해결" }
                  } 
                }
              }
            }
          }
        }
      });

      combinedAnalysis += (i > 0 ? '\n' : '') + response.choices[0].message.content;
    }
    console.log("analyzeWholeScene 성공!");
    return combinedAnalysis;
  } catch (error) {
    console.error('OpenAI API 호출 실패:', error);
    throw error;
  }
}

export async function analyzeScene(sceneContent) {
  try {
    const openai = getOpenAIInstance();
    if (!openai) {
      throw new Error('OpenAI 인스턴스가 초기화되지 않았습니다.');
    }
    console.log("analyzeScene 시작!");
    const contentStr = JSON.stringify(sceneContent);
    const chunks = splitTextIntoChunks(contentStr, OPENAI_CONFIG.chunkSize);
    let combinedAnalysis = '';

    for (let i = 0; i < chunks.length; i++) {
      const chunkPrompt = i === 0 ? "다음 연극 대본의 장면을 분석하여 아래 JSON 형식으로 출력해주세요." : '이전 분석을 이어서 계속해주세요.';
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: '당신은 연극 대본 분석 전문가입니다. 대본의 내용을 깊이 있게 분석하여 구조적으로 설명해주세요.'
          },
          {
            role: 'user',
            content: `${chunkPrompt}\n\n${chunks[i]}`
          }
        ],
        temperature: OPENAI_CONFIG.temperature,
        max_tokens: OPENAI_CONFIG.max_tokens,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: "analyzeScene",
            schema: {
              type: "object",
              properties: {
                metadata: {
                  type: "object",
                  properties: {
                    type: { type: "string", description: "발단/전개/절정/결말 중 하나" },
                    duration: { type: "string", description: "예상 소요 시간(분)" },
                    location: { type: "string", description: "장면의 배경" }
                  }
                },
                summary: { type: "string", description: "장면 전체 요약 (100자 이내)" },
                themes: { type: "array", items: { type: "string" }, description: "장면의 주요 테마들" },
                symbols: { type: "array", items: { type: "string" }, description: "장면의 상징적 요소들" },
                connections: { type: "array", items: { type: "object" }, description: "장면의 연결 관계들",
                  properties: {
                    targetSceneId: { type: "string", description: "연결된 장면 ID" },
                    type: { type: "string", description: "인과관계/병렬관계/대조관계 중 하나" },
                    description: { type: "string", description: "연결 관계 설명" }
                  }
                }
              }
            }
          }
        }
      });

      combinedAnalysis += (i > 0 ? '\n' : '') + response.choices[0].message.content;
    }
    console.log("analyzeScene 성공!");
    return combinedAnalysis;
  } catch (error) {
    console.error('OpenAI API 호출 실패:', error);
    throw error;
  }
}

export async function analyzeUnit(sceneContent) {
  try {
    const openai = getOpenAIInstance();
    if (!openai) {
      throw new Error('OpenAI 인스턴스가 초기화되지 않았습니다.');
    }
    console.log("analyzeUnit 시작!");
    const contentStr = JSON.stringify(sceneContent);
    const chunks = splitTextIntoChunks(contentStr, OPENAI_CONFIG.chunkSize);
    let combinedAnalysis = '';

    for (let i = 0; i < chunks.length; i++) {
      const chunkPrompt = i === 0 ? "다음 연극 대본의 장면을 분석하여 아래 JSON 형식으로 출력해주세요." : '이전 분석을 이어서 계속해주세요.';
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: `당신은 연극 대본 분석 전문가입니다. 현재 장면을 핵심 unit으로 분석하여 JSON 형식으로 출력해주세요.
            각 unit은 다음 기준들 중 하나 이상의 변화가 발생할 때 구분됩니다:
              1. 등장인물의 등퇴장
              2. 대화 주제의 큰 변화
              3. 상황이나 감정의 중요한 전환점`
          },
          {
            role: 'user',
            content: `${chunkPrompt}\n\n${chunks[i]}`
          }
        ],
        temperature: OPENAI_CONFIG.temperature,
        max_tokens: OPENAI_CONFIG.max_tokens,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: "analyzeUnit",
            schema: {
              type: "object",
              properties: {
                units: { type: "array", items: { type: "object" }, description: "unit 배열",
                  properties: {
                    id: { type: "string", description: "unit의 고유 ID" },
                    startLine: { type: "string", description: "unit이 시작되는 대사나 지시문의 라인 번호" },
                    endLine: { type: "string", description: "unit이 끝나는 대사나 지시문의 라인 번호" },
                    type: { type: "string", description: "entrance,exit,conversation,action,event 중 하나" },
                    characters: { type: "array", items: { type: "object" }, description: "등장인물 배열" },
                    description: { type: "string", description: "unit의 간단한 설명" },
                    significance: { type: "string", description: "setup/rising/climax/falling 중 하나" },
                    dialogueTopics: { type: "array", items: { type: "string" }, description: "주요 대화 주제들의 배열" },
                    situationChange: { type: "string", description: "상황의 변화 설명" },
                    mood: { type: "string", description: "unit의 분위기" }
                  }
              }
            }
          }
        }
      }
      });

      combinedAnalysis += (i > 0 ? '\n' : '') + response.choices[0].message.content;
    }
    console.log("analyzeUnit 성공!");
    return combinedAnalysis;
  } catch (error) {
    console.error('OpenAI API 호출 실패:', error);
    throw error;
  }
}

export async function analyzeText(prompt, content = '') {
  try {
    const openai = getOpenAIInstance();
    if (!openai) {
      throw new Error('OpenAI 인스턴스가 초기화되지 않았습니다.');
    }

    const chunks = splitTextIntoChunks(content, OPENAI_CONFIG.chunkSize);
    let combinedAnalysis = '';

    // 첫 번째 청크에서 전체 구조 분석
    const initialResponse = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: '당신은 텍스트 분석 전문가입니다. 주어진 내용을 깊이 있게 분석하여 구조적으로 설명해주세요.'
        },
        {
          role: 'user',
          content: `${prompt}\n\n${chunks[0]}`
        }
      ],
      temperature: OPENAI_CONFIG.temperature,
      max_tokens: Math.min(32000, OPENAI_CONFIG.max_tokens)
    });

    combinedAnalysis = initialResponse.choices[0].message.content;

    // 나머지 청크들에 대해 증분 분석 수행
    if (chunks.length > 1) {
      const parsedInitial = JSON.parse(combinedAnalysis);
      
      for (let i = 1; i < chunks.length; i++) {
        const incrementalPrompt = `이전 분석 결과를 기반으로 추가 내용을 분석하여 기존 결과를 보강해주세요. 
기존 분석 결과:
${JSON.stringify(parsedInitial, null, 2)}

추가 내용:
${chunks[i]}`;

        const response = await openai.chat.completions.create({
          model: OPENAI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: '당신은 텍스트 분석 전문가입니다. 기존 분석 결과를 보강하여 업데이트해주세요.'
            },
            {
              role: 'user',
              content: incrementalPrompt
            }
          ],
          temperature: OPENAI_CONFIG.temperature,
          max_tokens: Math.min(32000, OPENAI_CONFIG.max_tokens)
        });

        const incrementalResult = JSON.parse(response.choices[0].message.content);
        
        // 기존 결과와 병합
        if (incrementalResult.fixtures) {
          parsedInitial.fixtures = [...parsedInitial.fixtures, ...incrementalResult.fixtures];
        }
        if (incrementalResult.props) {
          parsedInitial.props = [...parsedInitial.props, ...incrementalResult.props];
        }
        // stage 정보 업데이트 (필요한 경우)
        if (incrementalResult.stage?.areas) {
          parsedInitial.stage.areas = [...parsedInitial.stage.areas, ...incrementalResult.stage.areas];
        }
      }

      combinedAnalysis = JSON.stringify(parsedInitial);
    }

    return combinedAnalysis;
  } catch (error) {
    console.error('OpenAI API 호출 실패:', error);
    throw error;
  }
}

export const analyzeScript = async (script) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script }),
    });

    if (!response.ok) {
      throw new Error('Analysis request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};
