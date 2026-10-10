import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CardData } from '../data/nodes';
import Badge from './Badge';

const ChannelNode: React.FC<NodeProps> = ({ data }) => {
  const { title, color, badge, chips } = data as CardData;

  return (
    <div
      className="card-node"
      style={{ borderColor: color }}
      tabIndex={0}
      role="group"
      aria-label={title || 'Channel node'}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />

      <div className="card-header">
        {badge && <Badge n={badge.n} emoji={badge.emoji} color={color} />}
        {title && <span className="card-title" style={{ color }}>{title}</span>}
      </div>

      {chips && chips.length > 0 && (
        <div className="chips-container">
          {chips.map((chip, i) => (
            <span key={i} className="chip">{chip}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelNode;