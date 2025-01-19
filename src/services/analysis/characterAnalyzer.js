import { analyzeText } from '../api/openai';

// Rule-based character statistics analysis
export const analyzeCharacterStats = (script) => {
  if (!script) {
    console.warn('Invalid script data structure');
    return [];
  }

  const characters = new Map();

  // Helper function to process dialogues
  const processDialogue = (dialogue, sceneIndex) => {
    if (!dialogue?.character || dialogue.character === 'direction') return;
    
    const character = dialogue.character;
    if (!characters.has(character)) {
      characters.set(character, {
        name: character,
        dialogues: 0,
        stageTime: 0,
        lines: [],
        scenes: new Set(),
        firstAppearance: sceneIndex
      });
    }
    
    const stats = characters.get(character);
    const lines = dialogue.lines || [dialogue.dialogue].filter(Boolean);
    stats.dialogues += lines.length;
    stats.lines.push(...lines);
    stats.scenes.add(sceneIndex);
  };

  // Process scenes based on different script formats
  if (Array.isArray(script.scenes)) {
    // Format 1: scenes array with dialogues, dialogues_post, etc.
    script.scenes.forEach((scene, sceneIndex) => {
      const sceneCharacters = new Set();
      
      // Process all types of dialogues
      ['dialogues', 'dialogues_post', 'dialogues_final', 'dialogues_end'].forEach(type => {
        const dialogues = scene?.content?.[type] || scene?.[type];
        if (Array.isArray(dialogues)) {
          dialogues.forEach(dialogue => {
            processDialogue(dialogue, sceneIndex);
            if (dialogue?.character) sceneCharacters.add(dialogue.character);
          });
        }
      });

      // Calculate stage time for characters in the scene
      sceneCharacters.forEach(character => {
        const stats = characters.get(character);
        if (stats) {
          stats.stageTime += 1;
        }
      });
    });
  } else if (Array.isArray(script.script)) {
    // Format 2: script array with dialogue and directions
    script.script.forEach((item, index) => {
      if (item.character && item.character !== 'direction') {
        processDialogue(item, Math.floor(index / 10)); // Approximate scene grouping
      }
    });
  }

  return Array.from(characters.values())
    .filter(char => char.name !== 'direction' && char.name !== 'type')
    .map(char => ({
      ...char,
      scenes: Array.from(char.scenes)
    }))
    .sort((a, b) => b.dialogues - a.dialogues); // Sort by number of dialogues
};

// Generate timeline data for characters
export const generateCharacterTimeline = (script) => {
  if (!script) {
    console.warn('Invalid script data structure');
    return [];
  }

  const characters = new Map();
  let totalScenes = 0;

  // Helper function to process dialogues
  const processDialogue = (dialogue, sceneIndex, totalScenes) => {
    if (!dialogue?.character || dialogue.character === 'direction') return;
    
    const sceneStart = (sceneIndex / totalScenes) * 100;
    const sceneEnd = ((sceneIndex + 1) / totalScenes) * 100;

    if (!characters.has(dialogue.character)) {
      characters.set(dialogue.character, {
        name: dialogue.character,
        scenes: []
      });
    }
    
    const timeline = characters.get(dialogue.character);
    // Only add scene if it's not already added
    if (!timeline.scenes.some(scene => scene.start === sceneStart)) {
      timeline.scenes.push({
        start: sceneStart,
        end: sceneEnd
      });
    }
  };

  // Process scenes based on different script formats
  if (Array.isArray(script.scenes)) {
    // Format 1: scenes array with dialogues, dialogues_post, etc.
    totalScenes = script.scenes.length;
    
    script.scenes.forEach((scene, sceneIndex) => {
      ['dialogues', 'dialogues_post', 'dialogues_final', 'dialogues_end'].forEach(type => {
        const dialogues = scene?.content?.[type] || scene?.[type];
        if (Array.isArray(dialogues)) {
          dialogues.forEach(dialogue => {
            processDialogue(dialogue, sceneIndex, totalScenes);
          });
        }
      });
    });
  } else if (Array.isArray(script.script)) {
    // Format 2: script array with dialogue and directions
    // Group dialogues into approximate scenes (every 10 items)
    totalScenes = Math.ceil(script.script.length / 10);
    
    script.script.forEach((item, index) => {
      if (item.character && item.character !== 'direction') {
        processDialogue(item, Math.floor(index / 10), totalScenes);
      }
    });
  }

  return Array.from(characters.values())
    .filter(char => char.name !== 'direction' && char.name !== 'type')
    .sort((a, b) => a.name.localeCompare(b.name));
};

