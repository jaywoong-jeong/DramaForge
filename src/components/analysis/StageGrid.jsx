import { useAtom } from 'jotai';
import { useDroppable } from '@dnd-kit/core';
import { stageAnalysisAtom, currentSceneAtom } from '../../store/atoms';

const StageArea = ({ id, label, elements }) => {
  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <div
      ref={setNodeRef}
      className="stage-area"
      style={{
        border: '1px solid #ddd',
        padding: '8px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      {elements?.map(element => (
        <div
          key={element.propId}
          className={`stage-element size-${element.size?.toLowerCase()}`}
        >
          {element.name}
        </div>
      ))}
    </div>
  );
};

const StageGrid = () => {
  const [analysis] = useAtom(stageAnalysisAtom);
  const [currentScene] = useAtom(currentSceneAtom);

  const areas = [
    'UPSTAGE_RIGHT', 'UPSTAGE_CENTER', 'UPSTAGE_LEFT',
    'STAGE_RIGHT', 'STAGE_CENTER', 'STAGE_LEFT',
    'DOWNSTAGE_RIGHT', 'DOWNSTAGE_CENTER', 'DOWNSTAGE_LEFT'
  ];

  const currentLayout = analysis.layouts[currentScene] || { elements: [] };

  return (
    <div className="stage-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      aspectRatio: '4/3',
      padding: '16px',
      background: '#f5f5f5',
      borderRadius: '8px'
    }}>
      {areas.map(areaId => {
        const areaElements = currentLayout.elements
          .filter(e => e.position === areaId)
          .map(e => ({
            ...e,
            ...analysis.props.find(p => p.id === e.propId)
          }));

        return (
          <StageArea
            key={areaId}
            id={areaId}
            label={areaId.replace('_', ' ').toLowerCase()}
            elements={areaElements}
          />
        );
      })}
    </div>
  );
};

export default StageGrid; 