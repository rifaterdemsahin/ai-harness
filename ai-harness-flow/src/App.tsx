import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  reconnectEdge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
  type Connection,
  type Edge,
  type EdgeTypes,
  type NodeTypes,
  type Node,
  type OnReconnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './theme.css';
import { initialNodes, loadNotes, saveNotes, type AppNode } from './data/nodes';
import {
  dedupeGraphEdges,
  deriveNoteEdges,
  flowToGraphEdges,
  graphToFlowEdges,
  loadGraphEdges,
  nodeColor,
  saveGraphEdges,
} from './data/edgeGraph';
import CardNode from './nodes/CardNode';
import ComputeNode from './nodes/ComputeNode';
import ChannelNode from './nodes/ChannelNode';
import NotesPanel from './nodes/NotesPanel';
import Toolbar from './nodes/Toolbar';
import LabeledEdge from './edges/LabeledEdge';

const nodeTypes: NodeTypes = {
  card: CardNode,
  compute: ComputeNode,
  channel: ChannelNode,
};

// PART 4 — the custom edge renders its label via EdgeLabelRenderer.
const edgeTypes: EdgeTypes = { labeled: LabeledEdge };

const defaultViewport = { x: 0, y: 0, zoom: 0.7 };

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);

  // PART 6 — edges are loaded from localStorage (seeded on first run).
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    graphToFlowEdges(loadGraphEdges(), initialNodes)
  );

  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // PART 6 — autosave edges alongside the notes.
  useEffect(() => {
    saveGraphEdges(flowToGraphEdges(edges));
  }, [edges]);

  // PART 3 — [[node-id]] references in notes become (and stop being) edges.
  const noteEdges = useMemo(() => deriveNoteEdges(nodes), [nodes]);

  // PART 1 — drag from any handle to any other; no self- or duplicate edges.
  const handleConnect = useCallback(
    (params: Connection) => {
      const { source, target } = params;
      if (!source || !target || source === target) return;
      setEdges((eds) => {
        if (eds.some((e) => e.source === source && e.target === target)) return eds;
        const color = nodeColor(nodes, source);
        return addEdge(
          {
            ...params,
            id: `user-${source}-${target}`,
            type: 'labeled',
            label: 'link',
            data: { kind: 'user', color },
            style: { stroke: color, strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color },
          },
          eds
        );
      });
    },
    [nodes, setEdges]
  );

  // PART 4 — drag an endpoint onto another node.
  const handleReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      if (newConnection.source === newConnection.target) return;
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
    },
    [setEdges]
  );

  // PART 4 — double-click an edge to add or edit its label.
  const handleEdgeDoubleClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const current = typeof edge.label === 'string' ? edge.label : '';
      const next = window.prompt('Edge label', current);
      if (next === null) return;
      setEdges((eds) => eds.map((e) => (e.id === edge.id ? { ...e, label: next } : e)));
    },
    [setEdges]
  );

  // PART 3 — deleting a note-derived edge removes its [[ref]] from the note.
  const handleEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const noteRefs = deleted.filter(
        (e) => (e.data as { kind?: string } | undefined)?.kind === 'note'
      );
      if (!noteRefs.length) return;
      setNodes((nds) =>
        nds.map((n) => {
          const refs = noteRefs.filter((d) => d.source === n.id).map((d) => `[[${d.target}]]`);
          if (!refs.length) return n;
          let note = (((n.data as { notes?: string }).notes) || '').trimEnd();
          refs.forEach((ref) => {
            note = note.split(ref).join('');
          });
          note = note.replace(/\n{3,}/g, '\n\n').trim();
          const all = loadNotes();
          all[n.id] = note;
          saveNotes(all);
          return { ...n, data: { ...n.data, notes: note } };
        })
      );
    },
    [setNodes]
  );

  // Persisted edges + note-derived edges, deduped (no duplicate source+target).
  const allEdges = useMemo(
    () => graphToFlowEdges(dedupeGraphEdges([...flowToGraphEdges(edges), ...noteEdges]), nodes),
    [edges, noteEdges, nodes]
  );

  // PART 5 — hovering a node highlights its edges and dims the others.
  const renderedEdges = useMemo(
    () =>
      allEdges.map((e) =>
        hovered
          ? {
              ...e,
              className: e.source === hovered || e.target === hovered ? 'edge-hi' : 'edge-dim',
            }
          : { ...e, className: undefined }
      ),
    [allEdges, hovered]
  );

  const getNodeColor = useCallback((node: AppNode) => {
    return (node.data as { color?: string })?.color ?? '#2B3F66';
  }, []);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as AppNode);
  }, []);

  const handleNoteChange = useCallback(
    (nodeId: string, note: string) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, notes: note } } : n))
      );
    },
    [setNodes]
  );

  const handleLinksChange = useCallback(
    (nodeId: string, links: string[]) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, links } } : n))
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
        onReconnect={handleReconnect}
        onEdgesDelete={handleEdgesDelete}
        onEdgeDoubleClick={handleEdgeDoubleClick}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={(_: React.MouseEvent, node: Node) => setHovered(node.id)}
        onNodeMouseLeave={() => setHovered(null)}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode={['Backspace', 'Delete']}
        connectionLineStyle={{ stroke: '#FF8FB8', strokeWidth: 2, strokeDasharray: '4 4' }}
        fitView
        fitViewOptions={{ padding: 64 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={defaultViewport}
        nodesDraggable
        nodesConnectable
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
          <Toolbar nodes={nodes} edges={allEdges} />
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
