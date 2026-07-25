import React from 'react';

export function ExpertifyLogo({ className = "h-12" }: { className?: string }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/expertify-logo.png"
        alt="EXPERTIFY"
        className="h-full w-auto max-h-[54px] object-contain brightness-105"
      />
    </div>
  );
}
