import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, Panel,
  addEdge, reconnectEdge, useNodesState, useEdgesState,
  ConnectionMode, MarkerType,
  type Connection, type Edge, type EdgeTypes, type NodeTypes, type Node, type OnReconnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './theme.css';
import { initialNodes, loadNotes, saveNotes, loadCostNotes, saveCostNotes, type AppNode } from './data/nodes';
import { dedupeGraphEdges, deriveNoteEdges, flowToGraphEdges, graphToFlowEdges, loadGraphEdges, nodeColor, saveGraphEdges } from './data/edgeGraph';
import CardNode from './nodes/CardNode';
import ComputeNode from './nodes/ComputeNode';
import IngressNode from './nodes/IngressNode';
import ModelNode from './nodes/ModelNode';
import DataNode from './nodes/DataNode';
import NotesPanel from './nodes/NotesPanel';
import Toolbar from './nodes/Toolbar';
import LabeledEdge from './edges/LabeledEdge';
import SwimlaneNode from './nodes/SwimlaneNode';

const APP_VERSION = '1.6.0';

const FILTER_MAP: Record<string, string[]> = {
  'Chat Prompt Loop': ['ingress', 'orchestrator'],
  'Model Dispatch': ['orchestrator', 'deepseek', 'xiaomi', 'hermes-ai', 'grok'],
  'Compute Execution': ['deepseek', 'xiaomi', 'hermes-ai', 'grok', 'hetzner', 'macmini', 'skull', 'macbookpro', 'proxmox'],
  'Memory & Tools': ['macmini', 'skull', 'obsidian', 'n8n', 'qdrant', 'googledrive', 'neo4j', 'arangodb'],
};

const nodeTypes: NodeTypes = { card: CardNode, compute: ComputeNode, ingress: IngressNode, model: ModelNode, data: DataNode, swimlane: SwimlaneNode };
const edgeTypes: EdgeTypes = { labeled: LabeledEdge };
const defaultViewport = { x: 0, y: 0, zoom: 0.55 };



const LEGEND = [
  { label: 'Ingress', color: '#7CC4FF' },
  { label: 'Controller', color: '#F2994A' },
  { label: 'AI Models', color: '#4FD1C5' },
  { label: 'Compute', color: '#F2994A' },
  { label: 'Tools', color: '#FF8FB8' },
  { label: 'Data', color: '#7BD88F' },
];

