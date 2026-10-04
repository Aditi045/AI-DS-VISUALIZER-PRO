import { useMemo } from 'react';
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface GraphVisualizerProps {
  state: any;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ state }) => {
  const nodes: Node[] = useMemo(() => {
    if (!state || !state.vertices) return [];
    
    // Very simple layout (circle)
    const radius = 150;
    const center = { x: 300, y: 200 };
    const n = state.vertices.length;
    
    return state.vertices.map((v: any, i: number) => {
      const angle = (i / n) * 2 * Math.PI;
      return {
        id: String(v),
        position: {
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
        },
        data: { label: String(v) },
        style: {
          background: '#ec4899',
          color: 'white',
          border: '2px solid #fbcfe8',
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold'
        }
      };
    });
  }, [state]);

  const edges: Edge[] = useMemo(() => {
    if (!state || !state.edges) return [];
    return state.edges.map((e: any, i: number) => ({
      id: `e-${e.source}-${e.target}-${i}`,
      source: String(e.source),
      target: String(e.target),
      label: e.weight ? String(e.weight) : undefined,
      animated: true,
      style: { stroke: '#fbcfe8', strokeWidth: 2 }
    }));
  }, [state]);

  return (
    <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#4b5563" gap={16} />
        <Controls className="bg-gray-800 border-gray-700 fill-white" />
      </ReactFlow>
    </div>
  );
};

export default GraphVisualizer;
