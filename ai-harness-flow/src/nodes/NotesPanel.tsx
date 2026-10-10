import React, { useState, useEffect, useRef } from 'react';
import type { Edge } from '@xyflow/react';
import type { AppNode } from '../data/nodes';
import { saveNotes, loadNotes, saveLinks, loadLinks } from '../data/nodes';

interface NotesPanelProps {
  node: AppNode | null;
  allNodes: AppNode[];
  edges: Edge[];
  onClose: () => void;
  onNoteChange: (nodeId: string, note: string) => void;
  onLinksChange: (nodeId: string, links: string[]) => void;
  onNavigateToNode: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onEditTitle?: (nodeId: string, title: string) => void;
  onEditLines?: (nodeId: string, lines: string[]) => void;
  onDuplicate?: (nodeId: string) => void;
  onParentChange?: (nodeId: string, parentId: string) => void;
}

function renderNoteWithLinks(text: string, onNavigate: (id: string) => void): React.ReactNode[] {
  const pattern = /(\[\[[\w-]+\]\]|https?:\/\/[^\s]+)/g;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const refMatch = part.match(/^\[\[([\w-]+)\]\]$/);
    if (refMatch) {
      return <span key={i} className="note-link note-ref" onClick={(e) => { e.stopPropagation(); onNavigate(refMatch[1]); }} title={`Go to ${refMatch[1]}`}>@{refMatch[1]}</span>;
    }
    if (/^https?:\/\//.test(part)) {
      return <a key={i} className="note-link note-url" href={part} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{part.length > 40 ? part.slice(0, 37) + '...' : part}</a>;
    }
    return <span key={i}>{part}</span>;
  });
}

