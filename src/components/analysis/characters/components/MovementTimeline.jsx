import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const MovementTimeline = ({ 
  movementData, 
  selectedCharacter, 
  onCharacterSelect,
  onMovementSelect,
  selectedMovement 
}) => {
  const [hoveredMovement, setHoveredMovement] = useState(null);

  const timelineData = useMemo(() => {
    if (!movementData?.scenes) return [];
    
    return movementData.scenes.map(scene => ({
      sceneId: scene.sceneId,
      movements: scene.movements,
      initialCharacters: scene.initialCharacters,
      finalCharacters: scene.finalCharacters
    }));
  }, [movementData]);

  // Calculate timeline dimensions
  const height = 40; // height per character
  const totalHeight = (movementData?.characterTimeline?.length || 0) * height;
  const width = 800;
  const padding = { top: 20, right: 20, bottom: 20, left: 100 };

  // Find the maximum scene number for scaling
  const maxScene = useMemo(() => {
    return Math.max(...timelineData.map(scene => parseInt(scene.sceneId))) || 4;
  }, [timelineData]);

  const getSceneX = (sceneId) => {
    return (parseInt(sceneId) - 1) * (width - padding.left - padding.right) / maxScene + padding.left;
  };

  // Tooltip component
  const Tooltip = ({ movement, x, y }) => {
    if (!movement) return null;

    return (
      <div
        className="movement-timeline__tooltip"
        style={{
          position: 'absolute',
          left: x + 10,
          top: y - 10,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 10,
          maxWidth: '200px'
        }}
      >
        <div className="font-medium">{movement.type === 'entrance' ? '등장' : '퇴장'}</div>
        <div className="text-sm text-gray-600">
          {movement.characters.join(', ')}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {movement.trigger.type === 'explicit' ? '명시적' : '암시적'} ({movement.trigger.source})
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {movement.trigger.content}
        </div>
      </div>
    );
  };

  return (
    <div className="movement-timeline">
      <svg width={width} height={totalHeight + padding.top + padding.bottom}>
        {/* Background grid */}
        {Array.from({ length: maxScene + 1 }).map((_, i) => (
          <line
            key={`grid-${i}`}
            x1={getSceneX(i + 1)}
            y1={padding.top}
            x2={getSceneX(i + 1)}
            y2={totalHeight + padding.top}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Scene labels */}
        {Array.from({ length: maxScene }).map((_, i) => (
          <text
            key={`label-${i + 1}`}
            x={getSceneX(i + 1)}
            y={padding.top - 5}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7280"
          >
            {`Scene ${i + 1}`}
          </text>
        ))}

        {/* Character presence and movements */}
        {movementData?.characterTimeline?.map((char, idx) => {
          const y = idx * height + padding.top;
          
          return (
            <g key={char.character}>
              {/* Character name */}
              <text
                x={padding.left - 10}
                y={y + height/2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill={selectedCharacter === char.character ? '#818cf8' : '#374151'}
                style={{ cursor: 'pointer' }}
                onClick={() => onCharacterSelect?.(char.character)}
              >
                {char.character}
              </text>

              {/* Presence bars */}
              {char.presence.map((presence, presenceIdx) => {
                const scene = timelineData.find(s => s.sceneId === presence.sceneId);
                if (!scene) return null;

                const movements = scene.movements.filter(m => 
                  m.characters.includes(char.character)
                );

                return (
                  <g key={`${char.character}-${presence.sceneId}-${presenceIdx}`}>
                    {/* Base presence bar */}
                    <rect
                      x={getSceneX(presence.sceneId)}
                      y={y + height * 0.2}
                      width={getSceneX(parseInt(presence.sceneId) + 1) - getSceneX(presence.sceneId)}
                      height={height * 0.6}
                      fill={selectedCharacter === char.character ? '#818cf8' : '#93c5fd'}
                      opacity={0.3}
                      rx={4}
                    />

                    {/* Movement markers */}
                    {movements.map((movement, moveIdx) => {
                      const moveX = getSceneX(presence.sceneId) + 
                        (parseInt(movement.lineNumber) / parseInt(presence.duration.end)) * 
                        (getSceneX(parseInt(presence.sceneId) + 1) - getSceneX(presence.sceneId));

                      const isSelected = selectedMovement && 
                        selectedMovement.lineNumber === movement.lineNumber &&
                        selectedMovement.characters.join(',') === movement.characters.join(',');

                      return (
                        <circle
                          key={`${char.character}-${presence.sceneId}-${moveIdx}`}
                          cx={moveX}
                          cy={y + height/2}
                          r={isSelected ? 6 : 4}
                          fill={movement.type === 'entrance' ? '#10b981' : '#ef4444'}
                          stroke={movement.trigger.type === 'explicit' ? 'white' : 'none'}
                          strokeWidth={isSelected ? 3 : 2}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            setHoveredMovement({
                              movement,
                              x: e.clientX,
                              y: e.clientY
                            });
                          }}
                          onMouseLeave={() => setHoveredMovement(null)}
                          onClick={() => onMovementSelect?.(movement)}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredMovement && (
        <Tooltip
          movement={hoveredMovement.movement}
          x={hoveredMovement.x}
          y={hoveredMovement.y}
        />
      )}

      {/* Legend */}
      <div className="movement-timeline__legend">
        <div className="flex items-center gap-4 text-sm mt-4">
          <div className="flex items-center gap-2">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="4" fill="#10b981" />
            </svg>
            <span>등장</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="4" fill="#ef4444" />
            </svg>
            <span>퇴장</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
            </svg>
            <span>명시적</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="4" fill="#10b981" />
            </svg>
            <span>암시적</span>
          </div>
        </div>
      </div>
    </div>
  );
};

MovementTimeline.propTypes = {
  movementData: PropTypes.shape({
    scenes: PropTypes.arrayOf(PropTypes.shape({
      sceneId: PropTypes.string.isRequired,
      movements: PropTypes.arrayOf(PropTypes.shape({
        lineNumber: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['entrance', 'exit']).isRequired,
        characters: PropTypes.arrayOf(PropTypes.string).isRequired,
        trigger: PropTypes.shape({
          type: PropTypes.oneOf(['explicit', 'implicit']).isRequired,
          source: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired
        }).isRequired
      })).isRequired,
      initialCharacters: PropTypes.arrayOf(PropTypes.string).isRequired,
      finalCharacters: PropTypes.arrayOf(PropTypes.string).isRequired
    })).isRequired,
    characterTimeline: PropTypes.arrayOf(PropTypes.shape({
      character: PropTypes.string.isRequired,
      presence: PropTypes.arrayOf(PropTypes.shape({
        sceneId: PropTypes.string.isRequired,
        duration: PropTypes.shape({
          start: PropTypes.string.isRequired,
          end: PropTypes.string.isRequired
        }).isRequired
      })).isRequired
    })).isRequired
  }),
  selectedCharacter: PropTypes.string,
  onCharacterSelect: PropTypes.func,
  onMovementSelect: PropTypes.func,
  selectedMovement: PropTypes.shape({
    lineNumber: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['entrance', 'exit']).isRequired,
    characters: PropTypes.arrayOf(PropTypes.string).isRequired,
    trigger: PropTypes.shape({
      type: PropTypes.oneOf(['explicit', 'implicit']).isRequired,
      source: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    }).isRequired
  })
};

export default MovementTimeline; 