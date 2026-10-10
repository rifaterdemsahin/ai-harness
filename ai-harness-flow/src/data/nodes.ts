import type { Node } from '@xyflow/react';

export type CardData = {
  title: string;
  color: string;
  bgColor?: string;
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
  // SWIMLANES
  { id: 'l1', type: 'swimlane', position: { x: 0, y: 60 }, style: { width: 1400, height: 140 }, data: { title: 'L1 INGRESS', color: '#7CC4FF', bgColor: 'rgba(124,196,255,0.06)' }, draggable: true },
  { id: 'l2', type: 'swimlane', position: { x: 0, y: 220 }, style: { width: 1400, height: 160 }, data: { title: 'L2 ORCHESTRATION', color: '#F2994A', bgColor: 'rgba(242,153,74,0.06)' }, draggable: true },
  { id: 'l3', type: 'swimlane', position: { x: 0, y: 400 }, style: { width: 1400, height: 160 }, data: { title: 'L3 AI MODELS', color: '#4FD1C5', bgColor: 'rgba(79,209,197,0.06)' }, draggable: true },
  { id: 'l4', type: 'swimlane', position: { x: 0, y: 580 }, style: { width: 1400, height: 290 }, data: { title: 'L4 COMPUTE', color: '#F2994A', bgColor: 'rgba(242,153,74,0.06)' }, draggable: true },
  { id: 'l5', type: 'swimlane', position: { x: 0, y: 890 }, style: { width: 1400, height: 160 }, data: { title: 'L5 TOOLS', color: '#FF8FB8', bgColor: 'rgba(255,143,184,0.06)' }, draggable: true },
  { id: 'l6', type: 'swimlane', position: { x: 0, y: 1080 }, style: { width: 1400, height: 140 }, data: { title: 'L6 DATA SOURCES', color: '#7BD88F', bgColor: 'rgba(123,216,143,0.06)' }, draggable: true },

  // L1 INGRESS
  { id: 'ingress', parentId: 'l1', extent: 'parent', type: 'ingress', position: { x: 560, y: 20 },
    data: { title: 'Discord Chat Interface', color: '#7CC4FF', subtitle: 'User Input & Response Terminal' },
    style: { width: 320, height: 100 }, draggable: true },
    
  // L2 ORCHESTRATION
  { id: 'orchestrator', parentId: 'l2', extent: 'parent', type: 'card', position: { x: 480, y: 40 },
    data: { title: 'HERMESS / GrokBot Orchestrator', color: '#F2994A', badge: { n: 1, emoji: '🦾' }, subtitle: 'Master Controller & Prompt Dispatcher' },
    style: { width: 480, height: 100 }, draggable: true },
    
  // L3 AI MODELS
  { id: 'deepseek', parentId: 'l3', extent: 'parent', type: 'model', position: { x: 80, y: 40 },
    data: { title: 'DeepSeek AI', color: '#4FD1C5', lines: ['$20 / mo', 'Fallback provider'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'xiaomi', parentId: 'l3', extent: 'parent', type: 'model', position: { x: 360, y: 40 },
    data: { title: 'Xiaomi AI', color: '#4FD1C5', lines: ['$20 / mo', 'Main provider'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'hermes-ai', parentId: 'l3', extent: 'parent', type: 'model', position: { x: 640, y: 40 },
    data: { title: 'Hermes AI', color: '#B79CFF', lines: ['$20 / mo', 'Desktop fallback'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'grok', parentId: 'l3', extent: 'parent', type: 'model', position: { x: 920, y: 40 },
    data: { title: 'Grok API', color: '#B79CFF', lines: ['Usage Metered', 'Dev laptop provider'] },
    style: { width: 240, height: 90 }, draggable: true },
    
  // L4 COMPUTE HARDWARE
  { id: 'hetzner', parentId: 'l4', extent: 'parent', type: 'compute', position: { x: 80, y: 20 },
    data: { title: 'Hetzner Main', color: '#F2994A', badge: { n: 2, emoji: '⚙️' }, lines: ['Cloud Linux Node', 'FAST — always-on coordinator'] },
    style: { width: 280, height: 110 }, draggable: true },
  { id: 'macmini', parentId: 'l4', extent: 'parent', type: 'compute', position: { x: 400, y: 20 },
    data: { title: 'Mac Mini Node', color: '#F2994A', lines: ['Local Silicon Edge', 'FAST — Apple Silicon, Obsidian'] },
    style: { width: 280, height: 110 }, draggable: true },
  { id: 'skull', parentId: 'l4', extent: 'parent', type: 'compute', position: { x: 720, y: 20 },
    data: { title: 'Skull Canyon', color: '#F2994A', lines: ['Worker Edge PC', 'Slow — Intel NUC, Docker'] },
    style: { width: 280, height: 110 }, draggable: true },
  { id: 'macbookpro', parentId: 'l4', extent: 'parent', type: 'compute', position: { x: 1040, y: 20 },
    data: { title: 'MacBook Pro', color: '#F2994A', lines: ['Mobile Development', 'FAST — M-series, on-the-go'] },
    style: { width: 280, height: 110 }, draggable: true },
  { id: 'proxmox', parentId: 'l4', extent: 'parent', type: 'compute', position: { x: 80, y: 160 },
    data: { title: 'Proxmox', color: '#F2994A', lines: ['Virtualization Host', 'VM & container workloads'] },
    style: { width: 280, height: 110 }, draggable: true },
    
  // L5 TOOLS
  { id: 'n8n', parentId: 'l5', extent: 'parent', type: 'data', position: { x: 80, y: 30 },
    data: { title: 'n8n Workflows', color: '#FF8FB8', lines: ['Automated Web Actions', 'API endpoints & webhooks'] },
    style: { width: 280, height: 100 }, draggable: true },
  { id: 'azure', parentId: 'l5', extent: 'parent', type: 'data', position: { x: 400, y: 30 },
    data: { title: 'Azure', color: '#FF8FB8', lines: ['Cloud Tools', 'Services & Functions'] },
    style: { width: 280, height: 100 }, draggable: true },
  { id: 'flyio', parentId: 'l5', extent: 'parent', type: 'data', position: { x: 720, y: 30 },
    data: { title: 'Fly.io', color: '#FF8FB8', lines: ['Edge Deployments', 'Global containers'] },
    style: { width: 280, height: 100 }, draggable: true },
  { id: 'github', parentId: 'l5', extent: 'parent', type: 'data', position: { x: 1040, y: 30 },
    data: { title: 'GitHub', color: '#FF8FB8', lines: ['Code & Actions', 'CI/CD Pipelines'] },
    style: { width: 280, height: 100 }, draggable: true },
    
  // L6 DATA SOURCES
  { id: 'obsidian', parentId: 'l6', extent: 'parent', type: 'data', position: { x: 80, y: 20 },
    data: { title: 'Obsidian Brain', color: '#7BD88F', lines: ['Knowledge Vault', 'Second Brain — Markdown + Images'] },
    style: { width: 280, height: 100 }, draggable: true },
  { id: 'qdrant', parentId: 'l6', extent: 'parent', type: 'data', position: { x: 400, y: 20 },
    data: { title: 'Qdrant', color: '#7BD88F', lines: ['Vector Search', 'Semantic context'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'googledrive', parentId: 'l6', extent: 'parent', type: 'data', position: { x: 680, y: 20 },
    data: { title: 'Google Drive', color: '#7BD88F', lines: ['File Storage', 'Cloud sync'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'neo4j', parentId: 'l6', extent: 'parent', type: 'data', position: { x: 960, y: 20 },
    data: { title: 'Neo4j', color: '#7BD88F', lines: ['Graph Database', 'Relations & connections'] },
    style: { width: 240, height: 90 }, draggable: true },
  { id: 'arangodb', parentId: 'l6', extent: 'parent', type: 'data', position: { x: 1240, y: 20 },
    data: { title: 'ArangoDB', color: '#7BD88F', lines: ['Document DB', 'Metadata storage'] },
    style: { width: 240, height: 90 }, draggable: true },
];

const savedNotes = loadNotes();
const savedLinks = loadLinks();
export const initialNodes: AppNode[] = baseNodes.map((n) => ({
  ...n,
  data: { ...n.data, notes: savedNotes[n.id] || DEFAULT_NOTES[n.id] || '', links: savedLinks[n.id] || [] },
}));
