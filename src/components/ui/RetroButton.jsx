import React from 'react';

const RetroButton = ({ children, onClick, active = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        bg-win95-bg 
        text-black font-pixel
        px-2 py-1
        border-none
        active:shadow-win95-in 
        ${active ? 'shadow-win95-in font-bold' : 'shadow-win95-out'}
        flex items-center justify-center gap-1
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default RetroButton;
