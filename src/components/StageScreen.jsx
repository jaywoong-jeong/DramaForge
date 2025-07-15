import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FileViewer from './FileViewer';
import PromptSection from './PromptSection';
import Navigation from './Navigation';

// Import data files
import proposalTxt from '../data/proposal.txt';
import hierarchicalScript from '../data/2_hierarchical_script.json';
import segmentedUnits from '../data/3_segmented_units.json';
import finalAnalyzedScript from '../data/4_final_analyzed_script.json';
import finalScriptWithPlot from '../data/5_final_script_with_plot.json';
import prompts from '../data/prompt.json';

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; /* Fill the parent container's height */
  width: 100%;
  background-color: #f8f9fa;
`;

const StageTitle = styled.h2`
  text-align: center;
  padding: 1rem;
  margin: 0;
  background-color: #e9ecef;
  border-bottom: 2px solid #dee2e6;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden; /* This is key to contain the children */
`;

const FileViewersContainer = styled.div`
  display: flex;
  flex: 3;
  overflow: hidden;
  min-height: 0; /* Prevents this container from growing beyond its flex-basis */
`;

const BottomSection = styled.div`
  flex: 2;
  display: flex;
  min-height: 0; /* Prevents this container from growing beyond its flex-basis */
  border-top: 1px solid #e0e0e0;
  overflow-y: auto;
`;

const Panel = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;

  &:last-child {
    border-right: none;
  }

  h3 {
    margin-bottom: 1rem;
    color: #495057;
  }
`;

const stageFiles = {
  1: { before: proposalTxt, after: hierarchicalScript, lang: { before: 'text', after: 'json' } },
  2: { before: hierarchicalScript, after: segmentedUnits, lang: { before: 'json', after: 'json' } },
  3: { before: segmentedUnits, after: finalAnalyzedScript, lang: { before: 'json', after: 'json' } },
  4: { before: finalAnalyzedScript, after: finalScriptWithPlot, lang: { before: 'json', after: 'json' } },
};

// Hardcoded highlight lines for demonstration
const highlightData = {
    2: [29, 170, 187, 276, 305, 396, 578, 595, 683, 799, 909, 1012, 1148],
    3: [
      // Unit 1
      ...Array.from({ length: 209 - 167 + 1 }, (_, i) => 167 + i),
      // Unit 2
      ...Array.from({ length: 284 - 226 + 1 }, (_, i) => 226 + i),
      // Unit 3
      ...Array.from({ length: 415 - 349 + 1 }, (_, i) => 349 + i),
      // Unit 4
      ...Array.from({ length: 486 - 419 + 1 }, (_, i) => 419 + i),
      // Unit 5
      ...Array.from({ length: 715 - 551 + 1 }, (_, i) => 551 + i),
      // Unit 6
      ...Array.from({ length: 834 - 780 + 1 }, (_, i) => 780 + i),
      // Unit 7
      ...Array.from({ length: 895 - 838 + 1 }, (_, i) => 838 + i),
      // Unit 8
      ...Array.from({ length: 1063 - 966 + 1 }, (_, i) => 966 + i),
      // Unit 9
      ...Array.from({ length: 1215 - 1128 + 1 }, (_, i) => 1128 + i),
      // Unit 10
      ...Array.from({ length: 1360 - 1280 + 1 }, (_, i) => 1280 + i),
      // Unit 11
      ...Array.from({ length: 1550 - 1425 + 1 }, (_, i) => 1425 + i),
      // Unit 12
      ...Array.from({ length: 1832 - 1615 + 1 }, (_, i) => 1615 + i),
      // Unit 13
      ...Array.from({ length: 1955 - 1897 + 1 }, (_, i) => 1897 + i),
    ].flat(),
    4: [100, 101, 102, 103, 104, 105], // Example lines
};

const StageScreen = ({ stageId }) => {
  const [beforeContent, setBeforeContent] = useState('');
  const [afterContent, setAfterContent] = useState('');

  const { title, input_prompt, transformation_process } = prompts[`step${stageId}`] || {};
  const files = stageFiles[stageId];
  const highlights = highlightData[stageId] || [];

  useEffect(() => {
    const fetchContent = async () => {
      if (typeof files.before === 'string') {
        const response = await fetch(files.before);
        const text = await response.text();
        setBeforeContent(text);
      } else {
        setBeforeContent(JSON.stringify(files.before, null, 2));
      }

      if (typeof files.after === 'string') {
        const response = await fetch(files.after);
        const text = await response.text();
        setAfterContent(text);
      } else if (files.after.message) {
        setAfterContent(files.after.message);
      } else {
        setAfterContent(JSON.stringify(files.after, null, 2));
      }
    };

    if (files) {
      fetchContent();
    }
  }, [stageId, files]);

  if (!files) {
    return <div>Loading...</div>; // Or a proper loading state
  }

  return (
    <ScreenContainer>
      <StageTitle>{title}</StageTitle>
      <MainContent>
        <FileViewersContainer>
          <Panel>
            <h3>Before</h3>
            <FileViewer content={beforeContent} language={files.lang.before} />
          </Panel>
          <Panel>
            <h3>After</h3>
            <FileViewer key={afterContent} content={afterContent} language={files.lang.after} highlightLines={highlights} />
          </Panel>
        </FileViewersContainer>
        <BottomSection>
          <PromptSection 
            inputPrompt={input_prompt}
            transformationProcess={transformation_process}
          />
        </BottomSection>
      </MainContent>
      
    </ScreenContainer>
  );
};

export default StageScreen;
