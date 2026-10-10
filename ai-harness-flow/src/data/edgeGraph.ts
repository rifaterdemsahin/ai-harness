import { MarkerType, type Edge } from '@xyflow/react';
import type { AppNode } from './nodes';

/**
 * PART 6 — Persistence.
 * Edges live in localStorage next to the notes, seeded from the list below.
 */
export const EDGES_KEY = 'ai-harness-edges';

export type EdgeKind = 'seed' | 'user' | 'note';

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
  color?: string;
  kind: EdgeKind;
};

/** Seed data required by the spec (part 6). */
export const SEED_EDGES: GraphEdge[] = [
  { id: 'seed-compute-llm', source: 'compute', target: 'llm', label: 'compute', kind: 'seed' },
  { id: 'seed-llm-external', source: 'llm', target: 'external', label: 'providers', kind: 'seed' },
  { id: 'seed-hermess-channel', source: 'hermess', target: 'channel', label: 'serves', kind: 'seed' },
  { id: 'seed-hermess-tools', source: 'hermess', target: 'tools', label: 'uses', kind: 'seed' },
  { id: 'seed-inputs-data', source: 'dataInputs', target: 'dataOutput', label: 'ingest', kind: 'seed' },
  { id: 'seed-compute-hermess', source: 'compute', target: 'hermess', label: 'hosts', kind: 'seed' },
  { id: 'seed-coordinator-compute', source: 'coordinator', target: 'compute', label: 'coordinate', kind: 'seed' },
];

/** PART 5 — edge colour inherits from the source node's border colour. */
export function nodeColor(nodes: AppNode[], id: string): string {
  const node = nodes.find((n) => n.id === id);
  return ((node?.data as { color?: string } | undefined)?.color) ?? '#C9D3E3';
}

export function edgeKey(edge: { source: string; target: string }): string {
  return `${edge.source}->${edge.target}`;
}

/** PART 1 — no self-connections and no duplicate edges (same source + target). */
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

/** PART 3 — every [[node-id]] in a note becomes an edge, marked kind: 'note'. */
export function deriveNoteEdges(nodes: AppNode[]): GraphEdge[] {
  const ids = new Set(nodes.map((n) => n.id));
  const out: GraphEdge[] = [];
  nodes.forEach((node) => {
    const note = (((node.data as { notes?: string }).notes) || '');
    const refs = note.match(/\[\[[\w-]+\]\]/g) || [];
    refs.forEach((ref) => {
      const target = ref.slice(2, -2);
      if (!ids.has(target) || target === node.id) return;
      out.push({
        id: `note-${node.id}-${target}`,
        source: node.id,
        target,
        label: 'note ref',
        kind: 'note',
      });
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
  } catch {
    return SEED_EDGES;
  }
}

export function saveGraphEdges(edges: GraphEdge[]) {
  localStorage.setItem(EDGES_KEY, JSON.stringify(edges));
}

/** Graph edges → React Flow edges (styling, arrowheads, note edges dashed). */
export function graphToFlowEdges(graph: GraphEdge[], nodes: AppNode[]): Edge[] {
  const ids = new Set(nodes.map((n) => n.id));
  return graph
    .filter((e) => ids.has(e.source) && ids.has(e.target) && e.source !== e.target)
    .map((e) => {
      const color = e.color || nodeColor(nodes, e.source);
      const dashed = e.kind === 'note';
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
        type: 'labeled',
        animated: dashed,
        label: e.label,
        data: { kind: e.kind, color },
        style: {
          stroke: color,
          strokeWidth: 2,
          ...(dashed ? { strokeDasharray: '6 4' } : {}),
        },
        markerEnd: { type: MarkerType.ArrowClosed, color },
      } as Edge;
    });
}

/** React Flow edges → persistable graph edges. */
export function flowToGraphEdges(edges: Edge[]): GraphEdge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? null,
    targetHandle: e.targetHandle ?? null,
    label: typeof e.label === 'string' ? e.label : undefined,
    color: (e.data as { color?: string } | undefined)?.color,
    kind: ((e.data as { kind?: EdgeKind } | undefined)?.kind) ?? 'user',
  }));
}

/** Human-readable edge list for Copy All / Download. */
export function describeEdges(edges: Edge[]): string[] {
  return edges.map((e) => {
    const kind = (e.data as { kind?: string } | undefined)?.kind ?? 'user';
    const label = typeof e.label === 'string' && e.label ? ` — ${e.label}` : '';
    return `${e.source} → ${e.target}${label} [${kind}]`;
  });
}
