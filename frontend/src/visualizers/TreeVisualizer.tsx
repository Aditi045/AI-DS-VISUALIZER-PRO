import { useMemo } from 'react';
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface TreeVisualizerProps {
  state: any; // Tree dict representation
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ state }) => {
  const { nodes, edges } = useMemo(() => {
    const nds: Node[] = [];
    const eds: Edge[] = [];
    
    if (!state) return { nodes: [], edges: [] };

    let isHeap = Array.isArray(state);

    if (isHeap) {
        // Heap logic
        const levelHeight = 80;
        state.forEach((val: any, i: number) => {
            const level = Math.floor(Math.log2(i + 1));
            const levelWidth = Math.pow(2, level);
            const indexInLevel = i - (levelWidth - 1);
            
            // X position: center is 300, spacing depends on level
            const spacing = 400 / levelWidth;
            const x = 300 - (levelWidth * spacing)/2 + (indexInLevel * spacing) + spacing/2;
            const y = 50 + level * levelHeight;

            nds.push({
                id: `node-${i}`,
                position: { x, y },
                data: { label: String(val) },
                style: { background: '#f59e0b', color: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', border: '2px solid #fde68a' }
            });

            if (i > 0) {
                const parent = Math.floor((i - 1) / 2);
                eds.push({
                    id: `edge-${parent}-${i}`,
                    source: `node-${parent}`,
                    target: `node-${i}`,
                    animated: true,
                    style: { stroke: '#fde68a', strokeWidth: 2 }
                });
            }
        });
    } else {
        // BST logic
        const traverse = (node: any, level: number, x: number, parentId: string | null = null, minX: number = 0, maxX: number = 600) => {
            if (!node) return;
            const nodeId = `node-${node.key}`;
            const y = 50 + level * 80;
            
            nds.push({
                id: nodeId,
                position: { x, y },
                data: { label: String(node.key) },
                style: { background: '#3b82f6', color: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', border: '2px solid #bfdbfe' }
            });

            if (parentId) {
                eds.push({
                    id: `edge-${parentId}-${nodeId}`,
                    source: parentId,
                    target: nodeId,
                    animated: true,
                    style: { stroke: '#bfdbfe', strokeWidth: 2 }
                });
            }

            if (node.left) {
                traverse(node.left, level + 1, minX + (x - minX)/2, nodeId, minX, x);
            }
            if (node.right) {
                traverse(node.right, level + 1, x + (maxX - x)/2, nodeId, x, maxX);
            }
        };
        
        traverse(state, 0, 300);
    }
    
    return { nodes: nds, edges: eds };
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

export default TreeVisualizer;
