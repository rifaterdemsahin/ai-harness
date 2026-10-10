import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './theme.css';
import { initialNodes, type AppNode } from './data/nodes';
import { initialEdges } from './data/edges';
import CardNode from './nodes/CardNode';
import ComputeNode from './nodes/ComputeNode';
import ChannelNode from './nodes/ChannelNode';
import NotesPanel from './nodes/NotesPanel';

const nodeTypes: NodeTypes = {
  card: CardNode,
  compute: ComputeNode,
  channel: ChannelNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 0.7 };

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);

  const getNodeColor = useCallback((node: AppNode) => {
    return (node.data as { color?: string })?.color ?? '#2B3F66';
  }, []);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node as AppNode);
    },
    []
  );

  const handleNoteChange = useCallback(
    (nodeId: string, note: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, notes: note } } : n
        )
      );
    },
    [setNodes]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div style={{ width: '100%', height: '100dvh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 64 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={defaultViewport}
        deleteKeyCode={null}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#ffffff" gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={getNodeColor}
          maskColor="rgba(14, 22, 38, 0.75)"
          style={{ background: '#16223A' }}
        />
        <Panel position="top-left">
          <div className="header-panel">
            <h1>AI HARNESS</h1>
            <div className="subtitle">Architecture Overview</div>
            <div className="tagline">
              Our job: <strong>Delivery Pilot</strong> · start from real, deliver value
            </div>
          </div>
        </Panel>
      </ReactFlow>

      <NotesPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onNoteChange={handleNoteChange}
      />
    </div>
  );
};

export default App;