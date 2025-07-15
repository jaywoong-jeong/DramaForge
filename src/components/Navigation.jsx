import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-top: 2px solid #dee2e6;
  background-color: #f8f9fa;
`;

const NavButton = styled.button`
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  margin: 0 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageIndicator = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #495057;
`;

const Navigation = ({ currentStage, totalStages, goToNext, goToPrev }) => {
  const pageText = currentStage === 0 ? 'Home' : `${currentStage} of ${totalStages}`;

  return (
    <NavContainer>
        
      <NavButton onClick={goToPrev} disabled={currentStage === 0}>
        Previous
      </NavButton>
      <PageIndicator>{pageText}</PageIndicator>
      <NavButton onClick={goToNext} disabled={currentStage >= totalStages}>
        Next
      </NavButton>
    </NavContainer>
  );
};

export default Navigation;
