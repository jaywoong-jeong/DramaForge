import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ViewerContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const FileViewer = ({ content, language, highlightLines = [] }) => {
  const lineProps = useCallback(lineNumber => {
    const style = { display: 'block' };
    if (highlightLines.includes(lineNumber)) {
      style.backgroundColor = '#dffbe2';
    }
    return { style };
  }, [highlightLines]);

  if (!content) {
    return <ViewerContainer><div style={{ padding: '1rem', color: '#666' }}>No content available.</div></ViewerContainer>;
  }

  return (
    <ViewerContainer>
      <SyntaxHighlighter
        language={language}
        style={coy}
        showLineNumbers={true}
        wrapLines={false}
        customStyle={{ fontSize: '0.9rem' }}
        lineProps={lineProps}
      >
        {content}
      </SyntaxHighlighter>
    </ViewerContainer>
  );
};

export default FileViewer;