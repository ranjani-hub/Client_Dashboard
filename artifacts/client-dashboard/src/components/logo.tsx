import React from 'react';

export function ExpertifyLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 340 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto text-primary"
      >
        {/* Geometric H Emblem */}
        <g fill="currentColor">
          {/* Left pillar */}
          <path d="M 0 10 L 22 10 L 40 32 L 40 63 L 22 85 L 0 85 L 18 63 L 18 32 Z" />
          <polygon points="0,10 18,32 0,32" fill="white" />
          <polygon points="0,85 18,63 0,63" fill="white" />

          {/* Right pillar */}
          <path d="M 44 10 L 66 10 L 48 32 L 48 63 L 66 85 L 44 85 L 62 63 L 62 32 Z" />
          <polygon points="66,10 48,32 66,32" fill="white" />
          <polygon points="66,85 48,63 66,63" fill="white" />

          {/* Center interconnecting triangles */}
          <polygon points="22,35 44,35 33,22" />
          <polygon points="22,60 44,60 33,73" />
          <polygon points="22,47 44,47 33,35" />
          <polygon points="22,48 44,48 33,60" />
        </g>

        {/* Brand Text EXPERTIFY */}
        <text
          x="78"
          y="56"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="48"
          letterSpacing="1"
        >
          EXPERTIFY
        </text>

        {/* Accent Underline under EXPERT */}
        <rect x="78" y="70" width="125" height="7" rx="3.5" fill="currentColor" />

        {/* Tagline ANYTIME,ANYWHERE */}
        <text
          x="208"
          y="77"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="14"
          letterSpacing="0.5"
        >
          ANYTIME,ANYWHERE
        </text>
      </svg>
    </div>
  );
}
