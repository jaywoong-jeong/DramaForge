import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, Card, CardContent, Divider, Chip } from '@mui/material';
import { ArrowLeft, ArrowRight, FileText, ListTree, Network, Split, FolderSearch, LineChart } from 'lucide-react';

// Import custom CSS for no-scroll functionality
import './no-scroll.css';

// Import JSON data
import eventStreamJson from './data/1_event_stream_merged.json';
import hierarchicalJson from './data/2_hierarchical_script.json';
import segmentedJson from './data/3_segmented_units.json';
import analyzedJson from './data/4_final_analyzed_script.json';
import plotJson from './data/5_final_script_with_plot.json';

// Import raw play text
import proposalText from './data/proposal.txt?raw';

// Using imported raw play text
const rawPlayText = proposalText;

// Define the pipeline pages for navigation
const pipelinePages = [
  {
    id: 'intro',
    title: 'Drama Processing Pipeline',
    description: 'From Raw Text to Structured Schema'
  },
  {
    id: 'event-stream',
    title: 'Stage 1: Event Stream',
    description: 'Converting raw play text into a structured event stream',
    sourceData: rawPlayText,
    targetData: eventStreamJson,
    sourceTitle: 'Raw Play Text',
    targetTitle: 'Event Stream JSON',
    sourceLang: 'text',
    targetLang: 'json'
  },
  {
    id: 'hierarchical',
    title: 'Stage 2: Hierarchical Script',
    description: 'Organizing events into a hierarchical structure of acts and scenes',
    sourceData: eventStreamJson,
    targetData: hierarchicalJson,
    sourceTitle: 'Event Stream JSON',
    targetTitle: 'Hierarchical Script JSON',
    sourceLang: 'json',
    targetLang: 'json'
  },
  {
    id: 'segmented-units',
    title: 'Stage 3: Segmented Units',
    description: 'Breaking down scenes into dramatic units',
    sourceData: hierarchicalJson,
    targetData: segmentedJson,
    sourceTitle: 'Hierarchical Script JSON',
    targetTitle: 'Segmented Units JSON',
    sourceLang: 'json',
    targetLang: 'json'
  },
  {
    id: 'analyzed-script',
    title: 'Stage 4: Script Analysis',
    description: 'Adding analytical metadata to dramatic units',
    sourceData: segmentedJson,
    targetData: analyzedJson,
    sourceTitle: 'Segmented Units JSON',
    targetTitle: 'Analyzed Script JSON',
    sourceLang: 'json',
    targetLang: 'json'
  },
  {
    id: 'plot-structure',
    title: 'Stage 5: Plot Structure',
    description: 'Enhancing the script with plot information',
    sourceData: analyzedJson,
    targetData: plotJson,
    sourceTitle: 'Analyzed Script JSON',
    targetTitle: 'Final Script with Plot JSON',
    sourceLang: 'json',
    targetLang: 'json'
  }
];

// Helper function to format JSON for display
const formatJSON = (jsonData, maxLength = 2000) => {
  if (typeof jsonData === 'string') {
    return jsonData;
  }
  
  try {
    const stringified = JSON.stringify(jsonData, null, 2);
    if (stringified.length > maxLength) {
      return stringified.substring(0, maxLength) + '\n... (content truncated)';
    }
    return stringified;
  } catch (error) {
    return 'Error formatting JSON';
  }
};

