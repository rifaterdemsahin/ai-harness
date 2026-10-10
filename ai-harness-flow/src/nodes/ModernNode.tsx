import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CardData } from '../data/nodes';
import { ModernIcon } from '../components/Icons';

const ModernNode: React.FC<NodeProps> = ({ data }) => {
  const { title, color, icon, badge, subtext } = data as CardData;

  const borderColor = icon === 'cube' ? 'rgba(136, 19, 55, 0.5)' : color || 'rgba(136, 19, 55, 0.5)';
  const pillBg = icon === 'cube' ? 'rgba(136, 19, 55, 0.6)' : (color ? `${color}33` : 'rgba(136, 19, 55, 0.6)');
  const pillText = icon === 'cube' ? '#fda4af' : (color || '#fda4af');

  return (
    <div 
      style={{
        backgroundColor: '#0B0F19',
        border: `1px solid ${borderColor}`,
        borderRadius: '0.5rem',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '240px',
        color: '#fff'
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} isConnectable={false} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} isConnectable={false} style={{ opacity: 0 }} />

      {/* Left side Icon */}
      <div style={{ flexShrink: 0 }}>
        <ModernIcon type={icon || 'cube'} color={color || '#fff'} size={40} />
      </div>

      {/* Right side content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</span>
          {badge && (
            <span style={{
              backgroundColor: pillBg,
              color: pillText,
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              marginLeft: '8px'
            }}>
              {typeof badge === 'string' ? badge : `${badge.n} ${badge.emoji}`}
            </span>
          )}
        </div>
        {subtext && (
          <span style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'left' }}>{subtext}</span>
        )}
      </div>
    </div>
  );
};

export default ModernNode;
