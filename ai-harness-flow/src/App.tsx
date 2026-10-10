import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './theme.css';
import { initialNodes, type AppNode } from './data/nodes';
import { initialEdges } from './data/edges';
import CardNode from './nodes/CardNode';
import ComputeNode from './nodes/ComputeNode';
import ChannelNode from './nodes/ChannelNode';

const nodeTypes: NodeTypes = {
  card: CardNode,
  compute: ComputeNode,
  channel: ChannelNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 0.7 };

const App: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const getNodeColor = useCallback((node: AppNode) => {
    return (node.data as { color?: string })?.color ?? '#2B3F66';
  }, []);

  return (
    <div style={{ width: '100%', height: '100dvh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
    </div>
  );
};

export default App;