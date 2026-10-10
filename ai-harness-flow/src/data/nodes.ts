import type { Node } from '@xyflow/react';

export type CardData = {
  title: string;
  color: string;
  badge?: { n: number; emoji: string };
  lines?: string[];
  chips?: string[];
  toggles?: { label: string; on: boolean; note?: string }[];
};

export type AppNode = Node<CardData>;

export const initialNodes: AppNode[] = [
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
        'Mac Mini ON → FAST',
        'Skull Canyon ON → slow',
        'Hetzner ON → FAST, main coordinator',
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
        'Main: Xiaomi',
        'Fallback: DeepSeek',
        'Alibaba · $20',
        'Dev laptop provider: Grok',
        'Gemini · Google Flow · $20',
        'Som',
        '🔑 gives API keys',
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
      lines: [
        'Not primary · fallback models',
        '$20 Hermes',
        'GROKBOT (Runner)',
        'Backup · Access · Runclock',
      ],
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
];