const NotesPanel: React.FC<NotesPanelProps> = ({ node, allNodes, edges, onClose, onNoteChange, onLinksChange, onNavigateToNode, onDelete, onEditTitle, onEditLines, onDuplicate, onParentChange }) => {
  const [note, setNote] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editingLines, setEditingLines] = useState(false);
  const [editLines, setEditLines] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (node) {
      const notes = loadNotes();
      const allLinks = loadLinks();
      setNote(notes[node.id] || node.data.notes || '');
      setLinks(allLinks[node.id] || node.data.links || []);
      setCopied(false); setShowLinkInput(false); setNewLink('');
      setEditingTitle(false); setEditingLines(false);
      setEditTitle(node.data.title || '');
      setEditLines(((node.data as { lines?: string[] }).lines || []).join('\n'));
    }
  }, [node]);

  if (!node) return null;
  const data = node.data as { title?: string; color?: string; lines?: string[]; chips?: string[]; toggles?: { label: string; on: boolean; note?: string }[] };

  const handleSave = () => {
    const notes = loadNotes(); notes[node.id] = note; saveNotes(notes); onNoteChange(node.id, note);
  };
  const handleAddLink = () => {
    const url = newLink.trim(); if (!url) return;
    const updated = [...links, url]; setLinks(updated);
    const allLinks = loadLinks(); allLinks[node.id] = updated; saveLinks(allLinks); onLinksChange(node.id, updated);
    setNewLink(''); setShowLinkInput(false);
  };
  const handleRemoveLink = (idx: number) => {
    const updated = links.filter((_, i) => i !== idx); setLinks(updated);
    const allLinks = loadLinks(); allLinks[node.id] = updated; saveLinks(allLinks); onLinksChange(node.id, updated);
  };
  const handleCopy = () => {
    const parts: string[] = [];
    if (data.title) parts.push(data.title);
    if (data.lines) parts.push(...data.lines);
    if (links.length > 0) parts.push(`Links:\n${links.map(l => `  - ${l}`).join('\n')}`);
    if (note.trim()) parts.push(`\nNotes:\n${note.trim()}`);
    navigator.clipboard.writeText(parts.join('\n')).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  const handleSaveTitle = () => {
    if (onEditTitle && editTitle.trim()) { onEditTitle(node.id, editTitle.trim()); }
    setEditingTitle(false);
  };
  const handleSaveLines = () => {
    if (onEditLines) { onEditLines(node.id, editLines.split('\n').filter(l => l.trim())); }
    setEditingLines(false);
  };
  const handleDelete = () => {
    if (onDelete && confirm('Delete this node?')) { onDelete(node.id); onClose(); }
  };

  const otherNodes = allNodes.filter((n) => n.id !== node.id);

  return (
    <div className="notes-panel" style={{ borderColor: data.color }}>
      <div className="notes-header">
        {editingTitle ? (
          <input className="edit-title-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={handleSaveTitle} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTitle(); }} autoFocus style={{ color: data.color }} />
        ) : (
          <span className="notes-title" style={{ color: data.color, cursor: 'pointer' }} onDoubleClick={() => setEditingTitle(true)} title="Double-click to edit title">
            {data.title || node.id}
          </span>
        )}
        <div className="notes-actions">
          <button className="notes-btn copy-btn" onClick={handleCopy} title="Copy">{copied ? '\u2713 Copied' : '\ud83d\udccb Copy'}</button>
          {onDuplicate && <button className="notes-btn" onClick={() => onDuplicate(node.id)} title="Duplicate node">⧉</button>}
          {onDelete && <button className="notes-btn delete-btn" onClick={handleDelete} title="Delete node">\ud83d\uddd1</button>}
          <button className="notes-btn close-btn" onClick={onClose} title="Close">\u2715</button>
        </div>
      </div>

      {/* Edit description */}
      {editingLines ? (
        <textarea className="notes-textarea" style={{ minHeight: 60 }} value={editLines} onChange={(e) => setEditLines(e.target.value)} onBlur={handleSaveLines} onKeyDown={(e) => { if (e.key === 'Escape') setEditingLines(false); }} autoFocus />
      ) : (
        data.lines && data.lines.length > 0 && (
          <div className="card-lines editable-lines" onDoubleClick={() => setEditingLines(true)} title="Double-click to edit" style={{ marginBottom: 8, cursor: 'pointer' }}>
            {data.lines.map((line, i) => <span key={i} className="card-line">{line}</span>)}
          </div>
        )
      )}

      {links.length > 0 && (
        <div className="notes-links">
          {links.map((url, i) => (
            <div key={i} className="notes-link-item">
              <a href={url} target="_blank" rel="noopener noreferrer" className="notes-link-url">{'\ud83d\udd17'} {url.length > 32 ? url.slice(0, 29) + '...' : url}</a>
              <button className="notes-link-remove" onClick={() => handleRemoveLink(i)}>\u2715</button>
            </div>
          ))}
        </div>
      )}

      {otherNodes.length > 0 && (
        <div className="notes-xrefs">
          <span className="notes-xrefs-label">Link to node:</span>
          <div className="notes-xrefs-chips">
            {otherNodes.map((n) => {
              const nd = n.data as { title?: string; color?: string };
              const hasEdge = edges.some((e) => (e.source === node.id && e.target === n.id) || (e.source === n.id && e.target === node.id));
              return (
                <button key={n.id} className={`xref-chip ${hasEdge ? 'active' : ''}`}
                  style={{ borderColor: nd.color, color: hasEdge ? '#0E1626' : nd.color, background: hasEdge ? nd.color : 'transparent' }}
                  onClick={() => {
                    const ref = `[[${n.id}]]`;
                    const updated = note.includes(ref) ? note.replace(ref, '').replace(/\n{3,}/g, '\n\n').trim() : note + (note ? '\n' : '') + ref;
                    setNote(updated); const notes = loadNotes(); notes[node.id] = updated; saveNotes(notes); onNoteChange(node.id, updated);
                  }}>
                  {nd.title || n.id}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <textarea ref={textareaRef} className="notes-textarea" placeholder="Add notes... Use [[node-id]] to link nodes" value={note} onChange={(e) => setNote(e.target.value)} onBlur={handleSave} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }} />

      {note.trim() && <div className="notes-preview">{renderNoteWithLinks(note, onNavigateToNode)}</div>}

      {showLinkInput ? (
        <div className="link-input-row">
          <input className="link-input" type="url" placeholder="https://..." value={newLink} onChange={(e) => setNewLink(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddLink(); if (e.key === 'Escape') setShowLinkInput(false); }} autoFocus />
          <button className="notes-btn" onClick={handleAddLink}>Add</button>
        </div>
      ) : (
        <button className="notes-btn add-link-btn" onClick={() => setShowLinkInput(true)}>+ Add link</button>
      )}

      <div className="notes-hint">Notes auto-save \u00b7 Esc to close \u00b7 [[node-id]] for cross-refs \u00b7 Double-click title/description to edit</div>
    </div>
  );
};

export default NotesPanel;
