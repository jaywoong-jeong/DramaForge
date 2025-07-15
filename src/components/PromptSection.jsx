import React from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SectionContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const PromptPanel = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  border-right: 1px solid #dee2e6;

  &:last-child {
    border-right: none;
  }
`;

const PromptSectionContainer = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #f8f9fa;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
`;

const TransformationSection = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #f8f9fa;
  overflow-y: auto;
  color: #495057;
`;

const PromptTitle = styled.h3`
  margin-top: 0;
  color: #343a40;
  margin-bottom: 1rem; /* Add space below the title */
`;

const PromptText = styled.p`
  white-space: pre-wrap; /* Ensures newlines are respected */
  font-size: 0.9rem;
  line-height: 1.6;
  color: #495057;
`;

const HighlighterContainer = styled.div`
  background-color: #ffffff; /* White box for the text */
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  overflow: hidden; /* Ensures child's corners are rounded */
`;

const PromptSection = ({ inputPrompt, transformationProcess }) => (
  <SectionContainer>
    <PromptSectionContainer>
      <PromptTitle>Input Prompt</PromptTitle>
      <HighlighterContainer>
        <SyntaxHighlighter
          language="markdown"
          style={coy}
          customStyle={{ fontSize: '0.9rem' }}
        >
          {inputPrompt}
        </SyntaxHighlighter>
      </HighlighterContainer>
    </PromptSectionContainer>
    <TransformationSection>
      <PromptTitle>Transformation Process</PromptTitle>
      <PromptText>{transformationProcess}</PromptText>
    </TransformationSection>
  </SectionContainer>
);

export default PromptSection;