const COST_BREAKDOWN = [
  { name: 'DeepSeek', cost: '$20/mo' },
  { name: 'Xiaomi', cost: '$20/mo' },
  { name: 'Hermes', cost: '$20/mo' },
  { name: 'Grok', cost: 'Usage-based' },
];

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(graphToFlowEdges(loadGraphEdges(), initialNodes));
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All Components');
  const [showCostModal, setShowCostModal] = useState(false);
  const [costNotes, setCostNotes] = useState(loadCostNotes());
  const [costs, setCosts] = useState(() => {
    try {
      const saved = localStorage.getItem('ai-harness-costs');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return COST_BREAKDOWN;
  });
  
  const handleCostChange = (idx: number, newCost: string) => {
    const updated = [...costs];
    updated[idx].cost = newCost;
    setCosts(updated);
    localStorage.setItem('ai-harness-costs', JSON.stringify(updated));
  };

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

  // Delete node + connected edges
  const handleDuplicateNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const nodeToDuplicate = nds.find((n) => n.id === nodeId);
      if (!nodeToDuplicate) return nds;
      const newId = `${nodeId}-copy-${Date.now()}`;
      const newNode = {
        ...nodeToDuplicate,
        id: newId,
        position: { x: nodeToDuplicate.position.x + 40, y: nodeToDuplicate.position.y + 40 },
        selected: false,
      };
      return [...nds, newNode];
    });
  }, [setNodes]);

  const handleParentChange = useCallback((nodeId: string, parentId: string) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, parentId, extent: parentId ? 'parent' : undefined } : n));
  }, [setNodes]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  // Edit node title
  const handleEditTitle = useCallback((nodeId: string, title: string) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, title } } : n));
  }, [setNodes]);

  // Edit node lines
  const handleEditLines = useCallback((nodeId: string, lines: string[]) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, lines } } : n));
  }, [setNodes]);

  const allEdges = useMemo(() => graphToFlowEdges(dedupeGraphEdges([...flowToGraphEdges(edges), ...noteEdges]), nodes), [edges, noteEdges, nodes]);

  const filteredNodeIds = useMemo(() => {
    if (activeFilter === 'All Components') return null;
    return new Set(FILTER_MAP[activeFilter] || []);
  }, [activeFilter]);

  const renderedEdges = useMemo(() => {
    return allEdges.map((e) => {
      let className = '';
      if (hovered) { className = e.source === hovered || e.target === hovered ? 'edge-hi' : 'edge-dim'; }
      else if (filteredNodeIds) { className = (filteredNodeIds.has(e.source) || filteredNodeIds.has(e.target)) ? 'edge-hi' : 'edge-dim'; }
      return { ...e, className: className || undefined };
    });
  }, [allEdges, hovered, filteredNodeIds]);

  const getNodeColor = useCallback((node: AppNode) => (node.data as { color?: string })?.color ?? '#2B3F66', []);
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => { setSelectedNode(node as AppNode); }, []);
  const handleNoteChange = useCallback((nodeId: string, note: string) => { setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, notes: note } } : n))); }, [setNodes]);
  const handleLinksChange = useCallback((nodeId: string, links: string[]) => { setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, links } } : n))); }, [setNodes]);
  const handleNavigateToNode = useCallback((nodeId: string) => { const target = nodes.find((n) => n.id === nodeId); if (target) setSelectedNode(target); }, [nodes]);
  const handlePaneClick = useCallback(() => { setSelectedNode(null); }, []);
  const handleCostNoteSave = useCallback((note: string) => { setCostNotes(note); saveCostNotes(note); }, []);

  return (
    <div style={{ width: '100%', height: '100dvh' }}>
      <ReactFlow
        nodes={nodes.map((n) => ({ ...n, className: filteredNodeIds && !filteredNodeIds.has(n.id) ? 'node-dim' : hovered && hovered !== n.id ? 'node-dim' : undefined }))}
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
        minZoom={0.2} maxZoom={1.5} defaultViewport={defaultViewport}
        nodesDraggable nodesConnectable elementsSelectable
        proOptions={{ hideAttribution: true }}
        panOnScroll={true}
        selectionOnDrag={true}
      >
        <Background color="#ffffff" gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap nodeColor={getNodeColor} maskColor="rgba(14, 22, 38, 0.75)" style={{ background: '#16223A' }} />

        

        {/* Header */}
        <Panel position="top-left">
          <div className="header-panel">
            <h1>AI Harness Architecture <span className="version-badge">v{APP_VERSION}</span></h1>
            <div className="subtitle">Interactive Workflow & Stack Decomposition</div>
          </div>
        </Panel>

        {/* Cost badge */}
        <Panel position="top-right" style={{ top: 12, right: 12 }}>
          <div className="cost-badge" onClick={() => setShowCostModal(true)} style={{ cursor: 'pointer' }}>
            Fixed Model Cost: $60/mo
          </div>
        </Panel>

        {/* Filter pills */}
        <Panel position="top-right" style={{ top: 48 }}>
          <div className="filter-pills">
            {['All Components', ...Object.keys(FILTER_MAP)].map((f) => (
              <button key={f} className={`filter-pill ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>
        </Panel>

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

      <NotesPanel node={selectedNode} allNodes={nodes} edges={allEdges} onClose={() => setSelectedNode(null)} onNoteChange={handleNoteChange} onLinksChange={handleLinksChange} onNavigateToNode={handleNavigateToNode} onDelete={handleDeleteNode} onEditTitle={handleEditTitle} onEditLines={handleEditLines} onDuplicate={handleDuplicateNode} onParentChange={handleParentChange} />

      {/* Cost Modal */}
      {showCostModal && (
        <div className="modal-overlay" onClick={() => setShowCostModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ color: '#7BD88F', margin: 0 }}>Model Cost Breakdown</h2>
              <button className="notes-btn close-btn" onClick={() => setShowCostModal(false)}>&#x2715;</button>
            </div>
            <div className="cost-table">
              {COST_BREAKDOWN.map((item) => (
                <div key={item.name} className="cost-row">
                  <span>{item.name}</span>
                  <span className="cost-value">{item.cost}</span>
                </div>
              ))}
              <div className="cost-row cost-total">
                <span>Total Fixed</span>
                <span className="cost-value">$60/mo + Grok usage</span>
              </div>
            </div>
            <div className="cost-notes-section">
              <label style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, display: 'block' }}>Cost Notes</label>
              <textarea className="notes-textarea" value={costNotes} onChange={(e) => setCostNotes(e.target.value)} onBlur={() => handleCostNoteSave(costNotes)} placeholder="Add notes about costs..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
