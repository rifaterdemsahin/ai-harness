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
};

export type AppNode = Node<CardData>;

const NOTES_KEY = 'ai-harness-notes';
const LINKS_KEY = 'ai-harness-links';

function loadNotes(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, string>) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function loadLinks(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(LINKS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLinks(links: Record<string, string[]>) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export { loadNotes, saveNotes, loadLinks, saveLinks };

/** Clean notes — no TODOs, no stale instructions. */
export const DEFAULT_NOTES: Record<string, string> = {
  channel: 'Role maps to Category\nChannel maps to Domain-Topic',
  coordinator: 'Reads bot-spec.md to assign compute to bots\nEnsures bots are always running\nMonitors via Grafana, auth via Azure',
  llm: 'Linked to External Providers for model access',
  dataOutput:
    'Rclone (PAP: Pull, Push, Archive)\nArangoDB for metadata\nNeo4j for relations\nDaily push to Qdrant for semantic context',
  dataInputs: 'Mostly Markdown and Images\nSecond Brain on Obsidian (MacBook)',
  external: 'API based usage\nGrok (dev laptop, usage-based pricing)',
  outside: 'Connects to Channel node via [[channel]]',
  desktop: 'Erdem codes locally and uses mobile\nHermes fallback model',
  tools:
    'Connected to Second Brain via [[dataOutput]]\nHermess orchestrates from [[hermess]]',
  hermess: 'Harness Orchestrator\nReads bot-spec.md for coordination\nAssigns compute based on skills and availability\nAzure + Grafana monitoring',
};

const baseNodes: AppNode[] = [
  {
    id: 'compute',
    type: 'compute',
    position: { x: 64, y: 190 },
    data: {
      title: '\u2699\ufe0f Compute',
      color: '#F2994A',
      badge: { n: 2, emoji: '\u2699\ufe0f' },
      toggles: [
        { label: 'XPS', on: false, note: 'stays home \u2192 LLM' },
        { label: 'MacBook', on: false, note: '\u2192 LLM' },
      ],
      lines: [
        'Hetzner VPS \u2192 FAST, coordinator',
        'Mac Mini \u2192 FAST (Apple Silicon)',
        'Skull Canyon \u2192 slow (Intel NUC)',
        'Hermes + GROKBOT on all hosts',
        'Each host has different skills',
      ],
    },
    style: { width: 440, height: 280 },
    draggable: true,
  },
  {
    id: 'coordinator',
    type: 'card',
    position: { x: 64, y: 490 },
    data: {
      title: '',
      color: '#F2994A',
      lines: ['Main coordinator: Hetzner (datacenter)', '\u00b7 reads bot-spec.md, assigns bots to compute', '\u00b7 Azure auth + Grafana monitoring'],
    },
    style: { width: 440, height: 88 },
    draggable: true,
  },
  {
    id: 'llm',
    type: 'card',
    position: { x: 640, y: 190 },
    data: {
      title: '\ud83e\udd16 LLM',
      color: '#7CC4FF',
      lines: ['Receives prompts from Channel', 'Consumes providers from External'],
    },
    style: { width: 200, height: 90 },
    draggable: true,
  },
  {
    id: 'channel',
    type: 'channel',
    position: { x: 640, y: 380 },
    data: {
      title: '\ud83d\udcac CHANNEL \u00b7 Discord',
      color: '#7CC4FF',
      chips: ['Role: Category', 'Channel: Domain-Topic'],
    },
    style: { width: 200, height: 80 },
    draggable: true,
  },
  {
    id: 'dataOutput',
    type: 'card',
    position: { x: 640, y: 560 },
    data: {
      title: '\ud83d\uddc4\ufe0f DATA OUTPUT',
      color: '#7BD88F',
      lines: ['Rclone \u2192 Drive', 'ArangoDB \u00b7 Neo4j', 'Daily push \u2192 Qdrant'],
    },
    style: { width: 200, height: 120 },
    draggable: true,
  },
  {
    id: 'dataInputs',
    type: 'card',
    position: { x: 64, y: 580 },
    data: {
      title: '\ud83e\udde0 Data Inputs',
      color: '#7BD88F',
      badge: { n: 1, emoji: '\ud83e\udde0' },
      lines: ['Mostly Markdown and Images', 'Second Brain \u203a Obsidian (MacBook)'],
    },
    style: { width: 440, height: 250 },
    draggable: true,
  },
  {
    id: 'external',
    type: 'card',
    position: { x: 980, y: 190 },
    data: {
      title: 'External Providers',
      color: '#4FD1C5',
      badge: { n: 4, emoji: '\u2601\ufe0f' },
      lines: [
        'Main: Xiaomi \u00b7 $20',
        'Fallback: DeepSeek \u00b7 $20',
        'Dev laptop: Grok (usage-based)',
        'Desktop: Hermes \u00b7 $20',
        'API based usage',
        '\ud83d\udd11 gives API keys',
        '\u2014\u2014\u2014',
        'Total: $60 / month',
      ],
    },
    style: { width: 396, height: 210 },
    draggable: true,
  },
  {
    id: 'outside',
    type: 'card',
    position: { x: 980, y: 440 },
    data: {
      title: '\ud83c\udf0d Outside world',
      color: '#C9D3E3',
    },
    style: { width: 396, height: 72 },
    draggable: true,
  },
  {
    id: 'desktop',
    type: 'card',
    position: { x: 980, y: 560 },
    data: {
      title: 'Desktop Models',
      color: '#B79CFF',
      badge: { n: 3, emoji: '\ud83d\udcbb' },
      lines: ['Fallback models, not primary', 'Hermes \u00b7 $20', 'Backup \u00b7 Access \u00b7 Runclock'],
    },
    style: { width: 396, height: 250 },
    draggable: true,
  },
  {
    id: 'tools',
    type: 'card',
    position: { x: 64, y: 870 },
    data: {
      title: '\ud83e\ude96 Tools & Skills',
      color: '#FF8FB8',
      lines: [
        'TOOLS (n8n) \u00b7 API (world)',
        'Skills + Compute, Fly.io',
        '+ Azure \u2192 Resource \u2192 Key Vault (Security)',
        'Second Brain integration',
        'Bot spec: bot-spec.md (data source)',
      ],
    },
    style: { width: 1312, height: 130 },
    draggable: true,
  },
  {
    id: 'hermess',
    type: 'card',
    position: { x: 64, y: 1030 },
    data: {
      title: '\ud83e\uddbe HARNESS ORCHESTRATOR',
      color: '#FF8FB8',
      lines: ['GROKBOT + Hermes', 'Reads bot-spec.md for coordination', 'Assigns compute based on skills'],
    },
    style: { width: 1312, height: 90 },
    draggable: true,
  },
];

// Hydrate notes and links from localStorage
const savedNotes = loadNotes();
const savedLinks = loadLinks();
export const initialNodes: AppNode[] = baseNodes.map((n) => ({
  ...n,
  data: {
    ...n.data,
    notes: savedNotes[n.id] || DEFAULT_NOTES[n.id] || '',
    links: savedLinks[n.id] || [],
  },
}));
