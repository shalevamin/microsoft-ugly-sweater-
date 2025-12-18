import React from 'react';
import { X } from 'lucide-react';

const RetroWindow = ({ title, children, onClose }) => {
  return (
    <div className="bg-win95-bg shadow-win95-out p-1 h-full flex flex-col">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-win95-blue to-[#1084d0] px-1 py-0.5 flex justify-between items-center mb-1">
        <div className="text-white font-pixel text-sm tracking-wider font-bold truncate">
          {title}
        </div>
        <button 
          onClick={onClose}
          className="bg-win95-bg shadow-win95-out p-0.5 flex items-center justify-center active:shadow-win95-in w-5 h-5 min-w-[20px]"
        >
          <X size={14} color="black" strokeWidth={3} />
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};

export default RetroWindow;
