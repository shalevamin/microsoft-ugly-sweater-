import React, { useEffect, useState } from 'react';
import RetroWindow from './RetroWindow';
import RetroButton from './RetroButton';

const RetroLoadingModal = ({ isOpen, onClose, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Janky progress logic
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }

        // Random increment sized between 1 and 15
        const increment = Math.floor(Math.random() * 15) + 1;
        
        // Stalls around 60% and 80%
        if ((prev > 55 && prev < 65) || (prev > 75 && prev < 85)) {
           if (Math.random() > 0.8) return prev + increment; // 20% chance to move when stuck
           return prev; // Stall
        }

        return Math.min(prev + increment, 100);
      });
    }, 300); // Ticks every 300ms

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  // Calculate number of blocks (approx 20 blocks for 100%)
  const totalBlocks = 25;
  const activeBlocks = Math.floor((progress / 100) * totalBlocks);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Modal Container */}
      <div className="w-80 shadow-win95-out bg-win95-bg p-1">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-win95-blue to-[#1084d0] px-1 py-0.5 flex justify-between items-center mb-3">
            <span className="text-white font-pixel text-xs font-bold">Processing...</span>
            <button className="bg-win95-bg shadow-win95-out w-4 h-4 flex items-center justify-center">
                <span className="text-[10px] font-bold mb-1">x</span>
            </button>
        </div>

        <div className="px-3 pb-3">
            <p className="font-pixel text-xs mb-3">Status: Applying Nano Banana Magic...</p>
            
            {/* Loading Track */}
            <div className="h-6 bg-white shadow-win95-in p-0.5 flex gap-0.5 relative">
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <div 
                    key={i}
                    className={`h-full flex-1 transition-opacity duration-75 ${i < activeBlocks ? 'bg-[#000080]' : 'bg-transparent'}`}
                />
              ))}
            </div>

            <div className="flex justify-center mt-3">
                 <RetroButton onClick={onClose} className="px-4 text-xs">Cancel</RetroButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RetroLoadingModal;
