import React from 'react';

const CharacterGanttChart = ({ data, selectedCharacter }) => {
  return (
    <div className="relative h-64 w-full">
      <div className="absolute bottom-0 left-0 w-full h-8 flex">
        {[...Array(11)].map((_, i) => (
          <div key={i} className="flex-1 border-l border-gray-100 text-xs text-gray-400">
            {i * 10}
          </div>
        ))}
      </div>
      
      <div className="absolute top-0 left-0 w-full h-56">
        {data.map((char, charIdx) => (
          <div 
            key={char.name}
            className={`relative h-8 mb-2 ${
              selectedCharacter === char.name ? 'bg-indigo-50' : ''
            }`}
          >
            <div className="absolute left-0 top-0 w-20 h-full flex items-center">
              <span className="text-xs text-gray-600 truncate">{char.name}</span>
            </div>
            
            <div className="absolute left-20 right-0 h-full">
              {char.scenes.map((scene, sceneIdx) => (
                <div
                  key={sceneIdx}
                  className="absolute h-6 top-1 bg-indigo-400 opacity-75 rounded"
                  style={{
                    left: `${scene.start}%`,
                    width: `${scene.end - scene.start}%`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterGanttChart; 