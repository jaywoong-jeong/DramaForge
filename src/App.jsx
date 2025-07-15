import { useState } from 'react';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import HomePage from './components/HomePage';
import StageScreen from './components/StageScreen';
import Navigation from './components/Navigation';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  overflow-y: auto; /* Allow content to scroll if it exceeds viewport */
`;

function App() {
  const [currentStage, setCurrentStage] = useState(0); // 0 for home page
  const totalStages = 4;

  const goToStage = (stageNumber) => {
    if (stageNumber >= 0 && stageNumber <= totalStages) {
      setCurrentStage(stageNumber);
    }
  };

  const goToNext = () => {
    goToStage(currentStage + 1);
  };

  const goToPrev = () => {
    goToStage(currentStage - 1);
  };

  return (
    <AppContainer>
      <GlobalStyles />
      <MainContent>
        {currentStage === 0 ? (
          <HomePage goToStage={goToStage} />
        ) : (
          <StageScreen stageId={currentStage} />
        )}
      </MainContent>
      <Navigation
        currentStage={currentStage}
        totalStages={totalStages}
        goToNext={goToNext}
        goToPrev={goToPrev}
      />
    </AppContainer>
  );
}

export default App;
