import React, { useState } from 'react';
import '../../../styles/components/analysis/settings.css';

const StageLayout = ({ fixtures, props, layout = {}, onLayoutChange }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const rect = e.currentTarget.getBoundingClientRect();
      
      // Calculate grid position (0-2 for both x and y)
      const gridX = Math.floor((e.clientX - rect.left) / (rect.width / 3));
      const gridY = Math.floor((e.clientY - rect.top) / (rect.height / 3));
      
      // Convert to percentage for center of the grid cell
      const x = (gridX * 33.33) + 16.665;
      const y = (gridY * 33.33) + 16.665;

      const newLayout = {
        ...layout,
        [data.name]: { 
          x, 
          y, 
          type: data.type,
          gridX,
          gridY
        }
      };

      onLayoutChange(newLayout);
    } catch (error) {
      console.error('Drop failed:', error);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    e.currentTarget.classList.remove('dragging');
  };

  const renderItem = (name, position, type) => {
    const isFixture = type === 'fixtures';
    const item = isFixture 
      ? fixtures.find(f => f.name === name)
      : props.find(p => p.name === name);

    if (!item) return null;

    return (
      <div
        key={name}
        className={`placed-item ${type}`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`
        }}
        draggable
        onDragStart={(e) => handleDragStart(e, { ...item, type })}
        onDragEnd={handleDragEnd}
      >
        <span className="placed-item-name">{name}</span>
      </div>
    );
  };

  return (
    <div className="stage-container">
      <div className="stage-header">
        <h3>무대 레이아웃</h3>
      </div>
      <div className="stage-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Stage grid */}
        <div className="stage-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="grid-cell" />
          ))}
        </div>

        {/* Stage markers */}
        <div className="stage-marker marker-top">상수</div>
        <div className="stage-marker marker-bottom">하수</div>
        <div className="stage-marker marker-left">좌측</div>
        <div className="stage-marker marker-right">우측</div>

        {/* Placed items */}
        {Object.entries(layout).map(([name, position]) => 
          renderItem(name, position, position.type)
        )}
      </div>
    </div>
  );
};

export default StageLayout; 