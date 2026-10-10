import React, { useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CardData } from '../data/nodes';
import Badge from './Badge';

const ComputeNode: React.FC<NodeProps> = ({ data }) => {
  const { title, color, badge, toggles: initialToggles, lines } = data as CardData;

  const [toggles, setToggles] = useState(
    initialToggles?.map((t) => ({ ...t })) ?? []
  );

  const handleToggle = (index: number) => {
    setToggles((prev) =>
      prev.map((t, i) => (i === index ? { ...t, on: !t.on } : t))
    );
  };

  return (
    <div
      className="card-node"
      style={{ borderColor: color }}
      tabIndex={0}
      role="group"
      aria-label={title || 'Compute node'}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
      <Handle type="source" position={Position.Right} isConnectable={false} />

      <div className="card-header">
        {badge && <Badge n={badge.n} emoji={badge.emoji} color={color} />}
        {title && <span className="card-title" style={{ color }}>{title}</span>}
      </div>

      {toggles.map((toggle, i) => (
        <div key={i} className={`toggle-row ${!toggle.on ? 'dimmed' : ''}`}>
          <button
            className="toggle-btn"
            role="switch"
            aria-checked={toggle.on}
            aria-label={`${toggle.label} toggle`}
            onClick={() => handleToggle(i)}
            style={{ background: toggle.on ? color : '#2B3F66' }}
          />
          <span>{toggle.label}</span>
          {toggle.note && <span className="toggle-note">({toggle.note})</span>}
        </div>
      ))}

      {lines && lines.length > 0 && (
        <div className="card-lines" style={{ marginTop: 8 }}>
          {lines.map((line, i) => (
            <span key={i} className="card-line">{line}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComputeNode;