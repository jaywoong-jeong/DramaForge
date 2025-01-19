import { analyzeScene } from '../api/openai';
import { ANALYSIS_PROMPTS } from '../api/config';

function formatSceneContent(scene) {
  // 장면의 모든 내용을 순서대로 하나의 텍스트로 변환
  const content = [];
  let lineNumber = 1; // scene 내에서의 라인 번호
  const lineMap = new Map();

  // 초반 지시문
  if (scene.content.directions?.length) {
    content.push("# 초반 지시문");
    scene.content.directions.forEach(dir => {
      const line = `(${dir.content || dir.type})`;
      lineMap.set(lineNumber, { type: 'direction', content: line });
      content.push(`${lineNumber}. ${line}`);
      lineNumber++;
    });
  }

  // 대사
  if (scene.content.dialogues?.length) {
    content.push("\n# 대사");
    scene.content.dialogues.forEach(dialogue => {
      if (dialogue.pre_directions) {
        dialogue.pre_directions.forEach(dir => {
          const line = `(${dir.content})`;
          lineMap.set(lineNumber, { type: 'direction', content: line });
          content.push(`${lineNumber}. ${line}`);
          lineNumber++;
        });
      }
      const characterLine = `${dialogue.character}:`;
      lineMap.set(lineNumber, { type: 'character', content: characterLine });
      content.push(`${lineNumber}. ${characterLine}`);
      lineNumber++;
      
      dialogue.lines?.forEach(line => {
        lineMap.set(lineNumber, { type: 'dialogue', content: line });
        content.push(`${lineNumber}. ${line}`);
        lineNumber++;
      });
    });
  }

  // 후반 지시문과 대사
  if (scene.content.directions_post?.length) {
    content.push("\n# 후반 지시문");
    scene.content.directions_post.forEach(dir => {
      const line = `(${dir.content || dir.type})`;
      lineMap.set(lineNumber, { type: 'direction', content: line });
      content.push(`${lineNumber}. ${line}`);
      lineNumber++;
    });
  }

  if (scene.content.dialogues_post?.length) {
    content.push("\n# 후반 대사");
    scene.content.dialogues_post.forEach(dialogue => {
      if (dialogue.pre_directions) {
        dialogue.pre_directions.forEach(dir => {
          const line = `(${dir.content})`;
          lineMap.set(lineNumber, { type: 'direction', content: line });
          content.push(`${lineNumber}. ${line}`);
          lineNumber++;
        });
      }
      const characterLine = `${dialogue.character}:`;
      lineMap.set(lineNumber, { type: 'character', content: characterLine });
      content.push(`${lineNumber}. ${characterLine}`);
      lineNumber++;
      
      dialogue.lines?.forEach(line => {
        lineMap.set(lineNumber, { type: 'dialogue', content: line });
        content.push(`${lineNumber}. ${line}`);
        lineNumber++;
      });
    });
  }

  // 최종 지시문과 대사도 동일한 방식으로 처리
  if (scene.content.directions_final?.length) {
    content.push("\n# 최종 지시문");
    scene.content.directions_final.forEach(dir => {
      const line = `(${dir.content || dir.type})`;
      lineMap.set(lineNumber, { type: 'direction', content: line });
      content.push(`${lineNumber}. ${line}`);
      lineNumber++;
    });
  }

  if (scene.content.dialogues_final?.length) {
    content.push("\n# 최종 대사");
    scene.content.dialogues_final.forEach(dialogue => {
      if (dialogue.pre_directions) {
        dialogue.pre_directions.forEach(dir => {
          const line = `(${dir.content})`;
          lineMap.set(lineNumber, { type: 'direction', content: line });
          content.push(`${lineNumber}. ${line}`);
          lineNumber++;
        });
      }
      const characterLine = `${dialogue.character}:`;
      lineMap.set(lineNumber, { type: 'character', content: characterLine });
      content.push(`${lineNumber}. ${characterLine}`);
      lineNumber++;
      
      dialogue.lines?.forEach(line => {
        lineMap.set(lineNumber, { type: 'dialogue', content: line });
        content.push(`${lineNumber}. ${line}`);
        lineNumber++;
      });
    });
  }

  // 마지막 지시문과 대사도 동일한 방식으로 처리
  if (scene.content.directions_end?.length) {
    content.push("\n# 마지막 지시문");
    scene.content.directions_end.forEach(dir => {
      const line = `(${dir.content || dir.type})`;
      lineMap.set(lineNumber, { type: 'direction', content: line });
      content.push(`${lineNumber}. ${line}`);
      lineNumber++;
    });
  }

  if (scene.content.dialogues_end?.length) {
    content.push("\n# 마지막 대사");
    scene.content.dialogues_end.forEach(dialogue => {
      if (dialogue.pre_directions) {
        dialogue.pre_directions.forEach(dir => {
          const line = `(${dir.content})`;
          lineMap.set(lineNumber, { type: 'direction', content: line });
          content.push(`${lineNumber}. ${line}`);
          lineNumber++;
        });
      }
      const characterLine = `${dialogue.character}:`;
      lineMap.set(lineNumber, { type: 'character', content: characterLine });
      content.push(`${lineNumber}. ${characterLine}`);
      lineNumber++;
      
      dialogue.lines?.forEach(line => {
        lineMap.set(lineNumber, { type: 'dialogue', content: line });
        content.push(`${lineNumber}. ${line}`);
        lineNumber++;
      });
    });
  }

  return {
    text: content.join('\n'),
    lineMap,
    totalLines: lineNumber - 1
  };
}

export async function analyzeSceneDetails(scene) {
  try {
    // 장면 내용을 텍스트로 변환
    const { text, lineMap, totalLines } = formatSceneContent(scene);

    // 기본 장면 분석 수행
    const baseAnalysis = await analyzeScene(
      text,
      ANALYSIS_PROMPTS.sceneAnalysis
    );

    // Unit 분석 수행 (3-5개의 unit으로 분석)
    const unitAnalysis = await analyzeScene(
      text,
      `이 장면(Scene ${scene.scene_number})을 3-5개의 unit으로 분석해주세요.\n${ANALYSIS_PROMPTS.unitAnalysis}`
    );

    // 분석 결과 정리
    const parsedBase = JSON.parse(cleanJsonResponse(baseAnalysis));
    const parsedUnits = JSON.parse(cleanJsonResponse(unitAnalysis));

    // unit의 라인 번호가 scene의 전체 라인 수를 넘지 않도록 보정
    if (parsedUnits.units) {
      parsedUnits.units = parsedUnits.units.map(unit => ({
        ...unit,
        startLine: Math.min(parseInt(unit.startLine) || 1, totalLines),
        endLine: Math.min(parseInt(unit.endLine) || totalLines, totalLines)
      }));
    }

    return {
      sceneId: scene.id,
      analysis: {
        ...parsedBase,
        ...parsedUnits
      }
    };
  } catch (error) {
    console.error('장면 분석 실패:', error);
    throw error;
  }
}

function cleanJsonResponse(response) {
  let cleanText = response.replace(/^###.*$/gm, '').trim();
  cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  const jsonStart = cleanText.indexOf('{');
  const jsonEnd = cleanText.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleanText = cleanText.slice(jsonStart, jsonEnd + 1);
  }
  
  return cleanText;
}