// Helper function to extract relevant examples from each stage
const extractRelevantExample = (data, stage) => {
  if (typeof data === 'string') return data;
  
  try {
    let example = {};
    
    switch (stage) {
      case 'event-stream':
        // For event stream, show metadata, a few characters, and a few body items
        example = {
          metadata: data.metadata,
          characters: data.characters?.slice(0, 3) || [],
          body: data.body?.slice(0, 5) || []
        };
        break;
        
      case 'hierarchical':
        // For hierarchical script, show metadata and part of the first act/scene
        example = {
          metadata: data.metadata,
          characters: data.characters?.slice(0, 2) || [],
          acts: data.acts ? [{
            act_number: data.acts[0].act_number,
            scenes: [{
              scene_number: data.acts[0].scenes[0].scene_number,
              setting: data.acts[0].scenes[0].setting,
              content: data.acts[0].scenes[0].content?.slice(0, 3) || []
            }]
          }] : []
        };
        break;
        
      case 'segmented-units':
        // For segmented units, show part of the first unit
        if (data.acts && data.acts[0].scenes && data.acts[0].scenes[0].units) {
          example = {
            metadata: data.metadata,
            acts: [{
              act_number: data.acts[0].act_number,
              scenes: [{
                scene_number: data.acts[0].scenes[0].scene_number,
                units: [{
                  unit_id: data.acts[0].scenes[0].units[0].unit_id,
                  content: data.acts[0].scenes[0].units[0].content?.slice(0, 3) || []
                }]
              }]
            }]
          };
        }
        break;
        
      case 'analyzed-script':
        // For analyzed script, show part of the analysis
        if (data.acts && data.acts[0].scenes && data.acts[0].scenes[0].units) {
          const unit = data.acts[0].scenes[0].units[0];
          example = {
            metadata: data.metadata,
            acts: [{
              act_number: data.acts[0].act_number,
              scenes: [{
                scene_number: data.acts[0].scenes[0].scene_number,
                units: [{
                  unit_id: unit.unit_id,
                  content: unit.content?.slice(0, 2) || [],
                  analysis: unit.analysis || {}
                }]
              }]
            }]
          };
        }
        break;
        
      case 'plot-structure':
        // For plot structure, show plot information
        if (data.acts && data.acts[0].scenes) {
          example = {
            metadata: data.metadata,
            plot_structure: data.plot_structure || {},
            acts: [{
              act_number: data.acts[0].act_number,
              plot_function: data.acts[0].plot_function || '',
              scenes: [{
                scene_number: data.acts[0].scenes[0].scene_number,
                plot_points: data.acts[0].scenes[0].plot_points || []
              }]
            }]
          };
        }
        break;
        
      default:
        return formatJSON(data);
    }
    
    return formatJSON(example);
  } catch (error) {
    console.error('Error extracting example:', error);
    return formatJSON(data);
  }
};

