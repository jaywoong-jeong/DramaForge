import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JsonHighlighter from '../components/JsonHighlighter';
import StageNavigator from '../components/StageNavigator';
import { Box, Typography, Paper, Grid } from '@mui/material';
import rawProposalText from '../data/proposal.txt?raw';

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 84px)', // Assuming header height is approx 84px
  padding: '10px',
  boxSizing: 'border-box',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%'
};

const PipelineStagePage = () => {
  const { stageId } = useParams();
  const [displayData, setDisplayData] = useState(null);
  const [promptData, setPromptData] = useState(null);
  const [title, setTitle] = useState('');
  const [highlightKey, setHighlightKey] = useState('');
  const [rawText, setRawText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reset states
        setRawText('');
        setDisplayData(null);

        let data, prompt, stageTitle = '', key = '';

        if (stageId === '1') {
          setRawText(rawProposalText);
        }

        switch (stageId) {
          case '1':
                        data = await import('../data/new/1_event_stream_merged_updated.json');
            stageTitle = 'Stage 1: Event Stream Merging';
            key = 'body';
            break;
          case '2':
            data = await import('../data/new/2_hierarchical_script.json');
            stageTitle = 'Stage 2: Unit Segmentation';
            key = 'scenes';
            break;
          case '3':
            data = await import('../data/new/3_segmented_units.json');
            stageTitle = 'Stage 3: Unit-level Analysis';
            key = 'units';
            break;
          case '4':
            data = await import('../data/new/4_final_analyzed_script.json');
            stageTitle = 'Stage 4: Plot Analysis';
            key = 'plot';
            break;
          case '5':
            data = await import('../data/new/5_final_script_with_plot.json');
            stageTitle = 'Stage 5: Final Script with Plot';
            key = 'script';
            break;
          default:
            // Fallback to stage 1 data for any invalid stageId
            data = await import('../data/new/1_event_stream_merged_updated.json');
            stageTitle = 'Stage 1: Event Stream Merging';
            key = 'body';
            break;
        }

        prompt = await import('../data/new/prompt.json');
        const promptJson = prompt.default;

        // Find the correct prompt content
        const stageInfo = promptJson.metadata.stages.find(s => s.stage === parseInt(stageId, 10));
        let currentPromptContent = null;
        if (stageInfo) {
          const promptKey = stageInfo.prompt_key;
          const promptObject = promptJson.system_prompts[promptKey];
          if (promptObject) {
            if (promptObject.content) {
              currentPromptContent = promptObject.content;
            } else if (promptObject.versions && promptObject.versions.length > 0) {
              const currentVersion = promptObject.versions.find(v => v.version.includes('current')) || promptObject.versions[promptObject.versions.length - 1];
              currentPromptContent = currentVersion.content;
            }
          }
        }

        setDisplayData(data.default);
        setPromptData(currentPromptContent);
        setTitle(stageTitle);
        setHighlightKey(key);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [stageId]);

  const renderStage1 = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      {/* Top Panels */}
      <Grid container spacing={2} sx={{ height: '55%', maxHeight: '55%' }}>
        <Grid item xs={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={2} sx={{ p: 2, overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Raw Text: The Proposal</Typography>
            <pre style={{ flexGrow: 1, whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '0.8rem', margin: 0, overflow: 'auto' }}>{rawText}</pre>
          </Paper>
        </Grid>
        <Grid item xs={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={2} sx={{ p: 2, overflow: 'auto', height: '100%' }}>
            <JsonHighlighter data={displayData} highlightKey={highlightKey} />
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Panel */}
      <Box sx={{ height: '45%', maxHeight: '45%', overflow: 'auto' }}>
        <Typography variant="h5" gutterBottom>Implementation Details</Typography>
        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="body1" paragraph>
            In this initial stage, the raw script from `proposal.txt` is processed to establish a basic hierarchical structure. The primary goal is to parse the text and organize it into acts, scenes, and individual lines or events, creating a foundational JSON object for subsequent stages.
          </Typography>
          <Typography variant="h6">Prompt</Typography>
          <Paper component="pre" elevation={0} sx={{ p: 2, mt: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap', bgcolor: '#e0e0e0', wordBreak: 'break-all' }}>
            {promptData}
          </Paper>
        </Paper>
      </Box>
    </Box>
  );

  const renderDefaultStage = () => (
    <>
      <JsonHighlighter data={displayData} highlightKey={highlightKey} />
      {promptData && (
        <Box sx={{ mt: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f5f5f5', maxWidth: '80%', mx: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Prompt</Typography>
          <Typography component="pre" variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {promptData}
          </Typography>
        </Box>
      )}
    </>
  );

  return (
    <div style={pageStyle}>
      <Typography variant="h5" component="h1" sx={{ textAlign: 'center', mb: 2, flexShrink: 0 }}>
        {title}
      </Typography>
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {stageId === '1' ? renderStage1() : renderDefaultStage()}
      </Box>

      <Box sx={{ flexShrink: 0, pt: 2 }}>
        <StageNavigator currentStage={parseInt(stageId, 10) + 1} />
      </Box>
    </div>
  );
};

export default PipelineStagePage;
