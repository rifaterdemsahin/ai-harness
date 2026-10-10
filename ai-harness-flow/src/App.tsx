import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, Panel,
  addEdge, reconnectEdge, useNodesState, useEdgesState,
  ConnectionMode, MarkerType,
  type Connection, type Edge, type EdgeTypes, type NodeTypes, type Node, type OnReconnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './theme.css';
import { initialNodes, loadNotes, saveNotes, type AppNode } from './data/nodes';
import { dedupeGraphEdges, deriveNoteEdges, flowToGraphEdges, graphToFlowEdges, loadGraphEdges, nodeColor, saveGraphEdges } from './data/edgeGraph';
import CardNode from './nodes/CardNode';
import ComputeNode from './nodes/ComputeNode';
import IngressNode from './nodes/IngressNode';
import ModelNode from './nodes/ModelNode';
import DataNode from './nodes/DataNode';
import NotesPanel from './nodes/NotesPanel';
import Toolbar from './nodes/Toolbar';
import LabeledEdge from './edges/LabeledEdge';

const APP_VERSION = '1.5.0';

const FILTER_MAP: Record<string, string[]> = {
  'Chat Prompt Loop': ['ingress', 'orchestrator'],
  'Model Dispatch': ['orchestrator', 'deepseek', 'xiaomi', 'hermes-ai', 'grok'],
  'Compute Execution': ['deepseek', 'xiaomi', 'hermes-ai', 'grok', 'hetzner', 'macmini', 'skull'],
  'Memory & Tools': ['macmini', 'skull', 'obsidian', 'db', 'n8n'],
};

const nodeTypes: NodeTypes = { card: CardNode, compute: ComputeNode, ingress: IngressNode, model: ModelNode, data: DataNode };
const edgeTypes: EdgeTypes = { labeled: LabeledEdge };
const defaultViewport = { x: 0, y: 0, zoom: 0.65 };

const LAYERS = [
  { label: 'L1 INGRESS', y: 80 },
  { label: 'L2 ORCHESTRATION', y: 260 },
  { label: 'L3 AI MODELS', y: 440 },
  { label: 'L4 COMPUTE HARDWARE', y: 620 },
  { label: 'L5 DATA & TOOLS', y: 820 },
];

