import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CardData } from '../data/nodes';

const ModelNode: React.FC<NodeProps> = ({ data }) => {
  const { title, color, lines } = data as CardData;

  return (
    <div className="card-node model-node" style={{ borderColor: color }} tabIndex={0} role="group" aria-label={title || 'Model node'}>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
      <Handle type="source" position={Position.Right} isConnectable={false} />
      <div className="model-icon">🧠</div>
      <div className="card-title" style={{ color }}>{title}</div>
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

export default ModelNode;