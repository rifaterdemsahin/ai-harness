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
const COST_KEY = 'ai-harness-cost-notes';

function loadNotes(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'); } catch { return {}; }
}
function saveNotes(notes: Record<string, string>) { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); }
function loadLinks(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem(LINKS_KEY) || '{}'); } catch { return {}; }
}
function saveLinks(links: Record<string, string[]>) { localStorage.setItem(LINKS_KEY, JSON.stringify(links)); }
function loadCostNotes(): string {
  try { return localStorage.getItem(COST_KEY) || ''; } catch { return ''; }
}
function saveCostNotes(notes: string) { localStorage.setItem(COST_KEY, notes); }
export { loadNotes, saveNotes, loadLinks, saveLinks, loadCostNotes, saveCostNotes };

export const DEFAULT_NOTES: Record<string, string> = {
  ingress: '[[orchestrator]]',
  orchestrator: '[[deepseek]]\n[[xiaomi]]\n[[hermes-ai]]',
  xiaomi: '[[macmini]]',
};

const baseNodes: AppNode[] = [
  // L1 INGRESS
  { id: 'ingress', type: 'ingress', position: { x: 560, y: 80 },
    data: { title: 'Discord Chat Interface', color: '#7CC4FF', subtitle: 'User Input & Response Terminal' },
    style: { width: 320, height: 100 }, draggable: true },
  // L2 ORCHESTRATION
  { id: 'orchestrator', type: 'card', position: { x: 480, y: 260 },
    data: { title: 'HERMESS / GrokBot Orchestrator', color: '#F2994A', badge: { n: 1, emoji: '\ud83e\uddbe' }, subtitle: 'Master Controller & Prompt Dispatcher' },
    style: { width: 480, height: 100 }, draggable: true },
  // L3 AI MODELS
  { id: 'deepseek', type: 'model', position: { x: 80, y: 440 },
    data: { title: 'DeepSeek AI', color: '#4FD1C5', lines: ['$20 / mo', 'Fallback provider'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'xiaomi', type: 'model', position: { x: 360, y: 440 },
    data: { title: 'Xiaomi AI', color: '#4FD1C5', lines: ['$20 / mo', 'Main provider'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'hermes-ai', type: 'model', position: { x: 640, y: 440 },
    data: { title: 'Hermes AI', color: '#B79CFF', lines: ['$20 / mo', 'Desktop fallback'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'grok', type: 'model', position: { x: 920, y: 440 },
    data: { title: 'Grok API', color: '#B79CFF', lines: ['Usage Metered', 'Dev laptop provider'] },
    style: { width: 240, height: 90 }, draggable: true },
  // L4 COMPUTE HARDWARE
  { id: 'hetzner', type: 'compute', position: { x: 80, y: 600 },
    data: { title: 'Hetzner Main', color: '#F2994A', badge: { n: 2, emoji: '\u2699\ufe0f' }, lines: ['Cloud Linux Node', 'FAST \u2014 always-on coordinator'] },
    style: { width: 280, height: 110 }, draggable: true },
  { id: 'macmini', type: 'compute', position: { x: 400, y: 600 },
    data: { title: 'Mac Mini Node', color: '#F2994A', lines: ['Local Silicon Edge', 'FAST \u2014 Apple Silicon, Obsidian'] },
    style: { width: 280, height: 110 }, draggable: true },
  { id: 'skull', type: 'compute', position: { x: 720, y: 600 },
    data: { title: 'Skull Canyon', color: '#F2994A', lines: ['Worker Edge PC', 'Slow \u2014 Intel NUC, Docker'] },
    style: { width: 280, height: 110 }, draggable: true },
  { id: 'macbookpro', type: 'compute', position: { x: 1040, y: 600 },
    data: { title: 'MacBook Pro', color: '#F2994A', lines: ['Mobile Development', 'FAST \u2014 M-series, on-the-go'] },
    style: { width: 280, height: 110 }, draggable: true },
  { id: 'proxmox', type: 'compute', position: { x: 80, y: 740 },
    data: { title: 'Proxmox', color: '#F2994A', lines: ['Virtualization Host', 'VM & container workloads'] },
    style: { width: 280, height: 110 }, draggable: true },
  // L5 DATA & TOOLS
  { id: 'obsidian', type: 'data', position: { x: 80, y: 920 },
    data: { title: 'Obsidian Brain', color: '#7BD88F', lines: ['Knowledge Vault', 'Second Brain \u2014 Markdown + Images'] },
    style: { width: 280, height: 100 }, draggable: true },
  { id: 'n8n', type: 'data', position: { x: 400, y: 920 },
    data: { title: 'n8n Workflows', color: '#FF8FB8', lines: ['Automated Web Actions', 'API endpoints & webhooks'] },
    style: { width: 280, height: 100 }, draggable: true },
  // L6 DATA SOURCES
  { id: 'qdrant', type: 'data', position: { x: 80, y: 1080 },
    data: { title: 'Qdrant', color: '#7BD88F', lines: ['Vector Search', 'Semantic context'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'googledrive', type: 'data', position: { x: 360, y: 1080 },
    data: { title: 'Google Drive', color: '#7BD88F', lines: ['File Storage', 'Cloud sync'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'neo4j', type: 'data', position: { x: 640, y: 1080 },
    data: { title: 'Neo4j', color: '#7BD88F', lines: ['Graph Database', 'Relations & connections'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'arangodb', type: 'data', position: { x: 920, y: 1080 },
    data: { title: 'ArangoDB', color: '#7BD88F', lines: ['Document DB', 'Metadata storage'] },
    style: { width: 240, height: 90 }, draggable: true },
];

const savedNotes = loadNotes();
const savedLinks = loadLinks();
export const initialNodes: AppNode[] = baseNodes.map((n) => ({
  ...n,
  data: { ...n.data, notes: savedNotes[n.id] || DEFAULT_NOTES[n.id] || '', links: savedLinks[n.id] || [] },
}));
