export function parseScript(scriptData) {
  return {
    scenes: scriptData.scenes.map((scene, index) => {
      const sceneContent = {
        id: index,
        scene_number: scene.scene_number,
        content: {
          directions: scene.directions || [],
          dialogues: scene.dialogues || [],
          directions_post: scene.directions_post || [],
          dialogues_post: scene.dialogues_post || [],
          directions_final: scene.directions_final || [],
          dialogues_final: scene.dialogues_final || [],
          directions_end: scene.directions_end || [],
          dialogues_end: scene.dialogues_end || []
        },
        summary: null,
        analysis: null,
        totalLines: (
          (scene.directions?.length || 0) +
          (scene.dialogues?.reduce((sum, d) => 
            sum + (d.lines?.length || 0) + (d.pre_directions?.length || 0), 0) || 0) +
          (scene.directions_post?.length || 0) +
          (scene.dialogues_post?.reduce((sum, d) => 
            sum + (d.lines?.length || 0) + (d.pre_directions?.length || 0), 0) || 0) +
          (scene.directions_final?.length || 0) +
          (scene.dialogues_final?.reduce((sum, d) => 
            sum + (d.lines?.length || 0) + (d.pre_directions?.length || 0), 0) || 0) +
          (scene.directions_end?.length || 0) +
          (scene.dialogues_end?.reduce((sum, d) => 
            sum + (d.lines?.length || 0) + (d.pre_directions?.length || 0), 0) || 0)
        )
      };

      return sceneContent;
    }),
    metadata: {
      setting: scriptData.setting,
      characters: scriptData.characters ? [...scriptData.characters] : [],
      stage: {
        description: scriptData.stage?.description || ''
      }
    }
  };
}
