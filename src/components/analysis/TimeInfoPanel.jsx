import React from 'react';

export function TimeInfoPanel({ totalTime, currentSceneTime }) {
  return (
    <div className="time-info-panel">
      <div className="time-info-item">
        <span className="time-label">전체 시간</span>
        <span className="time-value">{totalTime || '계산 중...'}</span>
      </div>
      <div className="time-info-divider" />
      <div className="time-info-item">
        <span className="time-label">현재 장면</span>
        <span className="time-value">{currentSceneTime || '계산 중...'}</span>
      </div>
    </div>
  );
} 