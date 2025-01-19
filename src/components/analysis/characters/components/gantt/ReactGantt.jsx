import React from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

const ReactGantt = ({ data, selectedCharacter }) => {
  if (!data || data.length === 0) return null;

  // Convert data to Gantt format
  const tasks = data.flatMap((char, charIndex) => [
    {
      start: new Date(2024, 0, 1, 0, 0),
      end: new Date(2024, 0, 1, 1, 40),
      name: char.name,
      id: `project-${charIndex}`,
      progress: 100,
      type: 'project',
      hideChildren: false,
      displayOrder: charIndex * 2
    },
    ...char.scenes.map((scene, sceneIndex) => ({
      start: new Date(2024, 0, 1, 0, scene.start),
      end: new Date(2024, 0, 1, 0, scene.end),
      name: `장면 ${sceneIndex + 1}`,
      id: `${charIndex}-${sceneIndex}`,
      progress: 100,
      type: 'task',
      project: `project-${charIndex}`,
      displayOrder: charIndex * 2 + 1,
      styles: {
        backgroundColor: char.name === selectedCharacter ? '#818cf8' : '#93c5fd',
        progressColor: char.name === selectedCharacter ? '#4f46e5' : '#60a5fa',
        backgroundSelectedColor: '#818cf8',
        progressSelectedColor: '#4f46e5'
      }
    }))
  ]);

  return (
    <div className="gantt-container">
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Hour}
        listCellWidth=""
        columnWidth={50}
        ganttHeight={400}
        barFill={70}
        handleWidth={0}
        barCornerRadius={4}
        readonly
      />
    </div>
  );
};

export default ReactGantt; 