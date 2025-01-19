import React from 'react';

const BarChart = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bar-chart">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="bars-container">
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div className="bar-label">{item.label}</div>
            <div className="bar-wrapper">
              <div 
                className="bar"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#4CAF50'
                }}
              >
                <span className="bar-value">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart; 