
import React from 'react';
import { AgletType } from '../types';

interface AgletIconProps {
  type: AgletType;
  size?: number;
}

export const AgletIcon: React.FC<AgletIconProps> = ({ type, size = 48 }) => {
  const renderAglet = () => {
    switch (type) {
      case AgletType.GOLD:
        return (
          <g>
            <rect x="10" y="30" width="30" height="15" rx="4" fill="#EAB308" />
            <path d="M10 32 Q 5 32 5 20" stroke="#fbbf24" strokeWidth="6" fill="none" />
            <rect x="10" y="30" width="30" height="4" fill="#fef08a" opacity="0.5" />
          </g>
        );
      case AgletType.SILVER:
        return (
          <g>
            <rect x="10" y="30" width="30" height="15" rx="4" fill="#94a3b8" />
            <path d="M10 32 Q 5 32 5 20" stroke="#cbd5e1" strokeWidth="6" fill="none" />
            <rect x="10" y="30" width="30" height="4" fill="#f8fafc" opacity="0.6" />
          </g>
        );
      case AgletType.NEON_PINK:
        return (
          <g>
            <rect x="10" y="30" width="30" height="15" rx="4" fill="#ec4899" />
            <path d="M10 32 Q 5 32 5 20" stroke="#f472b6" strokeWidth="6" fill="none" />
            <circle cx="25" cy="37" r="3" fill="#fbcfe8" />
          </g>
        );
      case AgletType.POLKA_DOT:
        return (
          <g>
            <rect x="10" y="30" width="30" height="15" rx="4" fill="#6366f1" />
            <path d="M10 32 Q 5 32 5 20" stroke="#818cf8" strokeWidth="6" fill="none" />
            <circle cx="15" cy="35" r="2" fill="white" />
            <circle cx="25" cy="40" r="2" fill="white" />
            <circle cx="35" cy="35" r="2" fill="white" />
          </g>
        );
      case AgletType.STRIPED:
        return (
          <g>
            <rect x="10" y="30" width="30" height="15" rx="4" fill="#22c55e" />
            <path d="M10 32 Q 5 32 5 20" stroke="#4ade80" strokeWidth="6" fill="none" />
            <line x1="15" y1="30" x2="15" y2="45" stroke="#14532d" strokeWidth="3" />
            <line x1="25" y1="30" x2="25" y2="45" stroke="#14532d" strokeWidth="3" />
            <line x1="35" y1="30" x2="35" y2="45" stroke="#14532d" strokeWidth="3" />
          </g>
        );
      case AgletType.MATTE_BLACK:
        return (
          <g>
            <rect x="10" y="30" width="30" height="15" rx="4" fill="#18181b" />
            <path d="M10 32 Q 5 32 5 20" stroke="#3f3f46" strokeWidth="6" fill="none" />
            <rect x="10" y="30" width="10" height="15" fill="#27272a" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 50 50" className="drop-shadow-md">
      {renderAglet()}
    </svg>
  );
};
