import React from 'react';

interface ShieldLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const ShieldLogo: React.FC<ShieldLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
        {/* Subtle radial cyan glow */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"></div>
        
        {/* Shield Icon SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full text-cyan-500 drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          <path
            d="M12 2L3 6V11.5C3 17.5 7.5 21.8 12 23C16.5 21.8 21 17.5 21 11.5V6L12 2Z"
            className="fill-slate-900 stroke-cyan-400"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6L6 9.2V12C6 15.8 8.8 18.9 12 19.8C15.2 18.9 18 15.8 18 12V9.2L12 6Z"
            className="fill-cyan-950/60 stroke-cyan-300"
            strokeWidth="1.25"
          />
          <path
            d="M12 8.5V16M9.5 12.5L12 10L14.5 12.5"
            stroke="#38BDF8"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900">
              SANGYAN
            </span>
            <span className="font-extrabold text-base md:text-lg tracking-tight text-cyan-600">
              SHIELD
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-0.5">
            Digital Scam Resilience
          </span>
        </div>
      )}
    </div>
  );
};
