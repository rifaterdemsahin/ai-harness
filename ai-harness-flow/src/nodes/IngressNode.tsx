import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CardData } from '../data/nodes';

const IngressNode: React.FC<NodeProps> = ({ data }) => {
  const { title, color } = data as CardData & { subtitle?: string };
  const subtitle = (data as { subtitle?: string }).subtitle || '';

  return (
    <div className="card-node ingress-node" style={{ borderColor: color }} tabIndex={0} role="group" aria-label={title || 'Ingress node'}>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
      <Handle type="source" position={Position.Right} isConnectable={false} />
      <div className="ingress-icon">💬</div>
      <div className="card-title" style={{ color }}>{title}</div>
      {subtitle && <div className="node-subtitle">{subtitle}</div>}
    </div>
  );
};

export default IngressNode;