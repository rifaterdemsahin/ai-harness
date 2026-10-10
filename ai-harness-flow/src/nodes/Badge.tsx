import React from 'react';

interface BadgeProps {
  n: number;
  emoji: string;
  color: string;
}

const Badge: React.FC<BadgeProps> = ({ n, emoji, color }) => (
  <span
    className="badge"
    style={{ background: color }}
    title={`Badge ${n}`}
  >
    {emoji}
  </span>
);

export default Badge;