import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Pencil, Eraser, MousePointer2, Type, Slash, Square, Circle, Trash2 } from 'lucide-react';
import RetroButton from '../components/ui/RetroButton';

const PaintApp = ({ onClose, initialImage }) => {
  const [activeTool, setActiveTool] = useState('pencil');
  const [activeColor, setActiveColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  
  const canvasRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tools configuration
  const tools = [
    { id: 'pencil', icon: <Pencil size={14} /> },
    { id: 'brush', icon: <div className="w-2 h-2 bg-black rounded-full"/> },
    { id: 'eraser', icon: <Eraser size={14} /> },
  ];

  const allTools = [
    { id: 'free-select', icon: <div className="border border-dashed border-black w-3 h-3"/> },
    { id: 'select', icon: <MousePointer2 size={14} /> },
    { id: 'eraser', icon: <Eraser size={14} /> },
    { id: 'fill', icon: <div className="w-3 h-3 bg-black transform rotate-45"/> },
    { id: 'picker', icon: <div className="w-3 h-3 rounded-full border border-black"/> },
    { id: 'zoom', icon: <div className="text-xs">Q</div> },
    { id: 'pencil', icon: <Pencil size={14} /> },
    { id: 'brush', icon: <div className="w-2 h-2 bg-black rounded-full"/> },
    { id: 'spray', icon: <div className="text-[8px]">::</div> },
    { id: 'text', icon: <Type size={14} /> },
    { id: 'line', icon: <Slash size={14} /> },
    { id: 'curve', icon: <div className="text-xs">~</div> },
    { id: 'rect', icon: <Square size={14} /> },
    { id: 'poly', icon: <div className="text-xs">L</div> },
    { id: 'ellipse', icon: <Circle size={14} /> },
    { id: 'round-rect', icon: <div className="w-3 h-3 border border-black rounded-[2px]"/> },
  ];

  const colors = [
      '#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080','#808040','#004040', '#0080ff', '#004080', '#4080ff', '#804000',
      '#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffff80','#00ff80', '#80ffff', '#8080ff', '#ff8040', '#ff0080'
  ];

  const canvasWidth = isMobile ? Math.min(window.innerWidth - 40, 350) : 600;
  const canvasHeight = isMobile ? Math.min(window.innerHeight - 200, 300) : 400;

  // Draw watermark function
  const drawWatermark = (ctx, w, h) => {
    ctx.save();
    ctx.font = isMobile ? 'bold 10px Arial' : 'bold 14px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('made by shalev amin | IG: @shalev.amin', w - 10, h - 10);
    ctx.restore();
  };

  useEffect(() => {
    if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawWatermark(ctx, canvasWidth, canvasHeight);
        setContext(ctx);
    }
  }, [isMobile, canvasWidth, canvasHeight]);

  // Handle Imported Image
  useEffect(() => {
    if (initialImage && context) {
        const img = new Image();
        img.src = initialImage;
        img.onload = () => {
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            
            const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
            const x = (canvasWidth - img.width * scale) / 2;
            const y = (canvasHeight - img.height * scale) / 2;
            
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
            drawWatermark(context, canvasWidth, canvasHeight);
        };
    }
  }, [initialImage, context, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (!context) return;
    if (activeTool === 'eraser') {
        context.strokeStyle = '#ffffff';
        context.lineWidth = 10;
    } else if (activeTool === 'brush') {
        context.strokeStyle = activeColor;
        context.lineWidth = 8;
    } else if (activeTool === 'pencil') {
        context.strokeStyle = activeColor;
        context.lineWidth = isMobile ? 2 : 1;
    } else {
        context.strokeStyle = activeColor;
        context.lineWidth = 1;
    }
  }, [activeTool, activeColor, context, isMobile]);

  const getEventPos = (e) => {
    if (e.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  const startDrawing = (e) => {
    if (!context || !['pencil', 'brush', 'eraser'].includes(activeTool)) return;
    e.preventDefault();
    const { offsetX, offsetY } = getEventPos(e);
    setIsDrawing(true);
    lastPos.current = { x: offsetX, y: offsetY };
    
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    e.preventDefault();
    const { offsetX, offsetY } = getEventPos(e);
    context.beginPath();
    context.moveTo(lastPos.current.x, lastPos.current.y);
    context.lineTo(offsetX, offsetY);
    context.stroke();
    lastPos.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    context?.beginPath();
  };

  const handleClear = () => {
    if (!context) return;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    drawWatermark(context, canvasWidth, canvasHeight);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setWindowSize({ width: 800, height: 600 });
    } else {
      setWindowSize({ width: window.innerWidth - 20, height: window.innerHeight - 60 });
    }
    setIsMaximized(!isMaximized);
  };

  if (isMinimized) {
    return null;
  }

  // Mobile: full width
  const windowStyle = isMobile ? {
    width: '100%',
    height: 'calc(100vh - 40px)',
    top: 0,
    left: 0,
    right: 0,
  } : {
    width: isMaximized ? window.innerWidth - 20 : windowSize.width,
    height: isMaximized ? window.innerHeight - 60 : windowSize.height,
    top: isMaximized ? 0 : 30,
    left: isMaximized ? 0 : 150,
  };

  return (
    <Draggable handle=".window-handle" bounds="parent" nodeRef={windowRef} disabled={isMaximized || isMobile}>
      <div 
        ref={windowRef}
        className="absolute z-20 shadow-win95-out bg-win95-bg flex flex-col"
        style={{ 
          ...windowStyle,
          resize: isMobile ? 'none' : 'both',
          overflow: 'hidden',
          minWidth: isMobile ? 'auto' : 400,
          minHeight: isMobile ? 'auto' : 300
        }}
      >
        <div className="window-handle bg-gradient-to-r from-win95-blue to-[#1084d0] px-1 py-0.5 flex justify-between items-center cursor-default select-none">
            <div className="flex items-center gap-1">
                <img src="/paint-icon.png" alt="icon" className="w-4 h-4" />
                <span className="text-white font-pixel text-xs sm:text-sm tracking-wider font-bold">untitled - Paint</span>
            </div>
            <div className="flex gap-0.5">
                {!isMobile && (
                  <>
                    <button 
                      className="bg-win95-bg shadow-win95-out w-4 h-4 flex items-center justify-center font-bold text-[10px] pb-1"
                      onClick={handleMinimize}
                      title="Minimize"
                    >_</button>
                    <button 
                      className="bg-win95-bg shadow-win95-out w-4 h-4 flex items-center justify-center font-bold text-[10px] pb-2"
                      onClick={handleMaximize}
                      title={isMaximized ? "Restore" : "Maximize"}
                    >{isMaximized ? '❐' : '□'}</button>
                  </>
                )}
                <button className="bg-win95-bg shadow-win95-out w-4 h-4 flex items-center justify-center font-bold text-[10px] pt-[-2px]" onClick={onClose}>x</button>
            </div>
        </div>

        {!isMobile && (
          <div className="flex gap-3 p-1 border-b border-win95-light shadow-win95-flat mb-1 px-2 text-sm bg-win95-bg">
              {['File', 'Edit', 'View', 'Image', 'Options', 'Help'].map(item => (
                  <span key={item} className="cursor-pointer hover:bg-win95-blue hover:text-white px-1">
                      <span className="underline">{item[0]}</span>{item.slice(1)}
                  </span>
              ))}
          </div>
        )}

        <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden gap-1 p-1`}>
            <div className={`${isMobile ? 'flex flex-row justify-center gap-1 p-1' : 'w-16 flex flex-col gap-1 items-center shrink-0'} bg-win95-bg`}>
                <div className={`${isMobile ? 'flex flex-row gap-1' : 'grid grid-cols-2 gap-0.5 p-0.5 border-t border-l border-win95-light border-b border-r border-win95-dark'} bg-win95-bg`}>
                    {(isMobile ? tools : allTools).map(tool => (
                        <RetroButton 
                        key={tool.id}
                        active={activeTool === tool.id} 
                        onClick={() => setActiveTool(tool.id)}
                        className="w-6 h-6 p-0"
                        >
                        {tool.icon}
                        </RetroButton>
                    ))}
                </div>
                
                <RetroButton 
                  onClick={handleClear}
                  className={`${isMobile ? 'px-2 py-1' : 'w-full mt-2 p-1'} text-xs flex items-center justify-center gap-1`}
                  title="Clear Canvas"
                >
                  <Trash2 size={12} /> {!isMobile && 'Clear'}
                </RetroButton>
            </div>

            <div className="flex-1 bg-win95-dark/20 p-2 shadow-win95-in overflow-auto flex items-center justify-center">
                <div className="bg-white relative shadow-win95-out cursor-crosshair touch-none">
                     <canvas
                        ref={canvasRef}
                        width={canvasWidth}
                        height={canvasHeight}
                        className="pointer-events-auto touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                     />
                </div>
            </div>
        </div>

        <div className={`${isMobile ? 'h-auto p-1' : 'h-12'} bg-win95-bg border-t border-win95-light p-1 flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
             <div className={`flex ${isMobile ? 'flex-row justify-center' : 'flex-row'} gap-1`}>
               <div className="w-8 h-8 shadow-win95-in bg-white relative shrink-0">
                   <div className="absolute top-1 left-1 w-4 h-4 z-10 shadow-win95-out" style={{backgroundColor: activeColor}}></div>
                   <div className="absolute bottom-1 right-1 w-4 h-4 bg-white z-0 border border-gray-400"></div>
               </div>
             </div>
             <div className="flex-1 flex flex-col gap-0.5 overflow-x-auto">
                 <div className="flex gap-0.5 h-4">
                     {colors.slice(0, isMobile ? 10 : 14).map(c => 
                         <div key={c} className="w-4 h-4 shadow-win95-in cursor-pointer border border-transparent hover:border-white shrink-0" style={{backgroundColor: c}} onClick={() => setActiveColor(c)}></div>
                     )}
                 </div>
                 <div className="flex gap-0.5 h-4">
                     {colors.slice(14, isMobile ? 24 : 28).map(c => 
                         <div key={c} className="w-4 h-4 shadow-win95-in cursor-pointer border border-transparent hover:border-white shrink-0" style={{backgroundColor: c}} onClick={() => setActiveColor(c)}></div>
                     )}
                 </div>
             </div>
        </div>

        <div className="h-6 border-t border-win95-light shadow-win95-in bg-win95-bg flex items-center px-1 text-xs gap-2">
            <div className="flex-1 truncate text-[10px]">{isMobile ? '' : 'For Help, click Help Topics on the Help Menu.'}</div>
            <div className="text-[10px] sm:text-xs font-bold text-black truncate">shalev amin | @shalev.amin</div>
        </div>
      </div>
    </Draggable>
  );
};

export default PaintApp;
