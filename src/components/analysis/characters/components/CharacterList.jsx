import React from 'react';

const CharacterList = ({ characters, selectedCharacter, onCharacterSelect }) => {
  if (!characters || characters.length === 0) return null;

  return (
    <div className="character-list">
      {characters.map((character, index) => (
        <div
          key={index}
          className={`character-list__item ${selectedCharacter === character.name ? 'character-list__item--selected' : ''}`}
          onClick={() => onCharacterSelect?.(character)}
        >
          <div className="character-list__icon">
            {character.name[0]}
          </div>
          <span className="character-list__name">{character.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CharacterList; 