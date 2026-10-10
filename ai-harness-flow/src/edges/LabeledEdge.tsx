import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

/**
 * PART 4 — custom edge that renders its label through EdgeLabelRenderer,
 * supports inline label editing on double-click,
 * and takes its colour from the source node (passed in via edge.data.color).
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
  const { setEdges } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setLabelText(typeof label === 'string' ? label : '');
      setIsEditing(true);
    },
    [label],
  );

  const handleSave = useCallback(() => {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === id ? { ...e, label: labelText } : e,
      ),
    );
    setIsEditing(false);
  }, [id, labelText, setEdges]);

  const displayLabel =
    (typeof label === 'string' && label) ? label : (isNote ? 'note ref' : '');

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
      {(displayLabel || selected) && (
        <EdgeLabelRenderer>
          <div
            className="edge-label"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              color,
              borderColor: color,
            }}
            onDoubleClick={handleDoubleClick}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                className="edge-label-input"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                style={{ color }}
              />
            ) : displayLabel ? (
              displayLabel
            ) : (
              <span style={{ opacity: 0.4 }}>+ label</span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default LabeledEdge;