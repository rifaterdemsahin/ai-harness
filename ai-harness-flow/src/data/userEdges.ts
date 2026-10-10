import { MarkerType, type Edge } from '@xyflow/react';
import type { AppNode } from './nodes';

/** A connection the user drew by dragging handle → handle on the canvas. */
export type UserEdge = { id: string; source: string; target: string; label?: string };

const EDGES_KEY = 'ai-harness-user-edges';

export const USER_EDGE_COLOR = '#FF8FB8';

export function loadUserEdges(): UserEdge[] {
  try {
    const raw = JSON.parse(localStorage.getItem(EDGES_KEY) || '[]') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter((e): e is UserEdge => {
      if (!e || typeof e !== 'object') return false;
      const candidate = e as Partial<UserEdge>;
      return typeof candidate.source === 'string' && typeof candidate.target === 'string';
    });
  } catch {
    return [];
  }
}

export function saveUserEdges(edges: UserEdge[]) {
  localStorage.setItem(EDGES_KEY, JSON.stringify(edges));
}

/** Render user-drawn connections as solid pink edges. Click one to remove it. */
export function buildUserEdges(userEdges: UserEdge[], nodes: AppNode[]): Edge[] {
  const ids = new Set(nodes.map((n) => n.id));
  return userEdges
    .filter((e) => ids.has(e.source) && ids.has(e.target) && e.source !== e.target)
    .map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      label: e.label ?? 'link',
      style: { stroke: USER_EDGE_COLOR, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: USER_EDGE_COLOR },
      labelStyle: { fill: USER_EDGE_COLOR, fontWeight: 500, fontSize: 10 },
    }));
}
