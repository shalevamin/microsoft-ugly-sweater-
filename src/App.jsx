import React, { useState } from 'react';
import Taskbar from './components/Taskbar';
import PaintApp from './apps/PaintApp';
import SweaterApp from './apps/SweaterApp';

function App() {
  const [openWindows, setOpenWindows] = useState({
    paint: true,
    sweater: true
  });

  const [paintImage, setPaintImage] = useState(null);

  const toggleWindow = (appId) => {
    setOpenWindows(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  const closeWindow = (appId) => {
    setOpenWindows(prev => ({
      ...prev,
      [appId]: false
    }));
  };

  const handleImageTransfer = (dataUrl) => {
    setPaintImage(dataUrl);
    // Ensure Paint is open
    setOpenWindows(prev => ({ ...prev, paint: true }));
    // Optional: Bring paint to front or notify user
  };

  return (
    <div className="h-screen w-screen bg-[#008080] overflow-hidden relative font-pixel">
      
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 text-white text-center w-20 z-0">
          <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => toggleWindow('paint')}>
              <img src="/paint-icon.png" className="w-8 h-8" alt="Paint"/>
              <span className="text-xs bg-[#008080] group-hover:bg-[#000080] border border-transparent group-hover:border-dotted group-hover:border-white px-1">MS Paint</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => toggleWindow('sweater')}>
              <img src="/ms-ugly-sweater.png" className="w-8 h-8 object-contain" alt="Ugly Sweater"/>
              <span className="text-xs bg-[#008080] group-hover:bg-[#000080] border border-transparent group-hover:border-dotted group-hover:border-white px-1">Ugly Sweater</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-0.png" className="w-8 h-8" alt="My Computer"/>
              <span className="text-xs bg-[#008080] group-hover:bg-[#000080] border border-transparent group-hover:border-dotted group-hover:border-white px-1">My Computer</span>
          </div>
      </div>

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

      {/* Taskbar - Passing active windows if we want to show them on taskbar, 
          but for now static or simple active indicator is fine as requested before 
       */}
      <Taskbar />

    </div>
  );
}

export default App;
