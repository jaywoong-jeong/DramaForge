import React from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';

const ReactCalendarTimeline = ({ data, selectedCharacter }) => {
  if (!data || data.length === 0) return null;

  // Convert data to Timeline format
  const groups = data.map((char, index) => ({
    id: index,
    title: char.name,
    className: char.name === selectedCharacter ? 'selected-group' : ''
  }));

  const items = data.flatMap((char, charIndex) =>
    char.scenes.map((scene, sceneIndex) => ({
      id: `${charIndex}-${sceneIndex}`,
      group: charIndex,
      title: char.name,
      start_time: moment().hour(0).minute(scene.start),
      end_time: moment().hour(0).minute(scene.end),
      className: char.name === selectedCharacter ? 'selected-item' : ''
    }))
  );

  return (
    <div className="timeline-container">
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().hour(0).minute(0)}
        defaultTimeEnd={moment().hour(0).minute(100)}
        canMove={false}
        canResize={false}
        stackItems
        itemHeightRatio={0.8}
        lineHeight={40}
        sidebarWidth={150}
      />
    </div>
  );
};

export default ReactCalendarTimeline; 