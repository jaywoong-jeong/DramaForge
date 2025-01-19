import React from 'react';
import ReactCalendarTimeline from './ReactCalendarTimeline';
import DhtmlxGantt from './DhtmlxGantt';
import ReactGantt from './ReactGantt';
import './styles.css';

const GanttCharts = ({ data, selectedCharacter }) => {
  if (!data) {
    return <div className="gantt-charts gantt-charts--empty">데이터가 없습니다.</div>;
  }

  return (
    <div className="gantt-charts">
      <div className="gantt-chart-section">
        <h3 className="gantt-chart-title">React Calendar Timeline</h3>
        <div className="gantt-chart-description">월/시간 표시 가능한 타임라인</div>
        <ReactCalendarTimeline data={data} selectedCharacter={selectedCharacter} />
      </div>

      <div className="gantt-chart-section">
        <h3 className="gantt-chart-title">DHTMLX Gantt</h3>
        <div className="gantt-chart-description">전문적인 간트 차트 기능</div>
        <DhtmlxGantt data={data} selectedCharacter={selectedCharacter} />
      </div>

      <div className="gantt-chart-section">
        <h3 className="gantt-chart-title">React Gantt</h3>
        <div className="gantt-chart-description">React에 최적화된 간트 차트</div>
        <ReactGantt data={data} selectedCharacter={selectedCharacter} />
      </div>
    </div>
  );
};

export default GanttCharts; 