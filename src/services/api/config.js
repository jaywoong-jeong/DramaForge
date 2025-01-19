export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o',
  temperature: 0.7,
  max_tokens: 16000,
  chunkSize: 16384,
  systemMessage: "You must respond with pure JSON only. No explanations, no markdown, no additional text. The response must be parseable by JSON.parse()."
};

export const ANALYSIS_PROMPTS = {
  sceneAnalysis: `[중요: 순수 JSON만 출력하세요. 다른 텍스트나 설명을 포함하지 마세요. JSON.parse()로 파싱 가능해야 합니다]

다음 연극 대본의 장면을 분석하여 아래 JSON 형식으로 출력해주세요:

{
  "metadata": {
    "type": "발단/전개/절정/결말 중 하나",
    "duration": "예상 소요 시간(분)",
    "location": "장면의 배경"
  },
  "summary": "장면 전체 요약 (100자 이내)",
  "themes": ["장면의 주요 테마들"],
  "symbols": ["상징적 요소들"],
  "connections": [
    {
      "targetSceneId": "연결된 장면 ID",
      "type": "인과관계/병렬관계/대조관계 중 하나",
      "description": "연결 관계 설명"
    }
  ]
}

대본:`,

  unitAnalysis: `[중요: 순수 JSON만 출력하세요. 다른 텍스트나 설명을 포함하지 마세요. JSON.parse()로 파싱 가능해야 합니다]

현재 장면을 핵심 unit으로 분석하여 JSON 형식으로 출력해주세요.
각 unit은 다음 기준들 중 하나 이상의 변화가 발생할 때 구분됩니다:
1. 등장인물의 등퇴장
2. 대화 주제의 큰 변화
3. 상황이나 감정의 중요한 전환점

{
  "units": [
    {
      "id": "unit1",
      "startLine": "unit이 시작되는 대사나 지시문의 라인 번호",
      "endLine": "unit이 끝나는 대사나 지시문의 라인 번호",
      "type": "entrance/exit/conversation/action/event",
      "characters": [
        {
          "name": "등장인물 이름",
          "action": "해당 unit에서의 주요 행동이나 역할",
          "emotion": "감정 상태"
        }
      ],
      "description": "unit의 간단한 설명",
      "significance": "setup/rising/climax/falling",
      "dialogueTopics": ["주요 대화 주제들의 배열"],
      "situationChange": "상황의 변화 설명",
      "mood": "unit의 분위기"
    }
  ]
}

대본:`,

  plotAnalysis: `[중요: 순수 JSON만 출력하세요. 다른 텍스트나 설명을 포함하지 마세요. JSON.parse()로 파싱 가능해야 합니다]

전체 연극 대본을 분석하여 다음 형식의 JSON으로 출력해주세요:

{
  "mainPlot": "핵심 플롯을 명사형으로 요약",
  "subPlots": [
    "부차적 플롯 1",
    "부차적 플롯 2"
  ],
  "themes": [
    "주요 테마 1",
    "주요 테마 2"
  ],
  "structure": {
    "exposition": "인물과 배경의 소개",
    "development": "갈등의 전개",
    "climax": "절정의 순간",
    "conclusion": "문제의 해결"
  }
}

대본:`,

  settingsAnalysis: `다음 연극 대본에서 소품과 무대 설비를 분석하여 아래 JSON 형식으로 출력해주세요:

{
  "stage": {
    "mainBackground": "주 무대 배경 설명",
    "areas": [
      {
        "name": "구역 이름",
        "description": "해당 구역의 특징과 용도"
      }
    ],
    "lighting": [
      {
        "type": "조명 종류",
        "purpose": "사용 목적",
        "timing": "사용 시점"
      }
    ]
  },
  "fixtures": [
    {
      "name": "설비 이름",
      "firstAppearance": "처음 등장하는 막과 장",
      "relatedCharacters": ["관련된 등장인물 이름들"],
      "stateChanges": [
        {
          "scene": "상태가 변하는 막과 장",
          "description": "상태 변화 설명"
        }
      ]
    }
  ],
  "props": [
    {
      "name": "소품 이름",
      "firstAppearance": "처음 등장하는 막과 장",
      "relatedCharacters": ["관련된 등장인물 이름들"],
      "stateChanges": [
        {
          "scene": "상태가 변하는 막과 장",
          "description": "상태 변화 설명"
        }
      ]
    }
  ]
}

대본:`,

  characterMovementAnalysis: `[중요: 순수 JSON만 출력하세요. 다른 텍스트나 설명을 포함하지 마세요. JSON.parse()로 파싱 가능해야 합니다]

다음 연극 대본의 등퇴장을 분석하여 아래 JSON 형식으로 출력해주세요:

{
  "scenes": [
    {
      "sceneId": "scene_number 값",
      "initialCharacters": ["장면 시작 시 무대 위에 있는 모든 등장인물"],
      "movements": [
        {
          "lineNumber": "해당 movement가 발생하는 대사나 지시문의 인덱스",
          "type": "entrance/exit/both",
          "characters": ["관련된 등장인물들"],
          "trigger": {
            "type": "explicit/implicit",
            "source": "direction/dialogue/context",
            "content": "트리거가 된 실제 텍스트"
          }
        }
      ],
      "finalCharacters": ["장면 종료 시 무대 위에 있는 모든 등장인물"]
    }
  ],
  "characterTimeline": [
    {
      "character": "캐릭터 이름",
      "presence": [
        {
          "sceneId": "등장한 장면 번호",
          "duration": {
            "start": "등장 시점의 lineNumber",
            "end": "퇴장 시점의 lineNumber"
          }
        }
      ]
    }
  ]
}

대본:`
};
