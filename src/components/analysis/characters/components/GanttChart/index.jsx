import React, { useEffect, useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import './styles.css';

const GanttChart = ({ data, selectedCharacter }) => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Convert data to Timeline format
    const items = new DataSet(
      data.flatMap((char, charIndex) =>
        char.scenes.map((scene, sceneIndex) => ({
          id: `${charIndex}-${sceneIndex}`,
          group: charIndex,
          content: char.name,
          start: new Date(2024, 0, 1, 0, scene.start),
          end: new Date(2024, 0, 1, 0, scene.end),
          className: char.name === selectedCharacter ? 'timeline-item--selected' : 'timeline-item'
        }))
      )
    );

    const groups = new DataSet(
      data.map((char, index) => ({
        id: index,
        content: char.name,
        className: char.name === selectedCharacter ? 'timeline-group--selected' : 'timeline-group'
      }))
    );

    const options = {
      height: '160px',
      stack: true,
      showMajorLabels: true,
      showCurrentTime: false,
      zoomable: false,
      moveable: true,
      orientation: 'top',
      start: new Date(2024, 0, 1, 0, 0),
      end: new Date(2024, 0, 1, 0, 100),
      margin: {
        item: {
          horizontal: 0,
          vertical: 5
        }
      }
    };

    // Create a Timeline
    timelineRef.current = new Timeline(containerRef.current, items, groups, options);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
      }
    };
  }, [data, selectedCharacter]);

  if (!data) {
    return <div className="gantt-chart gantt-chart--empty">데이터가 없습니다.</div>;
  }

  return <div ref={containerRef} className="gantt-chart" />;
};

export default GanttChart; 