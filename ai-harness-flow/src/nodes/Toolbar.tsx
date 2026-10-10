import React, { useState } from 'react';
import type { AppNode } from '../data/nodes';
import { loadNotes, loadLinks } from '../data/nodes';

interface ToolbarProps {
  nodes: AppNode[];
}

const Toolbar: React.FC<ToolbarProps> = ({ nodes }) => {
  const [copiedAll, setCopiedAll] = useState(false);

  const getFullExport = (): string => {
    const notes = loadNotes();
    const links = loadLinks();
    const lines: string[] = ['# AI Harness — Architecture Notes', ''];

    for (const node of nodes) {
      const data = node.data as { title?: string; lines?: string[]; chips?: string[]; toggles?: { label: string; on: boolean; note?: string }[] };
      const note = notes[node.id] || '';
      const nodeLinks = links[node.id] || [];

      if (!note && nodeLinks.length === 0) continue;

      lines.push(`## ${data.title || node.id}`);
      lines.push('');

      if (data.lines?.length) {
        data.lines.forEach((l) => lines.push(`- ${l}`));
        lines.push('');
      }

      if (nodeLinks.length > 0) {
        lines.push('**Links:**');
        nodeLinks.forEach((url) => lines.push(`- ${url}`));
        lines.push('');
      }

      if (note) {
        lines.push('**Notes:**');
        lines.push(note);
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    }

    return lines.join('\n');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(getFullExport()).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const handleDownload = () => {
    const content = getFullExport();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-harness-notes.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const notesCount = nodes.filter((n) => {
    const notes = loadNotes();
    return notes[n.id]?.trim();
  }).length;

  return (
    <div className="toolbar">
      <button className="toolbar-btn" onClick={handleCopyAll} title="Copy all notes + node data">
        {copiedAll ? '✓ Copied' : '📋 Copy All'}
      </button>
      <button className="toolbar-btn" onClick={handleDownload} title="Download notes as Markdown">
        ⬇ Download
      </button>
      {notesCount > 0 && <span className="toolbar-badge">{notesCount} notes</span>}
    </div>
  );
};

export default Toolbar;