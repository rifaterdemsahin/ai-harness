import React, { useState } from 'react';
import type { Edge } from '@xyflow/react';
import type { AppNode } from '../data/nodes';
import { loadNotes, loadLinks } from '../data/nodes';
import { describeEdges } from '../data/edgeGraph';

interface ToolbarProps {
  nodes: AppNode[];
  edges: Edge[];
}

const Toolbar: React.FC<ToolbarProps> = ({ nodes, edges }) => {
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

    // PART 6 — edges are part of the export.
    if (edges.length) {
      lines.push('## Edges', '');
      describeEdges(edges).forEach((line) => lines.push(`- ${line}`));
      lines.push('');
    }

    return lines.join('\n');
  };

  const getJsonExport = (): string =>
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        nodes: nodes.map((n) => ({ id: n.id, title: (n.data as { title?: string }).title, position: n.position, data: n.data })),
        notes: loadNotes(),
        links: loadLinks(),
        edges: describeEdges(edges),
      },
      null,
      2
    );

  const handleCopyAll = () => {
    navigator.clipboard.writeText(getFullExport()).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const download = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => download(getFullExport(), 'ai-harness-notes.md', 'text/markdown');
  const handleDownloadJson = () => download(getJsonExport(), 'ai-harness-notes.json', 'application/json');

  const notesCount = nodes.filter((n) => loadNotes()[n.id]?.trim()).length;

  return (
    <div className="toolbar">
      <button className="toolbar-btn" onClick={handleCopyAll} title="Copy all notes + node data + edges">
        {copiedAll ? '✓ Copied' : '📋 Copy All'}
      </button>
      <button className="toolbar-btn" onClick={handleDownload} title="Download notes as Markdown">
        ⬇ Download
      </button>
      <button className="toolbar-btn" onClick={handleDownloadJson} title="Download notes + edges as JSON">
        ⬇ JSON
      </button>
      {notesCount > 0 && <span className="toolbar-badge">{notesCount} notes</span>}
      <span className="toolbar-badge">{edges.length} edges</span>
    </div>
  );
};

export default Toolbar;
