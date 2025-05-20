import React from 'react';

interface GlowingButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({ 
  children, 
  onClick,
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full py-3 px-4 rounded-lg font-medium 
        text-white bg-gradient-to-r from-cyan-500 to-blue-500
        transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        group overflow-hidden
      `}
    >
      {/* Glow effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10 rounded-lg animate-pulse"></span>
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};