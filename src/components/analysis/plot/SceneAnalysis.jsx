import { useAtom } from 'jotai';
import { currentSceneAtom, analysisResultAtom } from '../../store/atoms';
import { useState } from 'react';

function parseAnalysis(analysisText) {
  try {
    let cleanText = analysisText.replace(/^###.*$/gm, '').trim();
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanText = cleanText.slice(jsonStart, jsonEnd + 1);
    }
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('분석 결과 파싱 실패:', error);
    return {
      metadata: {
        type: "알 수 없음",
        duration: "N/A",
        location: "알 수 없음"
      },
      summary: "분석 결과를 불러올 수 없습니다.",
      units: [],
      connections: [],
      themes: [],
      symbols: []
    };
  }
}

const MetadataCard = ({ metadata, summary }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <h4 className="font-bold mb-2">장면 정보</h4>
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <span className="text-gray-600 text-sm">유형:</span>
        <div className="font-medium">{metadata.type}</div>
      </div>
      <div>
        <span className="text-gray-600 text-sm">시간:</span>
        <div className="font-medium">{metadata.duration}분</div>
      </div>
      <div>
        <span className="text-gray-600 text-sm">장소:</span>
        <div className="font-medium">{metadata.location}</div>
      </div>
    </div>
    <div>
      <span className="text-gray-600 text-sm">요약:</span>
      <div className="font-medium mt-1">{summary}</div>
    </div>
  </div>
);

const UnitTimeline = ({ units }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <h4 className="font-bold mb-2">Unit 타임라인</h4>
    <div className="relative h-2 bg-gray-200 rounded mb-4">
      {units.map(unit => (
        <div
          key={unit.id}
          className={`absolute h-full rounded ${
            unit.significance === 'climax' ? 'bg-red-500' :
            unit.significance === 'rising' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
          style={{
            left: `${(unit.startLine / units[units.length - 1].endLine) * 100}%`,
            width: `${((unit.endLine - unit.startLine) / units[units.length - 1].endLine) * 100}%`
          }}
          title={unit.description}
        />
      ))}
    </div>
    <div className="space-y-2">
      {units.map(unit => (
        <div key={unit.id} className="border rounded p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium">{unit.description}</span>
              <div className="text-sm text-gray-500 mt-1">
                {unit.type} ({unit.startLine}-{unit.endLine})
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              unit.significance === 'climax' ? 'bg-red-100 text-red-800' :
              unit.significance === 'rising' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {unit.significance}
            </span>
          </div>
          
          <div className="mt-3">
            <div className="text-sm font-medium mb-1">등장인물:</div>
            <div className="flex flex-wrap gap-2">
              {unit.characters.map((char, idx) => (
                <div key={idx} className="bg-gray-100 rounded p-2 text-sm">
                  <div className="font-medium">{char.name}</div>
                  <div className="text-gray-600 text-xs mt-1">
                    {char.action} / {char.emotion}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {unit.dialogueTopics.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium mb-1">대화 주제:</div>
              <div className="flex flex-wrap gap-1">
                {unit.dialogueTopics.map((topic, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 text-sm">
            <div className="font-medium mb-1">상황 변화:</div>
            <div className="text-gray-600">{unit.situationChange}</div>
          </div>

          <div className="mt-2 text-sm">
            <div className="font-medium mb-1">분위기:</div>
            <div className="text-gray-600">{unit.mood}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ThemesAndSymbols = ({ themes, symbols }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="mb-4">
      <h4 className="font-bold mb-2">주요 테마</h4>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {theme}
          </span>
        ))}
      </div>
    </div>
    <div>
      <h4 className="font-bold mb-2">상징적 요소</h4>
      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol, idx) => (
          <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
            {symbol}
          </span>
        ))}
      </div>
    </div>
  </div>
);

function SceneAnalysis() {
  const [currentScene] = useAtom(currentSceneAtom);
  const [analysisResult] = useAtom(analysisResultAtom);
  const [view, setView] = useState('details');

  if (!analysisResult?.sceneAnalyses) return null;

  const sceneAnalysis = analysisResult.sceneAnalyses[currentScene];
  if (!sceneAnalysis) return null;

  const analysis = typeof sceneAnalysis.analysis === 'string' 
    ? parseAnalysis(sceneAnalysis.analysis) 
    : sceneAnalysis.analysis;

  return (
    <div className="scene-analysis p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">장면 {currentScene + 1} 분석</h3>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${view === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('details')}
          >
            상세 보기
          </button>
          <button
            className={`px-3 py-1 rounded ${view === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('timeline')}
          >
            타임라인
          </button>
        </div>
      </div>

      {view === 'details' ? (
        <>
          <MetadataCard metadata={analysis.metadata} summary={analysis.summary} />
          <ThemesAndSymbols themes={analysis.themes} symbols={analysis.symbols} />
        </>
      ) : (
        <UnitTimeline units={analysis.units} />
      )}
    </div>
  );
}

export default SceneAnalysis;
