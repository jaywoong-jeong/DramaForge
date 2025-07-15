import React from 'react';
import { Link } from 'react-router-dom';
import StageNavigator from '../components/StageNavigator';
import { Box, Typography } from '@mui/material';

const HomePage = () => {
  const stages = [
    {
      id: 1,
      title: 'Hierarchical Structuring',
      description: 'Parses the raw script into a structured format of acts, scenes, and events.',
      path: '/stage/1',
    },
    {
      id: 2,
      title: 'Unit Segmentation',
      description: 'Divides each scene into smaller dramatic units or beats based on shifts in action or topic.',
      path: '/stage/2',
    },
    {
      id: 3,
      title: 'Unit-level Analysis',
      description: 'Performs a deep analysis of each unit, tracking character states, topics, and mood.',
      path: '/stage/3',
    },
    {
      id: 4,
      title: 'Plot Analysis',
      description: 'Analyzes the overall plot structure, identifying main plots and sub-plots.',
      path: '/stage/4',
    },
    {
      id: 5,
      title: 'Visualization',
      description: 'Generates visual representations of the script analysis, such as character interaction graphs.',
      path: '/stage/5',
    },
  ];

  const containerStyle = {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    padding: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden', // Prevent scrolling
  };

  const cardsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap', // Wrap cards to next line if necessary
    width: '100%',
    maxWidth: '1400px',
    overflowX: 'hidden', // Prevents horizontal scrolling
  };

  const cardStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    width: '200px',
    minWidth: '200px',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, boxShadow 0.2s',
    flexShrink: 0,
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ margin: '0 0 15px 0' }}>DramaForge Pipeline</h1>
      <p style={{ margin: '0 0 30px 0', color: '#555' }}>Explore the different stages of script analysis.</p>
      <div style={cardsContainerStyle}>
        {stages.map((stage) => (
          <Link
            key={stage.id}
            to={stage.path}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = cardHoverStyle.transform;
              e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = cardStyle.boxShadow;
            }}
          >
            <h2>{stage.title}</h2>
            <p>{stage.description}</p>
          </Link>
        ))}
      </div>
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, bgcolor: '#f5f5f5', mt: 4, mb: 2, maxWidth: '850px', mx: 'auto' }}>
        <Typography variant="body1" sx={{ fontSize: '0.9rem', textAlign: 'center' }}>
          This pipeline demonstrates how <strong>"The Proposal" by Anton Chekhov</strong> is transformed from raw text into a structured JSON schema with progressively richer annotations. Use the cards above to explore each transformation stage.
        </Typography>
      </Box>
      <div style={{width: '100%', maxWidth: '1200px'}}><StageNavigator currentStage="1" /></div>
    </div>
  );
};

export default HomePage;

