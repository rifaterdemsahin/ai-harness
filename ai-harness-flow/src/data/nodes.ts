import type { Node } from '@xyflow/react';

export type CardData = {
  title: string;
  color: string;
  badge?: { n: number; emoji: string };
  lines?: string[];
  chips?: string[];
  toggles?: { label: string; on: boolean; note?: string }[];
  notes?: string;
  links?: string[];
  subtitle?: string;
};

export type AppNode = Node<CardData>;

const NOTES_KEY = 'ai-harness-notes';
const LINKS_KEY = 'ai-harness-links';

function loadNotes(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'); } catch { return {}; }
}
function saveNotes(notes: Record<string, string>) { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); }
function loadLinks(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem(LINKS_KEY) || '{}'); } catch { return {}; }
}
function saveLinks(links: Record<string, string[]>) { localStorage.setItem(LINKS_KEY, JSON.stringify(links)); }
export { loadNotes, saveNotes, loadLinks, saveLinks };

export const DEFAULT_NOTES: Record<string, string> = {};

const baseNodes: AppNode[] = [
  // L1 INGRESS
  {
    id: 'ingress', type: 'ingress',
    position: { x: 560, y: 80 },
    data: { title: 'Discord Chat Interface', color: '#7CC4FF', subtitle: 'User Input & Response Terminal' },
    style: { width: 320, height: 100 }, draggable: true,
  },
  // L2 ORCHESTRATION
  {
    id: 'orchestrator', type: 'card',
    position: { x: 480, y: 260 },
    data: { title: 'HERMESS / GrokBot Orchestrator', color: '#F2994A', badge: { n: 1, emoji: '\ud83e\uddbe' }, subtitle: 'Master Controller & Prompt Dispatcher' },
    style: { width: 480, height: 100 }, draggable: true,
  },
  // L3 AI MODELS
  {
    id: 'deepseek', type: 'model',
    position: { x: 80, y: 440 },
    data: { title: 'DeepSeek AI', color: '#4FD1C5', lines: ['$20 / mo', 'Fallback provider'] },
    style: { width: 240, height: 90 }, draggable: true,
  },
  {
    id: 'xiaomi', type: 'model',
    position: { x: 360, y: 440 },
    data: { title: 'Xiaomi AI', color: '#4FD1C5', lines: ['$20 / mo', 'Main provider'] },
    style: { width: 240, height: 90 }, draggable: true,
  },
  {
    id: 'hermes-ai', type: 'model',
    position: { x: 640, y: 440 },
    data: { title: 'Hermes AI', color: '#B79CFF', lines: ['$20 / mo', 'Desktop fallback'] },
    style: { width: 240, height: 90 }, draggable: true,
  },
  {
    id: 'grok', type: 'model',
    position: { x: 920, y: 440 },
    data: { title: 'Grok API', color: '#B79CFF', lines: ['Usage Metered', 'Dev laptop provider'] },
    style: { width: 240, height: 90 }, draggable: true,
  },
  // L4 COMPUTE HARDWARE
  {
    id: 'hetzner', type: 'compute',
    position: { x: 120, y: 620 },
    data: { title: 'Hetzner Main', color: '#F2994A', badge: { n: 2, emoji: '\u2699\ufe0f' }, lines: ['Cloud Linux Node', 'FAST \u2014 always-on coordinator'] },
    style: { width: 300, height: 110 }, draggable: true,
  },
  {
    id: 'macmini', type: 'compute',
    position: { x: 480, y: 620 },
    data: { title: 'Mac Mini Node', color: '#F2994A', lines: ['Local Silicon Edge', 'FAST \u2014 Apple Silicon, Obsidian'] },
    style: { width: 300, height: 110 }, draggable: true,
  },
  {
    id: 'skull', type: 'compute',
    position: { x: 840, y: 620 },
    data: { title: 'Skull Canyon', color: '#F2994A', lines: ['Worker Edge PC', 'Slow \u2014 Intel NUC, Docker'] },
    style: { width: 300, height: 110 }, draggable: true,
  },
  // L5 DATA & TOOLS
  {
    id: 'obsidian', type: 'data',
    position: { x: 80, y: 820 },
    data: { title: 'Obsidian Brain', color: '#7BD88F', lines: ['Knowledge Vault', 'Second Brain \u2014 Markdown + Images'] },
    style: { width: 320, height: 100 }, draggable: true,
  },
  {
    id: 'db', type: 'data',
    position: { x: 460, y: 820 },
    data: { title: 'DB Storage', color: '#7BD88F', lines: ['Postgres & Session Memory', 'Neo4j + Qdrant + ArangoDB'] },
    style: { width: 320, height: 100 }, draggable: true,
  },
  {
    id: 'n8n', type: 'data',
    position: { x: 840, y: 820 },
    data: { title: 'n8n Workflows', color: '#FF8FB8', lines: ['Automated Web Actions', 'API endpoints & webhooks'] },
    style: { width: 320, height: 100 }, draggable: true,
  },
];

const savedNotes = loadNotes();
const savedLinks = loadLinks();
export const initialNodes: AppNode[] = baseNodes.map((n) => ({
  ...n,
  data: { ...n.data, notes: savedNotes[n.id] || DEFAULT_NOTES[n.id] || '', links: savedLinks[n.id] || [] },
}));