const LEGEND = [
  { label: 'Ingress & Storage', color: '#7CC4FF' },
  { label: 'Master Controller', color: '#F2994A' },
  { label: 'AI Model Engine', color: '#4FD1C5' },
  { label: 'Compute Hardware', color: '#F2994A' },
];

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(graphToFlowEdges(loadGraphEdges(), initialNodes));
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All Components');

  useEffect(() => { saveGraphEdges(flowToGraphEdges(edges)); }, [edges]);
  const noteEdges = useMemo(() => deriveNoteEdges(nodes), [nodes]);

  const handleConnect = useCallback((params: Connection) => {
    const { source, target } = params;
    if (!source || !target || source === target) return;
    setEdges((eds) => {
      if (eds.some((e) => e.source === source && e.target === target)) return eds;
      const color = nodeColor(nodes, source);
      return addEdge({ ...params, id: `user-${source}-${target}`, type: 'labeled', label: 'link', data: { kind: 'user', color }, style: { stroke: color, strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color } }, eds);
    });
  }, [nodes, setEdges]);

  const handleReconnect: OnReconnect = useCallback((oldEdge, newConnection) => {
    if (newConnection.source === newConnection.target) return;
    setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
  }, [setEdges]);

  const handleEdgesDelete = useCallback((deleted: Edge[]) => {
    const noteRefs = deleted.filter((e) => (e.data as { kind?: string } | undefined)?.kind === 'note');
    if (!noteRefs.length) return;
    setNodes((nds) => nds.map((n) => {
      const refs = noteRefs.filter((d) => d.source === n.id).map((d) => `[[${d.target}]]`);
      if (!refs.length) return n;
      let note = (((n.data as { notes?: string }).notes) || '').trimEnd();
      refs.forEach((ref) => { note = note.split(ref).join(''); });
      note = note.replace(/\n{3,}/g, '\n\n').trim();
      const all = loadNotes(); all[n.id] = note; saveNotes(all);
      return { ...n, data: { ...n.data, notes: note } };
    }));
  }, [setNodes]);

  const allEdges = useMemo(() => graphToFlowEdges(dedupeGraphEdges([...flowToGraphEdges(edges), ...noteEdges]), nodes), [edges, noteEdges, nodes]);

  const filteredNodeIds = useMemo(() => {
    if (activeFilter === 'All Components') return null;
    return new Set(FILTER_MAP[activeFilter] || []);
  }, [activeFilter]);

  const renderedEdges = useMemo(() => {
    return allEdges.map((e) => {
      let className = '';
      if (hovered) {
        className = e.source === hovered || e.target === hovered ? 'edge-hi' : 'edge-dim';
      } else if (filteredNodeIds) {
        const connected = filteredNodeIds.has(e.source) || filteredNodeIds.has(e.target);
        className = connected ? 'edge-hi' : 'edge-dim';
      }
      return { ...e, className: className || undefined };
    });
  }, [allEdges, hovered, filteredNodeIds]);

  const getNodeColor = useCallback((node: AppNode) => (node.data as { color?: string })?.color ?? '#2B3F66', []);
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => { setSelectedNode(node as AppNode); }, []);
  const handleNoteChange = useCallback((nodeId: string, note: string) => { setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, notes: note } } : n))); }, [setNodes]);
  const handleLinksChange = useCallback((nodeId: string, links: string[]) => { setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, links } } : n))); }, [setNodes]);
  const handleNavigateToNode = useCallback((nodeId: string) => { const target = nodes.find((n) => n.id === nodeId); if (target) setSelectedNode(target); }, [nodes]);
  const handlePaneClick = useCallback(() => { setSelectedNode(null); }, []);

  return (
    <div style={{ width: '100%', height: '100dvh' }}>
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          className: filteredNodeIds && !filteredNodeIds.has(n.id) ? 'node-dim' : hovered && hovered !== n.id ? 'node-dim' : undefined,
        }))}
        edges={renderedEdges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={handleConnect} onReconnect={handleReconnect}
        onEdgesDelete={handleEdgesDelete} onNodeClick={handleNodeClick}
        onNodeMouseEnter={(_: React.MouseEvent, node: Node) => setHovered(node.id)}
        onNodeMouseLeave={() => setHovered(null)}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes} edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode={['Backspace', 'Delete']}
        connectionLineStyle={{ stroke: '#FF8FB8', strokeWidth: 2, strokeDasharray: '4 4' }}
        fitView fitViewOptions={{ padding: 64 }}
        minZoom={0.3} maxZoom={1.5} defaultViewport={defaultViewport}
        nodesDraggable nodesConnectable elementsSelectable
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#ffffff" gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap nodeColor={getNodeColor} maskColor="rgba(14, 22, 38, 0.75)" style={{ background: '#16223A' }} />

        {/* Layer labels */}
        <Panel position="top-left" style={{ top: 0, left: 0, pointerEvents: 'none' }}>
          <div className="layer-labels">
            {LAYERS.map((l) => <div key={l.label} className="layer-label">{l.label}</div>)}
          </div>
        </Panel>

        {/* Header */}
        <Panel position="top-left">
          <div className="header-panel">
            <h1>AI Harness Architecture <span className="version-badge">v{APP_VERSION}</span></h1>
            <div className="subtitle">Interactive Workflow & Stack Decomposition</div>
          </div>
        </Panel>

        {/* Cost badge */}
        <Panel position="top-right" style={{ top: 12, right: 12 }}>
          <div className="cost-badge">Fixed Model Cost: $60/mo</div>
        </Panel>

        {/* Filter pills */}
        <Panel position="top-right" style={{ top: 48 }}>
          <div className="filter-pills">
            {['All Components', ...Object.keys(FILTER_MAP)].map((f) => (
              <button key={f} className={`filter-pill ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </Panel>

        {/* Toolbar */}
        <Panel position="top-right" style={{ top: 90 }}>
          <Toolbar nodes={nodes} edges={allEdges} />
        </Panel>

        {/* Legend */}
        <Panel position="bottom-center">
          <div className="legend">
            {LEGEND.map((item) => (
              <div key={item.label} className="legend-item">
                <span className="legend-dot" style={{ background: item.color }} />
                <span className="legend-label">{item.label}</span>
              </div>
            ))}
          </div>
        </Panel>
      </ReactFlow>

      <NotesPanel node={selectedNode} allNodes={nodes} edges={allEdges} onClose={() => setSelectedNode(null)} onNoteChange={handleNoteChange} onLinksChange={handleLinksChange} onNavigateToNode={handleNavigateToNode} />
    </div>
  );
};

export default App;