// LLM-based character trait analysis
export const analyzeCharacterTraits = async (script, character) => {
  if (!script?.scenes || !character) {
    console.warn('Invalid script data structure or character');
    return null;
  }

  const characterDialogues = [];
  const characterScenes = new Set();

  // Collect all dialogues and scenes for the character
  script.scenes.forEach((scene, sceneIndex) => {
    if (!scene?.content) return;

    const processDialogues = (dialogues) => {
      if (!Array.isArray(dialogues)) return;
      
      dialogues.forEach(dialogue => {
        if (dialogue?.character === character && Array.isArray(dialogue.lines)) {
          characterDialogues.push(...dialogue.lines);
          characterScenes.add(sceneIndex);
        }
      });
    };

    // Process all types of dialogues
    const { dialogues, dialogues_post, dialogues_final, dialogues_end } = scene.content;
    processDialogues(dialogues);
    processDialogues(dialogues_post);
    processDialogues(dialogues_final);
    processDialogues(dialogues_end);
  });

  if (characterDialogues.length === 0) {
    console.warn(`No dialogues found for character: ${character}`);
    return null;
  }

  // Prepare context for LLM
  const context = `
Character: ${character}
Total Dialogues: ${characterDialogues.length}
Appears in Scenes: ${Array.from(characterScenes).join(', ')}

Sample Dialogues:
${characterDialogues.slice(0, 5).join('\n')}
`;

  // Analyze character traits using LLM
  const prompt = `
Based on the following context about a character in a script, analyze:
1. Personality traits
2. Character arc/development
3. Relationships with other characters
4. Key motivations and conflicts

Context:
${context}

Please provide a concise analysis focusing on these aspects.
`;

  try {
    const analysis = await analyzeText(prompt);
    return {
      character,
      analysis: analysis.trim()
    };
  } catch (error) {
    console.error('Character trait analysis failed:', error);
    return null;
  }
};

// Combine rule-based and LLM analysis
export const getCompleteCharacterAnalysis = async (script, character) => {
  if (!script?.scenes || !character) {
    console.warn('Invalid script data structure or character');
    return null;
  }

  // Get basic statistics (rule-based)
  const stats = analyzeCharacterStats(script);
  const characterStats = stats.find(stat => stat.name === character);

  if (!characterStats) {
    return null;
  }

  // Get timeline data
  const timeline = generateCharacterTimeline(script);
  const characterTimeline = timeline.find(t => t.name === character);

  // Get movement analysis
  const movementAnalysis = analyzeCharacterMovements(script);
  const characterMovements = movementAnalysis.characterTimeline.find(t => t.character === character);

  // Get trait analysis (LLM-based)
  const traitAnalysis = await analyzeCharacterTraits(script, character);

  return {
    ...characterStats,
    timeline: characterTimeline?.scenes || [],
    movements: characterMovements?.presence || [],
    traits: traitAnalysis?.analysis || null
  };
};

// Character movement analysis functions
export const analyzeCharacterMovements = (script) => {
  if (!script?.scenes || !script?.characters) {
    console.warn('Invalid script data structure');
    return {
      scenes: [],
      characterTimeline: []
    };
  }

  const scenes = script.scenes.map((_, idx) => analyzeScene(script, idx));
  const characterTimeline = new Map();
  
  // Initialize character timeline for all characters
  script.characters.forEach(char => {
    characterTimeline.set(char, []);
  });

  // Build character timeline from scene analysis
  scenes.forEach(scene => {
    scene.finalCharacters.forEach(char => {
      const timeline = characterTimeline.get(char) || [];
      timeline.push({
        sceneId: scene.sceneId,
        duration: {
          start: '0',
          end: scene.movements.length.toString()
        }
      });
      characterTimeline.set(char, timeline);
    });
  });

  // Convert timeline to array format
  const timelineArray = Array.from(characterTimeline.entries()).map(([character, presence]) => ({
    character,
    presence
  }));

  return {
    scenes,
    characterTimeline: timelineArray
  };
};

