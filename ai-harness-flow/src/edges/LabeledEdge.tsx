import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

/**
 * PART 4 — custom edge that renders its label through EdgeLabelRenderer and
 * takes its colour from the source node (passed in via edge.data.color).
 */
const LabeledEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  label,
  data,
  selected,
}) => {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const meta = (data ?? {}) as { color?: string; kind?: string };
  const color = meta.color ?? '#C9D3E3';
  const isNote = meta.kind === 'note';

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: color,
          strokeWidth: selected ? 3 : 2,
          ...(isNote ? { strokeDasharray: '6 4' } : {}),
        }}
      />
      {(label || isNote) && (
        <EdgeLabelRenderer>
          <div
            className="edge-label"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              color,
              borderColor: color,
            }}
          >
            {typeof label === 'string' && label ? label : 'note ref'}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default LabeledEdge;
