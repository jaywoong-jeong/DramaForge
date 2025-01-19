import { v4 as uuidv4 } from 'uuid';

function generateId() {
  return uuidv4();
}

function determineCategory(prop) {
  const categories = {
    FURNITURE: ['의자', '탁자', '침대', '소파', '책상'],
    HAND_PROP: ['편지', '칼', '잔', '책', '펜'],
    DECOR: ['그림', '커튼', '촛대', '시계', '거울'],
    COSTUME: ['모자', '망토', '장갑', '신발'],
    SPECIAL: ['마법봉', '보석', '문서']
  };

  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => prop.name.includes(item))) {
      return category;
    }
  }
  return 'HAND_PROP';
}

export async function analyzeStageElements(scriptText) {
  console.log('analyzeStageElements called with:', scriptText);

  const prompt = `
  다음 대본에서:
  1. 지문에 직접 언급된 소품 목록
  2. 대사에서 추론되는 소품 목록
  3. 각 소품의 추천 크기(small/medium/large)
  4. 각 소품이 처음 등장하는 장면 번호
  
  를 JSON 형식으로 추출해주세요.
  응답은 다음과 같은 형식이어야 합니다:
  {
    "props": [
      {
        "name": "소품이름",
        "size": "small|medium|large",
        "firstScene": "장면번호",
        "source": "direction|dialogue"
      }
    ]
  }
  `;
  console.log('Using prompt:', prompt);

  try {
    console.log('Sending API request...');
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        scriptText,
        model: 'gpt-4'
      })
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      throw new Error('API 요청 실패');
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    const transformed = transformAnalysisResult(data);
    console.log('Transformed result:', transformed);
    
    return transformed;
  } catch (error) {
    console.error('Stage analysis failed:', {
      error,
      message: error.message,
      stack: error.stack
    });
    throw new Error('무대 분석 중 오류가 발생했습니다.');
  }
}

function transformAnalysisResult(rawResult) {
  return {
    props: rawResult.props.map(prop => ({
      id: generateId(),
      name: prop.name,
      size: prop.size,
      category: determineCategory(prop),
      firstScene: prop.firstScene,
      source: prop.source
    }))
  };
}
