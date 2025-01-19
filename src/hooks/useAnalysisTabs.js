import { useState } from 'react';

export function useAnalysisTabs() {
  const [mainTab, setMainTab] = useState('characters');
  const [eventViewMode, setEventViewMode] = useState('plot');

  const handleTabChange = (tab) => setMainTab(tab);
  const handleViewModeChange = (mode) => setEventViewMode(mode);

  return {
    mainTab,
    eventViewMode,
    handleTabChange,
    handleViewModeChange
  };
} 