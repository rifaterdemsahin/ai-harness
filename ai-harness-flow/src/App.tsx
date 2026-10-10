import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
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
import Toolbar from './nodes/Toolbar';
import { buildUserEdges, loadUserEdges, saveUserEdges, type UserEdge } from './data/userEdges';

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
  const [userEdges, setUserEdges] = useState<UserEdge[]>(() => loadUserEdges());

  // Drag from a handle to another box to draw your own connection.
  const handleConnect = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;
      if (!source || !target || source === target) return;
      const id = `user-${source}-${target}`;
      const next = [
        ...userEdges.filter((e) => e.id !== id),
        { id, source, target, label: 'link' },
      ];
      setUserEdges(next);
      saveUserEdges(next);
    },
    [userEdges]
  );

  // Click a user-drawn edge to remove it.
  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      if (!edge.id.startsWith('user-')) return;
      const next = userEdges.filter((e) => e.id !== edge.id);
      setUserEdges(next);
      saveUserEdges(next);
    },
    [userEdges]
  );

  const drawnEdges = useMemo(() => buildUserEdges(userEdges, nodes), [userEdges, nodes]);
  const renderedEdges = useMemo(() => [...edges, ...drawnEdges], [edges, drawnEdges]);

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

  const handleLinksChange = useCallback(
    (nodeId: string, links: string[]) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, links } } : n
        )
      );
    },
    [setNodes]
  );

  const handleNavigateToNode = useCallback(
    (nodeId: string) => {
      const target = nodes.find((n) => n.id === nodeId);
      if (target) setSelectedNode(target);
    },
    [nodes]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div style={{ width: '100%', height: '100dvh' }}>
      <ReactFlow
        nodes={nodes}
        edges={renderedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onEdgeClick={handleEdgeClick}
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
        nodesConnectable
        connectionLineStyle={{ stroke: '#FF8FB8', strokeWidth: 2, strokeDasharray: '4 4' }}
        elementsSelectable
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
        <Panel position="top-right">
          <Toolbar nodes={nodes} />
        </Panel>
      </ReactFlow>

      <NotesPanel
        node={selectedNode}
        allNodes={nodes}
        onClose={() => setSelectedNode(null)}
        onNoteChange={handleNoteChange}
        onLinksChange={handleLinksChange}
        onNavigateToNode={handleNavigateToNode}
      />
    </div>
  );
};

export default App;