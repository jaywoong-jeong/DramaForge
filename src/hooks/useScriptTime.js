import { useState, useEffect } from 'react';
import { calculateTotalTime, calculateSceneTime, formatTime } from '../services/analysis/timeAnalyzer';

export function useScriptTime(script, analysisResult, currentScene) {
  const [totalTime, setTotalTime] = useState(null);
  const [currentSceneTime, setCurrentSceneTime] = useState(null);

  useEffect(() => {
    if (script && analysisResult) {
      calculateTotalTime(script).then(time => setTotalTime(formatTime(time)));
    }
  }, [script, analysisResult]);

  useEffect(() => {
    if (script && analysisResult && currentScene !== undefined) {
      calculateSceneTime(script.scenes[currentScene]).then(time => {
        setCurrentSceneTime(formatTime(time));
      });
    }
  }, [script, analysisResult, currentScene]);

  return { totalTime, currentSceneTime };
} 