// Helper functions
const extractCharactersFromDirection = (direction, script) => {
  if (!direction || !script?.characters) return [];
  
  const characters = [];
  const words = direction.split(' ');
  
  words.forEach(word => {
    if (script.characters.includes(word)) {
      characters.push(word);
    }
  });

  return characters;
};

const extractEntrances = (direction, script) => {
  const entranceKeywords = ['등장', '들어온다', '들어와', '나온다', '나와'];
  return extractCharactersByKeywords(direction, entranceKeywords, script);
};

const extractExits = (direction, script) => {
  const exitKeywords = ['퇴장', '나간다', '사라진다', '떠난다'];
  return extractCharactersByKeywords(direction, exitKeywords, script);
};

const extractCharactersByKeywords = (direction, keywords, script) => {
  if (!direction || !keywords?.length || !script?.characters) return [];
  
  const characters = [];
  const words = direction.split(' ');
  
  words.forEach((word, idx) => {
    if (keywords.some(keyword => direction.includes(keyword))) {
      // Look for character names before the keyword
      const prevWords = words.slice(Math.max(0, idx - 3), idx);
      prevWords.forEach(prevWord => {
        if (script.characters.includes(prevWord)) {
          characters.push(prevWord);
        }
      });
    }
  });

  return characters;
};

const analyzeScene = (script, sceneIdx) => {
  const scene = script.scenes[sceneIdx];
  const sceneId = scene.scene_number.toString();
  const movements = [];
  let currentCharacters = new Set();

  // Helper function to add movement
  const addMovement = (type, characters, trigger) => {
    if (!characters || characters.length === 0) return;
    
    movements.push({
      lineNumber: movements.length.toString(),
      type,
      characters,
      trigger
    });

    // Update current characters on stage
    characters.forEach(char => {
      if (type === 'entrance') {
        currentCharacters.add(char);
      } else if (type === 'exit') {
        currentCharacters.delete(char);
      }
    });
  };

  // Analyze initial state from first direction
  if (scene.directions?.[0]) {
    const initialDirection = scene.directions[0].content;
    const initialCharacters = extractCharactersFromDirection(initialDirection, script);
    initialCharacters.forEach(char => currentCharacters.add(char));
  }

  // Function to analyze direction content
  const analyzeDirection = (direction, source) => {
    const content = direction.content;
    const entrances = extractEntrances(content, script);
    const exits = extractExits(content, script);

    if (entrances.length > 0) {
      addMovement('entrance', entrances, {
        type: 'explicit',
        source,
        content
      });
    }

    if (exits.length > 0) {
      addMovement('exit', exits, {
        type: 'explicit',
        source,
        content
      });
    }
  };

  // Analyze all direction types
  ['directions', 'directions_post', 'directions_end', 'directions_final'].forEach(dirType => {
    if (scene[dirType]) {
      scene[dirType].forEach(direction => {
        analyzeDirection(direction, dirType);
      });
    }
  });

  // Analyze dialogues for implicit movements
  const analyzeDialogues = (dialogues) => {
    if (!dialogues) return;
    
    dialogues.forEach(dialogue => {
      const character = dialogue.character;
      
      // If character speaks but wasn't on stage, add implicit entrance
      if (!currentCharacters.has(character)) {
        addMovement('entrance', [character], {
          type: 'implicit',
          source: 'dialogue',
          content: `${character}의 첫 대사: ${dialogue.lines[0]}`
        });
      }

      // Check pre-directions for movement hints
      if (dialogue.pre_directions) {
        dialogue.pre_directions.forEach(dir => {
          analyzeDirection(dir, 'dialogue_direction');
        });
      }
    });
  };

  ['dialogues', 'dialogues_post', 'dialogues_end', 'dialogues_final'].forEach(dialogueType => {
    analyzeDialogues(scene[dialogueType]);
  });

  return {
    sceneId,
    initialCharacters: Array.from(currentCharacters),
    movements,
    finalCharacters: Array.from(currentCharacters)
  };
}; 