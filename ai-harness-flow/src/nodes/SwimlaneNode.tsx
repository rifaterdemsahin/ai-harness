import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';

export default function SwimlaneNode({ data, selected }: NodeProps) {
  const bgColor = data.bgColor as string | undefined;
  const color = data.color as string | undefined;
  const title = data.title as string | undefined;

  return (
    <>
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={300} minHeight={100} />
      <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: bgColor || 'transparent', borderRadius: 8 }}>
        <div style={{ 
          position: 'absolute', 
          top: -24, 
          left: 0, 
          fontSize: 14, 
          fontWeight: 600, 
          color: color || '#888',
          textTransform: 'uppercase',
          letterSpacing: 1
        }}>
          {title || 'Swimlane'}
        </div>
      </div>
    </>
  );
}