const PipelineDocumentation = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sourceExpanded, setSourceExpanded] = useState(false);
  const [targetExpanded, setTargetExpanded] = useState(false);
  
  const currentPage = pipelinePages[currentPageIndex];
  
  // For the intro page, we want to show a special layout
  const isIntroPage = currentPage.id === 'intro';
  
  // Control scroll behavior based on current page
  useEffect(() => {
    const documentBody = document.body;
    const documentHtml = document.documentElement;
    
    if (isIntroPage) {
      // Disable scrolling on intro page
      documentBody.classList.add('no-scroll');
      documentHtml.classList.add('no-scroll');
    } else {
      // Enable scrolling on other pages
      documentBody.classList.remove('no-scroll');
      documentHtml.classList.remove('no-scroll');
    }
    
    // Cleanup function
    return () => {
      documentBody.classList.remove('no-scroll');
      documentHtml.classList.remove('no-scroll');
    };
  }, [isIntroPage]);

  const goToNextPage = () => {
    if (currentPageIndex < pipelinePages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setSourceExpanded(false);
      setTargetExpanded(false);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setSourceExpanded(false);
      setTargetExpanded(false);
    }
  };

  // Special rendering for intro page
  const renderIntroPage = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', justifyContent: 'center' }} className="no-scroll-container">
      <Box sx={{ p: 2, textAlign: 'center' }} className="no-scroll-container">
        <Typography variant="h3" gutterBottom sx={{ mt: 0, mb: 3, fontWeight: 600, fontSize: '2.5rem' }}>Drama Processing Pipeline</Typography>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', fontSize: '1.2rem' }}>From Raw Play Text to Structured Schema</Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card elevation={1} sx={{ height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <FileText size={28} color="#000000" style={{ marginBottom: 8 }} />
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.5 }}>Raw Text</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Unstructured play text
                </Typography>
                <Chip label="Stage 1" color="default" variant="outlined" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={1} sx={{ height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <ListTree size={28} color="#000000" style={{ marginBottom: 8 }} />
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.5 }}>Event Stream</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Sequential dialogue events
                </Typography>
                <Chip label="Stage 2" color="default" variant="outlined" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={1} sx={{ height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Network size={28} color="#000000" style={{ marginBottom: 8 }} />
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.5 }}>Hierarchical</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Nested structure with acts/scenes
                </Typography>
                <Chip label="Stage 3" color="default" variant="outlined" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={1} sx={{ height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Split size={28} color="#000000" style={{ marginBottom: 8 }} />
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.5 }}>Segmentation</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Dialogue units with boundaries
                </Typography>
                <Chip label="Stage 4" color="default" variant="outlined" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={1} sx={{ height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <FolderSearch size={28} color="#000000" style={{ marginBottom: 8 }} />
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.5 }}>Analysis</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Entity & sentiment analysis
                </Typography>
                <Chip label="Stage 5" color="default" variant="outlined" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={1} sx={{ height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 } }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <LineChart size={28} color="#000000" style={{ marginBottom: 8 }} />
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.5 }}>Plot Analysis</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Complete structure with plot points
                </Typography>
                <Chip label="Final" color="default" variant="outlined" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Process explanation will be moved to bottom */}
        
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, bgcolor: '#f5f5f5', mt: 1, maxWidth: '850px', mx: 'auto' }}>
          <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
            This pipeline demonstrates how <strong>"The Proposal" by Anton Chekhov</strong> is transformed from raw text into a structured JSON schema with progressively richer annotations. Use the navigation buttons below to explore each transformation stage.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
  
  // Rendering for transformation stages
  const renderTransformationPage = () => {
    // Format source and target data for display
    const sourceData = currentPage.sourceData;
    const targetData = currentPage.targetData;
    
    // Extract examples to show
    const formattedSource = currentPage.id === 'event-stream' 
      ? sourceData 
      : extractRelevantExample(sourceData, currentPage.id);
    const formattedTarget = extractRelevantExample(targetData, currentPage.id);
    
    return (
      <Box sx={{ p: 1, maxHeight: 'calc(100vh - 110px)', overflow: 'auto' }}>
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 0.5, fontWeight: 500 }}>{currentPage.title}</Typography>
        <Typography variant="body2" paragraph sx={{ mb: 1, fontSize: '0.75rem' }}>{currentPage.description}</Typography>
        
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 1, height: '100%' }}>
              <Box sx={{ 
                mb: 0.5,
                pb: 0.5,
                borderBottom: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.8rem' }}>{currentPage.sourceTitle}</Typography>
              </Box>
              
              <Box sx={{ 
                height: 260, 
                overflow: 'auto',
                bgcolor: '#f8f9fa',
                p: 1,
                borderRadius: 1,
                fontFamily: 'monospace'
              }}>
                <pre style={{ margin: 0, overflow: 'auto', fontSize: '0.7rem' }}>
                  {typeof formattedSource === 'string' ? formattedSource : JSON.stringify(formattedSource, null, 2)}
                </pre>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 1, height: '100%' }}>
              <Box sx={{ 
                mb: 0.5,
                pb: 0.5,
                borderBottom: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.8rem' }}>{currentPage.targetTitle}</Typography>
              </Box>
              
              <Box sx={{ 
                height: 260, 
                overflow: 'auto',
                bgcolor: '#f8f9fa',
                p: 1,
                borderRadius: 1,
                fontFamily: 'monospace'
              }}>
                <pre style={{ margin: 0, overflow: 'auto', fontSize: '0.7rem' }}>
                  {typeof formattedTarget === 'string' ? formattedTarget : JSON.stringify(formattedTarget, null, 2)}
                </pre>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Process explanation - Left and Right columns */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, height: '100%' }}>
              <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.8rem', mb: 1, borderBottom: '1px solid #e0e0e0', pb: 0.5 }}>Input Prompt:</Typography>
              
              {currentPage.id === 'event-stream' && (
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  "Extract dialogue events from the play text in sequential order. Identify characters, 
                  dialogue lines, and stage directions. Format as a JSON array of events."
                </Typography>
              )}
              
              {currentPage.id === 'hierarchical' && (
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  "Organize the events into a hierarchical structure with acts and scenes. 
                  Identify scene boundaries and settings from the stage directions."
                </Typography>
              )}
              
              {currentPage.id === 'segmented-units' && (
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  "Segment each scene into dramatic units based on character configurations and topics. 
                  Assign unique IDs to each unit following the pattern Act#_Scene#_Unit#."
                </Typography>
              )}
              
              {currentPage.id === 'analyzed-script' && (
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  "Extract character entities with unique IDs. Apply sentiment analysis to dialogue. 
                  Tag character mentions and infer relationships between characters."
                </Typography>
              )}
              
              {currentPage.id === 'plot-structure' && (
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  "Identify major plot points based on dialogue and actions. Map character arcs and 
                  highlight climactic moments. Include structural metadata about narrative flow."
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={6}>
            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, height: '100%' }}>
              <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.8rem', mb: 1, borderBottom: '1px solid #e0e0e0', pb: 0.5 }}>Transformation Process:</Typography>
              
              {currentPage.id === 'event-stream' && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>1. Parse raw text</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mx: 0.5 }}>→</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>2. Extract character info</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mx: 0.5 }}>→</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>3. Associate dialogue</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mx: 0.5 }}>→</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>4. Create JSON stream</Typography>
                </Box>
              )}
              
              {currentPage.id === 'hierarchical' && (
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>1. Analyze event stream to identify act/scene boundaries</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>2. Reorganize into nested structure</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>3. Extract scene settings from directions</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>4. Build hierarchical JSON structure</Typography>
                </Box>
              )}
              
              {currentPage.id === 'segmented-units' && (
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>1. Identify dramatic unit boundaries</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>2. Assign unique IDs (Act#_Scene#_Unit#)</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>3. Organize content within units</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>4. Add three-level schema hierarchy</Typography>
                </Box>
              )}
              
              {currentPage.id === 'analyzed-script' && (
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>1. Extract character entities with IDs</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>2. Apply sentiment analysis</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>3. Tag character mentions and references</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>4. Infer character relationships</Typography>
                </Box>
              )}
              
              {currentPage.id === 'plot-structure' && (
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>1. Identify major plot points</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>2. Map character arcs through the play</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>3. Highlight climactic moments</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>4. Add narrative flow metadata</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)' }}>
      {/* Main content area */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {isIntroPage ? renderIntroPage() : renderTransformationPage()}
      </Box>
      
      {/* Navigation controls */}
      <Box sx={{ 
        borderTop: '1px solid #e0e0e0', 
        p: 0.75, 
        display: 'flex', 
        justifyContent: 'space-between',
      }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
          disabled={currentPageIndex === 0}
          size="small"
          sx={{ 
            borderColor: '#000000', 
            color: '#000000', 
            '&:hover': { 
              borderColor: '#333333', 
              bgcolor: 'rgba(0,0,0,0.04)' 
            },
            '&.Mui-disabled': {
              borderColor: '#e0e0e0',
              color: '#bdbdbd'
            },
            textTransform: 'none',
            px: 2
          }}
        >
          Previous
        </Button>
        <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8, padding: '2px 10px', backgroundColor: '#000', color: '#fff', borderRadius: 12, fontSize: '0.75rem' }}>
            {currentPageIndex + 1}
          </span> 
          of {pipelinePages.length}
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowRight size={16} />}
          onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
          disabled={currentPageIndex === pipelinePages.length - 1}
          size="small"
          sx={{ 
            bgcolor: '#000000', 
            '&:hover': { 
              bgcolor: '#333333' 
            },
            '&.Mui-disabled': {
              bgcolor: '#e0e0e0',
              color: '#9e9e9e'
            },
            textTransform: 'none',
            px: 2
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PipelineDocumentation;
