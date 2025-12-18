import React, { useState, useEffect } from 'react';
import Taskbar from './components/Taskbar';
import PaintApp from './apps/PaintApp';
import SweaterApp from './apps/SweaterApp';

function App() {
  const [openWindows, setOpenWindows] = useState({
    paint: true,
    sweater: true
  });
  const [isMobile, setIsMobile] = useState(false);
  const [paintImage, setPaintImage] = useState(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, only show sweater app by default
  useEffect(() => {
    if (isMobile) {
      setOpenWindows({ paint: false, sweater: true });
    }
  }, [isMobile]);

  const toggleWindow = (appId) => {
    if (isMobile) {
      // On mobile, switch between apps (only one at a time)
      setOpenWindows({
        paint: appId === 'paint',
        sweater: appId === 'sweater'
      });
    } else {
      setOpenWindows(prev => ({
        ...prev,
        [appId]: !prev[appId]
      }));
    }
  };

  const closeWindow = (appId) => {
    setOpenWindows(prev => ({
      ...prev,
      [appId]: false
    }));
  };

  const handleImageTransfer = (dataUrl) => {
    setPaintImage(dataUrl);
    setOpenWindows(prev => ({ ...prev, paint: true }));
  };

  return (
    <div className="h-screen w-screen bg-[#008080] overflow-hidden relative font-pixel">
      
      {/* Desktop Icons - Hidden on mobile when a window is open */}
      {(!isMobile || (!openWindows.paint && !openWindows.sweater)) && (
        <div className={`absolute ${isMobile ? 'top-2 left-2 right-2 flex flex-row justify-center gap-8' : 'top-4 left-4 flex flex-col gap-6'} text-white text-center z-0`}>
            <div className={`flex flex-col items-center gap-1 group cursor-pointer ${isMobile ? 'w-16' : 'w-20'}`} onClick={() => toggleWindow('paint')}>
                <img src="/paint-icon.png" className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`} alt="Paint"/>
                <span className="text-[10px] sm:text-xs bg-[#008080] group-hover:bg-[#000080] border border-transparent group-hover:border-dotted group-hover:border-white px-1">MS Paint</span>
            </div>
            <div className={`flex flex-col items-center gap-1 group cursor-pointer ${isMobile ? 'w-16' : 'w-20'}`} onClick={() => toggleWindow('sweater')}>
                <img src="/ms-ugly-sweater.png" className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} object-contain`} alt="Ugly Sweater"/>
                <span className="text-[10px] sm:text-xs bg-[#008080] group-hover:bg-[#000080] border border-transparent group-hover:border-dotted group-hover:border-white px-1">Ugly Sweater</span>
            </div>
            <div className={`flex flex-col items-center gap-1 group cursor-pointer ${isMobile ? 'w-16' : 'w-20'}`}>
                <img src="/my-pc-icon.png" className={`${isMobile ? 'w-10 h-10' : 'w-10 h-10'}`} alt="My Computer"/>
                <span className="text-[10px] sm:text-xs bg-[#008080] group-hover:bg-[#000080] border border-transparent group-hover:border-dotted group-hover:border-white px-1">My Computer</span>
            </div>
        </div>
      )}

      {/* Windows */}
      {openWindows.paint && (
        <PaintApp 
          onClose={() => closeWindow('paint')} 
          initialImage={paintImage}
        />
      )}
      {openWindows.sweater && (
        <SweaterApp 
          onClose={() => closeWindow('sweater')} 
          onExport={handleImageTransfer}
        />
      )}

      {/* Taskbar */}
      <Taskbar 
        isMobile={isMobile}
        openWindows={openWindows}
        onToggleWindow={toggleWindow}
      />

    </div>
  );
}

export default App;
