import React from 'react';
import { useAtom } from 'jotai';
import { selectedPropsTypeAtom } from '../../../store/atoms';
import '../../../styles/components/analysis/settings.css';

const PropsList = ({ fixtures, props }) => {
  const [selectedType, setSelectedType] = useAtom(selectedPropsTypeAtom);

  const renderItem = (item, type) => (
    <div
      key={item.name}
      className={`prop-item ${type}`}
      draggable
      onDragStart={(e) => {
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.setData('text/plain', JSON.stringify({
          ...item,
          type
        }));
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('dragging');
      }}
    >
      <div className="prop-header">
        <span className="prop-name">{item.name}</span>
        <span className={`prop-type ${type}`}>
          {type === 'fixtures' ? '설비' : '소품'}
        </span>
      </div>
      
      {item.firstAppearance && (
        <div className="prop-info">
          첫 등장: {item.firstAppearance}
        </div>
      )}
      
      {item.relatedCharacters?.length > 0 && (
        <div className="prop-characters">
          {item.relatedCharacters.map(char => (
            <span key={char} className="character-tag">
              {char}
            </span>
          ))}
        </div>
      )}
      
      {item.stateChanges?.length > 0 && (
        <div className="prop-info">
          <div className="font-medium">상태 변화:</div>
          {item.stateChanges.map((change, index) => (
            <div key={index} className="prop-info">
              <span className="font-medium">{change.scene}:</span>{' '}
              {change.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="props-container">
      <div className="props-header">
        <h3 className="props-title">소품 & 설비 목록</h3>
        <div className="filter-buttons">
          <button
            className={`filter-button ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            전체
          </button>
          <button
            className={`filter-button ${selectedType === 'fixtures' ? 'active' : ''}`}
            onClick={() => setSelectedType('fixtures')}
          >
            설비
          </button>
          <button
            className={`filter-button ${selectedType === 'props' ? 'active' : ''}`}
            onClick={() => setSelectedType('props')}
          >
            소품
          </button>
        </div>
      </div>

      <div className="props-grid">
        {(selectedType === 'all' || selectedType === 'fixtures') &&
          fixtures.map(fixture => renderItem(fixture, 'fixtures'))}
        
        {(selectedType === 'all' || selectedType === 'props') &&
          props.map(prop => renderItem(prop, 'props'))}
      </div>
    </div>
  );
};

export default PropsList; 