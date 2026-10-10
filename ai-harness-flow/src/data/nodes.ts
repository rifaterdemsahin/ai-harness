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

/** Notes shipped with the diagram. A note saved in localStorage always wins. */
export const DEFAULT_NOTES: Record<string, string> = {
  coordinator: 'MAKES SURE THE BOTS ARE ALWAYS RUNNING WITH THE COMPUTE',
  llm: 'this node is linked to external providers',
  dataOutput:
    'RCLONE RUNS WITH PAP COMMAND\nPAP PULL PUSH ARCHIEVE\nARANGO DB FOR METADATA\nNEO4J FOR THE RELATIONS\nDAILY PUSH WITH PAP\nQDRANT SEMANTIC FOR PROPER CONTEXT LOAD',
  dataInputs: 'MOSTLY MARKDOWN AND IMAGES',
  external:
    'Api BASED USAGE!\nAlibaba is Qwen · Gemini removed · Som removed\nTotal: $40/mo (Xiaomi $20 + DeepSeek $20)',
  outside: 'CONNECT TO THE CHANNELS NODE',
  desktop: 'ERDEM CODES LOCALLY\nERDEM USES ON THE MOBILE PHONE\nGROKBOT removed',
  tools:
    'CONNECT TO SECOND BRAIN\nCONNECT THIS TO A NEW NODE CALLED HERMESS AT THE BOTTOM AND IT SHOULD HAVE GROKBOT',
  hermess: 'GROKBOT lives here',
};

const baseNodes: AppNode[] = [
  {
    id: 'compute',
    type: 'compute',
    position: { x: 64, y: 190 },
    data: {
      title: '⚙️ Compute',
      color: '#F2994A',
      badge: { n: 2, emoji: '⚙️' },
      toggles: [
        { label: 'XPS', on: false, note: 'stays home → LLM' },
        { label: 'MacBook', on: false, note: '→ LLM' },
      ],
      lines: [
        'Hetzner ON → FAST, main coordinator',
        'Mac Mini ON → FAST',
        'Skull Canyon ON → slow',
        'XPS · MacBook · stays home → LLM',
      ],
    },
    style: { width: 440, height: 250 },
    draggable: true,
  },
  {
    id: 'coordinator',
    type: 'card',
    position: { x: 64, y: 460 },
    data: {
      title: '',
      color: '#F2994A',
      lines: ['Main coordinator: Hetzner (datacenter)', '· assigns hosts'],
    },
    style: { width: 440, height: 72 },
    draggable: true,
  },
  {
    id: 'llm',
    type: 'card',
    position: { x: 640, y: 190 },
    data: {
      title: '🤖 LLM',
      color: '#7CC4FF',
    },
    style: { width: 200, height: 80 },
    draggable: true,
  },
  {
    id: 'channel',
    type: 'channel',
    position: { x: 640, y: 380 },
    data: {
      title: '💬 CHANNEL · Discord',
      color: '#7CC4FF',
      chips: ['Role', 'Domain', 'Topic', 'Groups', 'Bots'],
    },
    style: { width: 200, height: 80 },
    draggable: true,
  },
  {
    id: 'dataOutput',
    type: 'card',
    position: { x: 640, y: 560 },
    data: {
      title: '🗄️ DATA OUTPUT',
      color: '#7BD88F',
      lines: ['Rclone → Drive', 'ArangoDB · Neo4j', 'Daily push → Qdrant'],
    },
    style: { width: 200, height: 120 },
    draggable: true,
  },
  {
    id: 'dataInputs',
    type: 'card',
    position: { x: 64, y: 560 },
    data: {
      title: '🧠 Data Inputs',
      color: '#7BD88F',
      badge: { n: 1, emoji: '🧠' },
      lines: ['One data input', "Second Brain › Obsidian (MacBook)"],
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
      badge: { n: 4, emoji: '☁️' },
      lines: [
        'Main: Xiaomi · $20',
        'Fallback: DeepSeek · $20',
        'Alibaba = Qwen',
        'Dev laptop provider: Grok',
        'API based usage!',
        '🔑 gives API keys',
        '———',
        'Total: $40 / month',
      ],
    },
    style: { width: 396, height: 190 },
    draggable: true,
  },
  {
    id: 'outside',
    type: 'card',
    position: { x: 980, y: 428 },
    data: {
      title: '🌍 Outside world',
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
      badge: { n: 3, emoji: '💻' },
      lines: ['Not primary · fallback models', '$20 Hermes', 'Backup · Access · Runclock'],
    },
    style: { width: 396, height: 250 },
    draggable: true,
  },
  {
    id: 'tools',
    type: 'card',
    position: { x: 64, y: 870 },
    data: {
      title: '🛠️ Tools & Skills',
      color: '#FF8FB8',
      lines: [
        'TOOLS (n8n) · API (world)',
        'Skills + Compute, Fly.io',
        '+ Azure → Resource → Key Vault (Security)',
      ],
    },
    style: { width: 1312, height: 110 },
    draggable: true,
  },
  {
    id: 'hermess',
    type: 'card',
    position: { x: 64, y: 1020 },
    data: {
      title: '🦾 HERMESS',
      color: '#FF8FB8',
      lines: ['GROKBOT'],
    },
    style: { width: 396, height: 90 },
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