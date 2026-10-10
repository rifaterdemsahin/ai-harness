import { MarkerType, type Edge } from '@xyflow/react';
import type { AppNode } from './nodes';

export const EDGES_KEY = 'ai-harness-edges';
export type EdgeKind = 'seed' | 'user' | 'note';
export type GraphEdge = {
  id: string; source: string; target: string;
  sourceHandle?: string | null; targetHandle?: string | null;
  label?: string; color?: string; kind: EdgeKind;
};

export const SEED_EDGES: GraphEdge[] = [
  { id: 'seed-ingress-orch', source: 'ingress', target: 'orchestrator', label: 'Prompts', color: '#7CC4FF', kind: 'seed' },
  { id: 'seed-orch-deepseek', source: 'orchestrator', target: 'deepseek', label: 'Smart Route', color: '#F2994A', kind: 'seed' },
  { id: 'seed-orch-xiaomi', source: 'orchestrator', target: 'xiaomi', label: 'Smart Route', color: '#F2994A', kind: 'seed' },
  { id: 'seed-orch-hermes', source: 'orchestrator', target: 'hermes-ai', label: 'Smart Route', color: '#F2994A', kind: 'seed' },
  { id: 'seed-orch-grok', source: 'orchestrator', target: 'grok', label: 'Smart Route', color: '#F2994A', kind: 'seed' },
  { id: 'seed-deepseek-hetzner', source: 'deepseek', target: 'hetzner', label: 'processes', color: '#4FD1C5', kind: 'seed' },
  { id: 'seed-xiaomi-hetzner', source: 'xiaomi', target: 'hetzner', label: 'processes', color: '#4FD1C5', kind: 'seed' },
  { id: 'seed-hermes-macmini', source: 'hermes-ai', target: 'macmini', label: 'processes', color: '#B79CFF', kind: 'seed' },
  { id: 'seed-grok-skull', source: 'grok', target: 'skull', label: 'processes', color: '#B79CFF', kind: 'seed' },
  { id: 'seed-macmini-obsidian', source: 'macmini', target: 'obsidian', label: 'syncs', color: '#7BD88F', kind: 'seed' },
  { id: 'seed-hetzner-db', source: 'hetzner', target: 'db', label: 'stores', color: '#7BD88F', kind: 'seed' },
  { id: 'seed-skull-n8n', source: 'skull', target: 'n8n', label: 'triggers', color: '#FF8FB8', kind: 'seed' },
];

export function nodeColor(nodes: AppNode[], id: string): string {
  const node = nodes.find((n) => n.id === id);
  return ((node?.data as { color?: string } | undefined)?.color) ?? '#C9D3E3';
}

export function edgeKey(edge: { source: string; target: string }): string {
  return `${edge.source}->${edge.target}`;
}

export function dedupeGraphEdges(edges: GraphEdge[]): GraphEdge[] {
  const seen = new Set<string>();
  const out: GraphEdge[] = [];
  for (const edge of edges) {
    if (!edge.source || !edge.target || edge.source === edge.target) continue;
    const key = edgeKey(edge);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(edge);
  }
  return out;
}

export function deriveNoteEdges(nodes: AppNode[]): GraphEdge[] {
  const ids = new Set(nodes.map((n) => n.id));
  const out: GraphEdge[] = [];
  nodes.forEach((node) => {
    const note = (((node.data as { notes?: string }).notes) || '');
    const refs = note.match(/\[\[[\w-]+\]\]/g) || [];
    refs.forEach((ref) => {
      const target = ref.slice(2, -2);
      if (!ids.has(target) || target === node.id) return;
      out.push({ id: `note-${node.id}-${target}`, source: node.id, target, label: 'note ref', kind: 'note' });
    });
  });
  return out;
}

export function loadGraphEdges(): GraphEdge[] {
  try {
    const raw = JSON.parse(localStorage.getItem(EDGES_KEY) || 'null') as unknown;
    if (!Array.isArray(raw)) return SEED_EDGES;
    const parsed = raw.filter((e): e is GraphEdge => {
      if (!e || typeof e !== 'object') return false;
      const candidate = e as Partial<GraphEdge>;
      return typeof candidate.source === 'string' && typeof candidate.target === 'string';
    });
    return parsed.length ? parsed : SEED_EDGES;
  } catch { return SEED_EDGES; }
}

export function saveGraphEdges(edges: GraphEdge[]) {
  localStorage.setItem(EDGES_KEY, JSON.stringify(edges));
}

export function graphToFlowEdges(graph: GraphEdge[], nodes: AppNode[]): Edge[] {
  const ids = new Set(nodes.map((n) => n.id));
  return graph
    .filter((e) => ids.has(e.source) && ids.has(e.target) && e.source !== e.target)
    .map((e) => {
      const color = e.color || nodeColor(nodes, e.source);
      const dashed = e.kind === 'note' || e.id.includes('obsidian');
      return {
        id: e.id, source: e.source, target: e.target,
        sourceHandle: e.sourceHandle ?? undefined, targetHandle: e.targetHandle ?? undefined,
        type: 'labeled', animated: dashed, label: e.label,
        data: { kind: e.kind, color },
        style: { stroke: color, strokeWidth: 2, ...(dashed ? { strokeDasharray: '6 4' } : {}) },
        markerEnd: { type: MarkerType.ArrowClosed, color },
      } as Edge;
    });
}

export function flowToGraphEdges(edges: Edge[]): GraphEdge[] {
  return edges.map((e) => ({
    id: e.id, source: e.source, target: e.target,
    sourceHandle: e.sourceHandle ?? null, targetHandle: e.targetHandle ?? null,
    label: typeof e.label === 'string' ? e.label : undefined,
    color: (e.data as { color?: string } | undefined)?.color,
    kind: ((e.data as { kind?: EdgeKind } | undefined)?.kind) ?? 'user',
  }));
}

export function describeEdges(edges: Edge[]): string[] {
  return edges.map((e) => {
    const kind = (e.data as { kind?: string } | undefined)?.kind ?? 'user';
    const label = typeof e.label === 'string' && e.label ? ` \u2014 ${e.label}` : '';
    return `${e.source} \u2192 ${e.target}${label} [${kind}]`;
  });
}
