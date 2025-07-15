import React from 'react';

const JsonHighlighter = ({ data, highlightKey }) => {
  if (!data) return null;

  const RecursiveComponent = ({ json, highlightKey, path = '' }) => {
    if (typeof json !== 'object' || json === null) {
      // For non-objects, just return the stringified value.
      return <span style={{ color: '#00F' }}>{JSON.stringify(json)}</span>;
    }

    return (
      <span>
        {Array.isArray(json) ? '[' : '{'}
        <div style={{ marginLeft: '20px' }}>
          {Object.entries(json).map(([key, value], index, arr) => {
            const currentPath = path ? `${path}.${key}` : key;
            // Check if the current path starts with the highlightKey
            const isHighlighted = highlightKey && currentPath.startsWith(highlightKey);

            return (
              <div key={key} style={{ backgroundColor: isHighlighted ? 'yellow' : 'transparent' }}>
                <span style={{ color: '#A31515' }}>"{key}"</span>
                <span>: </span>
                <RecursiveComponent json={value} highlightKey={highlightKey} path={currentPath} />
                {index < arr.length - 1 ? ',' : ''}
              </div>
            );
          })}
        </div>
        {Array.isArray(json) ? ']' : '}'}
      </span>
    );
  };

  return (
    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
      <RecursiveComponent json={data} highlightKey={highlightKey} />
    </pre>
  );
};

export default JsonHighlighter;
