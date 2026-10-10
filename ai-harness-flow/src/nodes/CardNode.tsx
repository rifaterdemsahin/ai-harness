import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CardData } from '../data/nodes';
import Badge from './Badge';

const CardNode: React.FC<NodeProps> = ({ data }) => {
  const { title, color, badge, lines } = data as CardData;
  const subtitle = (data as { subtitle?: string }).subtitle || '';

  return (
    <div className="card-node" style={{ borderColor: color }} tabIndex={0} role="group" aria-label={title || 'Card node'}>
      <Handle type="target" id="top" position={Position.Top} isConnectable={true} />
      <Handle type="target" id="left" position={Position.Left} isConnectable={true} />
      <Handle type="source" id="bottom" position={Position.Bottom} isConnectable={true} />
      <Handle type="source" id="right" position={Position.Right} isConnectable={true} />

      {(title || badge) && (
        <div className="card-header">
          {badge && <Badge n={badge.n} emoji={badge.emoji} color={color} />}
          {title && <span className="card-title" style={{ color }}>{title}</span>}
        </div>
      )}
      {subtitle && <div className="node-subtitle">{subtitle}</div>}

      {lines && lines.length > 0 && (
        <div className="card-lines">
          {lines.map((line, i) => (
            <span key={i} className="card-line">{line}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardNode;