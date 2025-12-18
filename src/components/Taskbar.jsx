import React, { useState, useEffect } from 'react';

const Taskbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[28px] bg-win95-bg border-t border-win95-light flex items-center px-1 z-50 shadow-win95-out">
      {/* Start Button */}
      <button className="flex items-center gap-1 px-1 py-0.5 shadow-win95-out active:shadow-win95-in bg-win95-bg mr-2 ml-0.5 my-0.5">
         <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" alt="win" className="w-4 h-4" />
         <span className="font-pixel font-bold text-sm tracking-wide">Start</span>
      </button>

      {/* Vertical Separator */}
      <div className="w-[2px] h-[20px] bg-win95-dark/50 shadow-win95-in mx-1"></div>
      
      {/* Active Tasks */}
      <div className="flex-1 flex justify-start pl-1">
         <div className="w-40 h-[22px] bg-win95-light shadow-win95-in flex items-center px-2 gap-2 bg-gradient-to-r from-[#dfdfdf] to-[#f0f0f0] cursor-default">
            <img src="https://win98icons.alexmeub.com/icons/png/paint-0.png" alt="paint" className="w-4 h-4" />
            <span className="font-pixel text-xs font-bold">untitled - Paint</span>
         </div>
      </div>

      {/* System Tray */}
      <div className="h-[22px] shadow-win95-in bg-win95-bg px-2 flex items-center gap-2 border-white border-b border-r">
         <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-0.png" alt="sound" className="w-3 h-3" />
         <span className="font-pixel text-xs">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default Taskbar;
