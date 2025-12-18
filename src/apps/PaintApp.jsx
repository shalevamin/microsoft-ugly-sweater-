import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Pencil, Eraser, MousePointer2, Type, Slash, Square, Circle, Trash2, Minimize2, Maximize2 } from 'lucide-react';
import RetroButton from '../components/ui/RetroButton';

const PaintApp = ({ onClose, initialImage }) => {
  const [activeTool, setActiveTool] = useState('pencil');
  const [activeColor, setActiveColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  
  const canvasRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  // Tools configuration
  const tools = [
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

  // Draw watermark function
  const drawWatermark = (ctx) => {
    ctx.save();
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('made by shalev amin | IG: @shalev.amin', 590, 390);
    ctx.restore();
  };

  useEffect(() => {
    if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // White background
        drawWatermark(ctx);
        setContext(ctx);
    }
  }, []);

  // Handle Imported Image
  useEffect(() => {
    if (initialImage && context) {
        const img = new Image();
        img.src = initialImage;
        img.onload = () => {
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, 600, 400);
            
            // Calculate aspect ratio fit
            const scale = Math.min(600 / img.width, 400 / img.height);
            const x = (600 - img.width * scale) / 2;
            const y = (400 - img.height * scale) / 2;
            
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
            drawWatermark(context);
        };
    }
  }, [initialImage, context]);

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
        context.lineWidth = 1;
    } else {
        context.strokeStyle = activeColor;
        context.lineWidth = 1;
    }
  }, [activeTool, activeColor, context]);

  const startDrawing = (e) => {
    if (!context || !['pencil', 'brush', 'eraser'].includes(activeTool)) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    lastPos.current = { x: offsetX, y: offsetY };
    
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = e.nativeEvent;
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
    context.fillRect(0, 0, 600, 400);
    drawWatermark(context);
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
    return null; // Hidden when minimized (taskbar will show it)
  }

  return (
    <Draggable handle=".window-handle" bounds="parent" nodeRef={windowRef} disabled={isMaximized}>
      <div 
        ref={windowRef}
        className="absolute z-20 shadow-win95-out bg-win95-bg flex flex-col"
        style={{ 
          width: windowSize.width, 
          height: windowSize.height,
          top: isMaximized ? 0 : 30,
          left: isMaximized ? 0 : 150,
          resize: 'both',
          overflow: 'hidden',
          minWidth: 400,
          minHeight: 300
        }}
      >
        <div className="window-handle bg-gradient-to-r from-win95-blue to-[#1084d0] px-1 py-0.5 flex justify-between items-center cursor-default select-none">
            <div className="flex items-center gap-1">
                <img src="/paint-icon.png" alt="icon" className="w-4 h-4" />
                <span className="text-white font-pixel text-sm tracking-wider font-bold">untitled - Paint</span>
            </div>
            <div className="flex gap-0.5">
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
                <button className="bg-win95-bg shadow-win95-out w-4 h-4 flex items-center justify-center font-bold text-[10px] pt-[-2px]" onClick={onClose}>x</button>
            </div>
        </div>

        <div className="flex gap-3 p-1 border-b border-win95-light shadow-win95-flat mb-1 px-2 text-sm bg-win95-bg">
            {['File', 'Edit', 'View', 'Image', 'Options', 'Help'].map(item => (
                <span key={item} className="cursor-pointer hover:bg-win95-blue hover:text-white px-1">
                    <span className="underline">{item[0]}</span>{item.slice(1)}
                </span>
            ))}
        </div>

        <div className="flex-1 flex flex-row overflow-hidden gap-1 p-1">
            <div className="w-16 bg-win95-bg flex flex-col gap-1 items-center shrink-0">
                <div className="grid grid-cols-2 gap-0.5 p-0.5 border-t border-l border-win95-light border-b border-r border-win95-dark bg-win95-bg">
                    {tools.map(tool => (
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
                
                {/* Clear Button */}
                <RetroButton 
                  onClick={handleClear}
                  className="w-full mt-2 text-xs flex items-center justify-center gap-1 p-1"
                  title="Clear Canvas"
                >
                  <Trash2 size={12} /> Clear
                </RetroButton>
            </div>

            <div className="flex-1 bg-win95-dark/20 p-2 shadow-win95-in overflow-auto flex items-start justify-center">
                <div className="bg-white relative shadow-win95-out cursor-crosshair">
                     <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="pointer-events-auto"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                     />
                </div>
            </div>
        </div>

        <div className="h-12 bg-win95-bg border-t border-win95-light p-1 flex gap-2">
             <div className="w-8 h-8 shadow-win95-in bg-white relative">
                 <div className="absolute top-1 left-1 w-4 h-4 z-10 shadow-win95-out" style={{backgroundColor: activeColor}}></div>
                 <div className="absolute bottom-1 right-1 w-4 h-4 bg-white z-0 border border-gray-400"></div>
             </div>
             <div className="flex-1 flex flex-col gap-0.5">
                 <div className="flex gap-0.5 h-4">
                     {colors.slice(0, 14).map(c => 
                         <div key={c} className="w-4 h-4 shadow-win95-in cursor-pointer border border-transparent hover:border-white" style={{backgroundColor: c}} onClick={() => setActiveColor(c)}></div>
                     )}
                 </div>
                 <div className="flex gap-0.5 h-4">
                     {colors.slice(14).map(c => 
                         <div key={c} className="w-4 h-4 shadow-win95-in cursor-pointer border border-transparent hover:border-white" style={{backgroundColor: c}} onClick={() => setActiveColor(c)}></div>
                     )}
                 </div>
             </div>
        </div>

        <div className="h-6 border-t border-win95-light shadow-win95-in bg-win95-bg flex items-center px-1 text-xs gap-4">
            <div className="flex-1 truncate">For Help, click Help Topics on the Help Menu.</div>
            <div className="text-xs font-bold text-black">made by shalev amin | IG: @shalev.amin</div>
        </div>
      </div>
    </Draggable>
  );
};

export default PaintApp;
