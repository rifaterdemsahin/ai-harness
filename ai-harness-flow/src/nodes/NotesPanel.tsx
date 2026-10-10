import React, { useState, useEffect, useRef } from 'react';
import type { AppNode } from '../data/nodes';
import { saveNotes, loadNotes } from '../data/nodes';

interface NotesPanelProps {
  node: AppNode | null;
  onClose: () => void;
  onNoteChange: (nodeId: string, note: string) => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ node, onClose, onNoteChange }) => {
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (node) {
      const notes = loadNotes();
      setNote(notes[node.id] || node.data.notes || '');
      setCopied(false);
    }
  }, [node]);

  if (!node) return null;

  const data = node.data as { title?: string; color?: string; lines?: string[]; chips?: string[]; toggles?: { label: string; on: boolean; note?: string }[] };

  const handleSave = () => {
    const notes = loadNotes();
    notes[node.id] = note;
    saveNotes(notes);
    onNoteChange(node.id, note);
  };

  const handleCopy = () => {
    const parts: string[] = [];
    if (data.title) parts.push(data.title);
    if (data.lines) parts.push(...data.lines);
    if (data.chips) parts.push(`Chips: ${data.chips.join(', ')}`);
    if (data.toggles) {
      data.toggles.forEach((t) => {
        parts.push(`${t.label}: ${t.on ? 'ON' : 'OFF'}${t.note ? ` (${t.note})` : ''}`);
      });
    }
    if (note.trim()) parts.push(`\nNotes:\n${note.trim()}`);

    navigator.clipboard.writeText(parts.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="notes-panel" style={{ borderColor: data.color }}>
      <div className="notes-header">
        <span className="notes-title" style={{ color: data.color }}>
          {data.title || node.id}
        </span>
        <div className="notes-actions">
          <button className="notes-btn copy-btn" onClick={handleCopy} title="Copy to clipboard">
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button className="notes-btn close-btn" onClick={onClose} title="Close">✕</button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="notes-textarea"
        placeholder="Add notes about this node..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      />
      <div className="notes-hint">Notes save automatically · Esc to close</div>
    </div>
  );
};

export default NotesPanel;