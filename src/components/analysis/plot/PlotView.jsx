import ReactFlow, { 
  Background, 
  Controls,
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';

function PlotView({ plotStructure }) {
  if (!plotStructure) return null;

  // 노드 생성
  const nodes = [
    {
      id: 'exposition',
      data: { label: plotStructure.structure.exposition },
      position: { x: 0, y: 150 },
      style: { width: 200 }
    },
    {
      id: 'development',
      data: { label: plotStructure.structure.development },
      position: { x: 250, y: 150 },
      style: { width: 200 }
    },
    {
      id: 'climax',
      data: { label: plotStructure.structure.climax },
      position: { x: 500, y: 150 },
      style: { width: 200 }
    },
    {
      id: 'conclusion',
      data: { label: plotStructure.structure.conclusion },
      position: { x: 250, y: 300 },
      style: { width: 200 }
    }
  ];

  // 엣지 생성
  const edges = [
    {
      id: 'main-exposition',
      source: 'main',
      target: 'exposition',
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'exposition-development',
      source: 'exposition',
      target: 'development',
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'development-climax',
      source: 'development',
      target: 'climax',
      markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
      id: 'climax-conclusion',
      source: 'climax',
      target: 'conclusion',
      markerEnd: { type: MarkerType.ArrowClosed }
    }
  ];

  return (
    <div style={{ height: 400 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default PlotView;
