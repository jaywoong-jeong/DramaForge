import React from 'react';
import styled from 'styled-components';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const Header = styled.header`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6c757d;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin-bottom: 3rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    color: #495057;
    line-height: 1.6;
  }
`;

const InfoBox = styled.div`
  background: #e9ecef;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  max-width: 1000px;
  width: 100%;
  font-size: 1rem;
  color: #343a40;
  line-height: 1.6;
`;

const stageData = [
  { id: 1, title: 'Hierarchical Structuring', description: 'Parses the raw script into a structured format of acts, scenes, and events.' },
  { id: 2, title: 'Unit Segmentation', description: 'Divides each scene into smaller dramatic units or beats based on shifts in action or topic.' },
  { id: 3, title: 'Unit-level Analysis', description: 'Performs a deep analysis of each unit, tracking character states, topics, and mood.' },
  { id: 4, title: 'Plot Analysis', description: 'Analyzes the overall plot structure, identifying main plots and sub-plots.' },
];

const HomePage = ({ goToStage }) => {
  return (
    <HomePageContainer>
      <Header>
        <Title>DramaForge Pipeline</Title>
        <Subtitle>Explore the different stages of script analysis.</Subtitle>
      </Header>
      <CardGrid>
        {stageData.map((stage) => (
          <Card key={stage.id} onClick={() => goToStage(stage.id)}>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
          </Card>
        ))}
      </CardGrid>
      <InfoBox>
        This pipeline demonstrates how <strong>"The Proposal" by Anton Chekhov</strong> is transformed from raw text into a structured JSON schema with progressively richer annotations. Use the cards above to explore each transformation stage.
      </InfoBox>
    </HomePageContainer>
  );
};

export default HomePage;
