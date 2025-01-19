import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { editorHighlightAtom, scriptAtom, analysisResultAtom } from '../../../store/atoms';
import { analyzeCharacterStats, analyzeCharacterMovements } from '../../../services/analysis/characterAnalyzer';
import CharacterList from './components/CharacterList';
import BarChart from './components/BarChart';
import MovementTimeline from './components/MovementTimeline';
import './styles/characters.css';

const CharacterAnalysis = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterStats, setCharacterStats] = useState([]);
  const [movementData, setMovementData] = useState(null);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [error, setError] = useState(null);
  const [, setEditorHighlight] = useAtom(editorHighlightAtom);
  const [script] = useAtom(scriptAtom);
  const [analysisResult] = useAtom(analysisResultAtom);

  useEffect(() => {
    if (!script) {
      setError('스크립트 데이터가 없습니다.');
      return;
    }

    try {
      // Rule-based analysis
      const stats = analyzeCharacterStats(script);
      setCharacterStats(stats);
      
      // Generate movement data
      const movements = analyzeCharacterMovements(script);
      setMovementData(movements);
      
      setError(null);
    } catch (err) {
      console.error('Character analysis failed:', err);
      setError('캐릭터 분석 중 오류가 발생했습니다.');
    }
  }, [script]);

  const handleCharacterSelect = (character) => {
    if (!character?.name) return;
    
    setSelectedCharacter(character.name);
    setSelectedMovement(null);
    
    // Highlight character's lines in editor
    if (character.lines && character.lines.length > 0) {
      setEditorHighlight({
        type: 'character',
        characterName: character.name,
        lines: character.lines
      });
    }
  };

  const handleMovementSelect = (movement) => {
    setSelectedMovement(movement);
    
    // Highlight the movement in the editor
    if (movement?.trigger?.content) {
      setEditorHighlight({
        type: 'movement',
        characters: movement.characters,
        content: movement.trigger.content,
        movementType: movement.type
      });
    }
  };

  // Calculate movement statistics for selected character
  const selectedCharacterMovements = selectedCharacter && movementData?.scenes
    ? movementData.scenes
        .flatMap(scene => scene.movements)
        .filter(movement => movement.characters.includes(selectedCharacter))
    : [];

  const movementStats = selectedCharacter ? {
    total: selectedCharacterMovements.length,
    entrances: selectedCharacterMovements.filter(m => m.type === 'entrance').length,
    exits: selectedCharacterMovements.filter(m => m.type === 'exit').length,
    explicit: selectedCharacterMovements.filter(m => m.trigger.type === 'explicit').length,
    implicit: selectedCharacterMovements.filter(m => m.trigger.type === 'implicit').length
  } : null;

  if (error) {
    return (
      <div className="character-analysis">
        <div className="character-analysis__error">{error}</div>
      </div>
    );
  }

  if (!script || !analysisResult) {
    return (
      <div className="character-analysis">
        <div className="character-analysis__loading">분석 준비 중...</div>
      </div>
    );
  }

  const dialogueData = characterStats.map(char => ({
    label: char.name,
    value: char.dialogues,
    color: char.name === selectedCharacter ? '#818cf8' : '#93c5fd'
  }));

  const stageTimeData = characterStats.map(char => ({
    label: char.name,
    value: char.stageTime,
    color: char.name === selectedCharacter ? '#818cf8' : '#93c5fd'
  }));

  return (
    <div className="character-analysis">
      <section className="character-analysis__section">
        <header className="character-analysis__header">
          <h2 className="character-analysis__title">등장인물</h2>
        </header>
        <div className="character-analysis__content">
          <CharacterList 
            characters={characterStats}
            selectedCharacter={selectedCharacter}
            onCharacterSelect={handleCharacterSelect}
            showIcon={true}
          />
        </div>
      </section>

      <section className="character-analysis__section">
        <header className="character-analysis__header">
          <h2 className="character-analysis__title">인물별 분량</h2>
        </header>
        <div className="character-analysis__content">
          <div className="subsection">
            <h3 className="subsection__title">대사량</h3>
            <BarChart 
              data={dialogueData}
              title="대사 수"
            />
          </div>
          <div className="subsection">
            <h3 className="subsection__title">무대 체류 시간</h3>
            <BarChart 
              data={stageTimeData}
              title="체류 시간 (분)"
            />
          </div>
        </div>
      </section>

      <section className="character-analysis__section">
        <header className="character-analysis__header">
          <h2 className="character-analysis__title">등퇴장 타임라인</h2>
          {selectedCharacter && movementStats && (
            <div className="movement-stats">
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">{selectedCharacter}</span>의 등퇴장:
                총 {movementStats.total}회 (등장 {movementStats.entrances}회, 퇴장 {movementStats.exits}회)
                <br />
                명시적 {movementStats.explicit}회, 암시적 {movementStats.implicit}회
              </div>
              {selectedMovement && (
                <div className="text-sm bg-gray-50 p-2 mt-2 rounded">
                  <div className="font-medium">
                    {selectedMovement.type === 'entrance' ? '등장' : '퇴장'} 상세
                  </div>
                  <div className="text-gray-600">
                    {selectedMovement.trigger.content}
                  </div>
                </div>
              )}
            </div>
          )}
        </header>
        <div className="character-analysis__content">
          <MovementTimeline
            movementData={movementData}
            selectedCharacter={selectedCharacter}
            onCharacterSelect={name => handleCharacterSelect({ name })}
            onMovementSelect={handleMovementSelect}
            selectedMovement={selectedMovement}
          />
        </div>
      </section>
    </div>
  );
};

export default CharacterAnalysis; 