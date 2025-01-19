import { getOpenAIInstance } from '../api/openai';

const BASE_CHAR_TIME = 0.2; // 글자당 0.2초
const COMMA_PAUSE = 0.3;
const PERIOD_PAUSE = 0.5;
const BASE_DIRECTION_TIME = 3;

// 장면 전환 복잡도 분석
async function analyzeTransitionComplexity(prevScene, nextScene) {
  try {
    const openai = getOpenAIInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a theater expert analyzing scene transitions. Rate the complexity of stage changes between scenes on a scale of 1-5, where 1 is minimal change and 5 is complete stage transformation."
        },
        {
          role: "user",
          content: `Previous scene setting: ${prevScene?.stage || 'None'}\nNext scene setting: ${nextScene?.stage || 'None'}\nAnalyze the complexity of this scene transition.`
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    });

    const complexity = parseInt(response.choices[0].message.content) || 3;
    return complexity * 5; // 복잡도 * 5초
  } catch (error) {
    console.error('Scene transition analysis failed:', error);
    return 15; // 기본 15초
  }
}

// 지문 복잡도 분석
async function analyzeDirectionComplexity(direction) {
  try {
    const openai = getOpenAIInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are analyzing theatrical stage directions. Rate the complexity and time needed for this action on a scale of 1-5, where 1 is quick and simple, 5 is complex and time-consuming."
        },
        {
          role: "user",
          content: `Stage direction: ${direction}\nAnalyze the time needed for this action.`
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    });

    const complexity = parseInt(response.choices[0].message.content) || 2;
    return BASE_DIRECTION_TIME * complexity;
  } catch (error) {
    console.error('Direction analysis failed:', error);
    return BASE_DIRECTION_TIME;
  }
}

// 대사 시간 계산
function calculateDialogueTime(dialogue) {
  let time = 0;
  
  // 대사 텍스트의 글자 수
  time += (dialogue.length * BASE_CHAR_TIME);
  
  // 문장 부호에 따른 추가 시간
  time += (dialogue.match(/,/g)?.length || 0) * COMMA_PAUSE;
  time += (dialogue.match(/[.!?]/g)?.length || 0) * PERIOD_PAUSE;
  
  return time;
}

// 장면 시간 계산
async function calculateSceneTime(scene) {
  let totalTime = 0;

  // 대사 시간 계산
  for (const dialogue of scene.dialogues || []) {
    for (const line of dialogue.lines || []) {
      totalTime += calculateDialogueTime(line);
    }
    
    // 대사 전 지문 분석
    for (const direction of dialogue.pre_directions || []) {
      totalTime += await analyzeDirectionComplexity(direction.content);
    }
  }

  // 장면 지문 분석
  for (const direction of scene.directions || []) {
    totalTime += await analyzeDirectionComplexity(direction.content);
  }

  return Math.round(totalTime);
}

// 전체 대본 시간 계산
async function calculateTotalTime(script) {
  let totalTime = 0;
  
  for (let i = 0; i < script.scenes.length; i++) {
    // 장면 시간
    totalTime += await calculateSceneTime(script.scenes[i]);
    
    // 장면 전환 시간 (마지막 장면 제외)
    if (i < script.scenes.length - 1) {
      totalTime += await analyzeTransitionComplexity(
        script.scenes[i],
        script.scenes[i + 1]
      );
    }
  }
  
  return totalTime;
}

// 시간을 분:초 형식으로 변환
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}분 ${remainingSeconds}초 예측`;
}

export {
  calculateTotalTime,
  calculateSceneTime,
  formatTime
}; 