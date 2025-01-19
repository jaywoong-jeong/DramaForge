import React, { useEffect, useRef } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './styles.css';

const DhtmlxGantt = ({ data, selectedCharacter }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Configure gantt
    gantt.config.date_format = "%H:%i";
    gantt.config.scale_unit = "minute";
    gantt.config.step = 10;
    gantt.config.date_scale = "%H:%i";
    gantt.config.subscales = [];
    gantt.config.min_column_width = 50;
    gantt.config.row_height = 30;
    gantt.config.readonly = true;

    // Convert data to Gantt format
    const tasks = {
      data: data.flatMap((char, charIndex) =>
        char.scenes.map((scene, sceneIndex) => ({
          id: `${charIndex}-${sceneIndex}`,
          text: char.name,
          start_date: new Date(2024, 0, 1, 0, scene.start),
          end_date: new Date(2024, 0, 1, 0, scene.end),
          parent: charIndex.toString(),
          progress: 1,
          open: true,
          className: char.name === selectedCharacter ? 'gantt-task--selected' : ''
        }))
      ),
      links: []
    };

    // Initialize gantt
    gantt.init(containerRef.current);
    gantt.clearAll();
    gantt.parse(tasks);

    return () => {
      gantt.clearAll();
    };
  }, [data, selectedCharacter]);

  if (!data) {
    return <div className="dhtmlx-gantt dhtmlx-gantt--empty">데이터가 없습니다.</div>;
  }

  return <div ref={containerRef} className="dhtmlx-gantt" />;
};

export default DhtmlxGantt; 