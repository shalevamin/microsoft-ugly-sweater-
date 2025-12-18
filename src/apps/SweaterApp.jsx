import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import { ImagePlus, Save, RefreshCw } from 'lucide-react';
import RetroButton from '../components/ui/RetroButton';
import RetroPopup from '../components/ui/RetroPopup';
import RetroLoadingModal from '../components/ui/RetroLoadingModal';

const SweaterApp = ({ onClose, onExport }) => {
  const [userImage, setUserImage] = useState(null);
  const [showSweater, setShowSweater] = useState(false);
  const [roastMessage, setRoastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sweaterOpacity, setSweaterOpacity] = useState(1);
  const [genStatus, setGenStatus] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // AI Positioning State (for fallback)
  const [sweaterPos, setSweaterPos] = useState({ x: 0, y: 0 });
  const [sweaterSize, setSweaterSize] = useState({ width: 192, height: 192 });
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const windowRef = useRef(null);
  const sweaterRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserImage(event.target.result);
      setShowSweater(false);
      setSweaterPos({ x: 0, y: 0 }); 
      triggerNanoBanana(file, event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data.split(',')[1]);
      }
    });
  };

  const triggerNanoBanana = async (file, originalDataUrl) => {
    setIsLoading(true);
    setGenStatus('Uploading to Nano Banana...');
    
    try {
      const userBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
      
      const sweaterBase64 = await getBase64FromUrl('/ms-ugly-sweater.png');

      setGenStatus('Generating with Nano Banana Pro...');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { 
                text: "Using the provided images, place the sweater from the second image onto the person in the first image. The person should be wearing the sweater naturally. Keep the person's face, hair, skin tone, and background exactly the same. Only change their clothing to the sweater."
              },
              { 
                inline_data: { 
                  mime_type: file.type, 
                  data: userBase64 
                } 
              },
              { 
                inline_data: { 
                  mime_type: "image/png", 
                  data: sweaterBase64 
                } 
              }
            ]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1K"
            }
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("API Error:", errText);
        throw new Error(`API ${response.status}: ${errText.substring(0, 150)}`);
      }
      
      const rawJson = await response.json();
      console.log("Nano Banana Response:", rawJson);
      
      const parts = rawJson.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(p => p.inlineData || p.inline_data);
      
      if (imgPart) {
        const inlineData = imgPart.inlineData || imgPart.inline_data;
        const b64 = inlineData.data;
        const mime = inlineData.mimeType || inlineData.mime_type || "image/png";
        setUserImage(`data:${mime};base64,${b64}`);
        setRoastMessage("Nano Banana Complete: Fashion upgraded!");
        setGenStatus(null);
        setIsLoading(false);
        return; 
      }
      
      const textPart = parts.find(p => p.text);
      if (textPart) {
        console.warn("AI Text Response:", textPart.text);
        throw new Error(`AI refused: ${textPart.text.substring(0, 100)}...`);
      }
      
      throw new Error("No image in response");

    } catch (error) {
      console.error("Nano Banana Failed", error);
      setRoastMessage(`${error.message}. Manual Mode.`);
      setShowSweater(true);
      setSweaterPos({ x: 0, y: 0 });
    } finally {
      setIsLoading(false);
      setGenStatus(null);
    }
  };

  const handleRoastClose = () => {
    setRoastMessage(null);
  };

  const handleSendToPaint = async () => {
    if (!canvasRef.current || !onExport) return;
    try {
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2
      });
      onExport(canvas.toDataURL());
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = 'ugly-sweater-shalev-edition.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleReset = () => {
    setUserImage(null);
    setShowSweater(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (isMinimized) {
    return null;
  }

  // Mobile: full width, Desktop: original positioning
  const windowStyle = isMobile ? {
    width: '100%',
    height: 'calc(100vh - 40px)',
    top: 0,
    left: 0,
    right: 0,
  } : {
    width: isMaximized ? window.innerWidth - 20 : 700,
    height: isMaximized ? window.innerHeight - 60 : 500,
    top: isMaximized ? 0 : 80,
    right: isMaximized ? 0 : 80,
    left: isMaximized ? 0 : 'auto',
  };

  const canvasSize = isMobile ? Math.min(window.innerWidth - 40, 300) : 400;

  return (
    <Draggable handle=".window-handle" bounds="parent" nodeRef={windowRef} disabled={isMaximized || isMobile}>
      <div 
        ref={windowRef}
        className="absolute z-30 shadow-win95-out bg-win95-bg flex flex-col"
        style={{ 
          ...windowStyle,
          resize: isMobile ? 'none' : 'both',
          overflow: 'hidden',
          minWidth: isMobile ? 'auto' : 400,
          minHeight: isMobile ? 'auto' : 300
        }}
      >
        <div className="window-handle bg-gradient-to-r from-win95-blue to-[#1084d0] px-1 py-0.5 flex justify-between items-center cursor-default select-none">
          <div className="flex items-center gap-1 overflow-hidden">
            <img src="/paint-icon.png" alt="icon" className="w-4 h-4 shrink-0" />
            <span className="text-white font-pixel text-xs sm:text-sm tracking-wider font-bold truncate">
              {isMobile ? 'Ugly Sweater AI' : 'יצירת תמונה עם הסוואצרט המכוער'}
            </span>
          </div>
          <div className="flex gap-0.5 shrink-0">
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
          <div className={`${isMobile ? 'flex flex-row justify-center gap-2 p-2' : 'w-24 flex flex-col gap-2 p-2 items-center border-r border-win95-dark'} bg-win95-bg`}>
            {!isMobile && <div className="text-xs font-bold text-center mb-2">Controls</div>}
            
            <RetroButton onClick={() => fileInputRef.current?.click()} className={`${isMobile ? 'px-4 py-2' : 'w-full p-2'} text-xs flex ${isMobile ? 'flex-row' : 'flex-col'} items-center gap-1`}>
              <ImagePlus size={16} /> Open
            </RetroButton>
            
            {userImage && (
              <>
                <RetroButton onClick={handleSave} className={`${isMobile ? 'px-4 py-2' : 'w-full p-2 mt-2'} text-xs flex ${isMobile ? 'flex-row' : 'flex-col'} items-center gap-1`}>
                  <Save size={16} /> Save
                </RetroButton>
                <RetroButton onClick={handleReset} className={`${isMobile ? 'px-4 py-2' : 'w-full p-2 mt-2'} text-xs flex ${isMobile ? 'flex-row' : 'flex-col'} items-center gap-1 bg-win95-light`}>
                  <RefreshCw size={14} /> Clear
                </RetroButton>
                {!isMobile && (
                  <RetroButton onClick={handleSendToPaint} className="w-full text-xs flex flex-col items-center gap-1 p-2 mt-4 bg-win95-light">
                    <img src="/paint-icon.png" className="w-4 h-4" />
                    To Paint
                  </RetroButton>
                )}
              </>
            )}
            
            {showSweater && !isMobile && (
              <>
                <div className="w-full text-[10px] mt-2 text-center">Sweater Opacity</div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1"
                  value={sweaterOpacity}
                  onChange={(e) => setSweaterOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-win95-dark" 
                />
              </>
            )}
          </div>

          <div className="flex-1 bg-win95-dark/20 p-2 shadow-win95-in overflow-auto flex items-center justify-center relative">
            <div 
              ref={canvasRef}
              className="bg-white relative shadow-win95-out overflow-hidden flex items-center justify-center"
              style={{ width: canvasSize, height: canvasSize }}
            >
              {!userImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-win95-dark pointer-events-none select-none p-4 text-center">
                  <p className={`${isMobile ? 'text-sm' : ''} mb-4`}>No Image Loaded</p>
                  {isMobile && <p className="text-xs text-gray-500">Tap "Open" to upload a photo</p>}
                </div>
              )}
              
              {userImage && (
                <img 
                  src={userImage} 
                  alt="User Upload" 
                  className="w-full h-full object-contain pointer-events-none select-none absolute top-0 left-0"
                />
              )}

              {showSweater && (
                <Draggable 
                  bounds="parent" 
                  nodeRef={sweaterRef}
                  position={sweaterPos}
                  onDrag={(e, data) => setSweaterPos({ x: data.x, y: data.y })}
                >
                  <div 
                    ref={sweaterRef}
                    className="absolute top-1/2 left-1/2 group cursor-move z-20"
                    style={{ 
                      width: sweaterSize.width, 
                      height: sweaterSize.height,
                      marginTop: -(sweaterSize.height/2),
                      marginLeft: -(sweaterSize.width/2)
                    }}
                  >
                    <div className="w-full h-full border-2 border-dashed border-transparent hover:border-black relative">
                      <img 
                        src="/ms-ugly-sweater.png" 
                        alt="Ugly Sweater" 
                        className="w-full h-full object-contain pointer-events-none select-none"
                        style={{ opacity: sweaterOpacity }}
                      />
                    </div>
                  </div>
                </Draggable>
              )}
            </div>
          </div>
        </div>

        <div className={`${isMobile ? 'h-8' : 'h-6'} border-t border-win95-light shadow-win95-in bg-win95-bg flex items-center px-1 text-xs gap-2`}>
          <div className="flex-1 truncate text-[10px] sm:text-xs">{genStatus || "Nano Banana Tech"}</div>
          <div className="w-px h-full bg-win95-dark/50"></div>
          <div className={`${isMobile ? 'text-[8px]' : 'text-xs'} font-bold text-black truncate`}>shalev amin | @shalev.amin</div>
          <div className="w-px h-full bg-win95-dark/50"></div>
          <div className="font-bold shrink-0 text-[10px] sm:text-xs">V 3.0</div>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageUpload}
        />
        
        <RetroLoadingModal isOpen={isLoading} message={genStatus} />

        {!isLoading && roastMessage && (
          <RetroPopup 
            message={roastMessage} 
            onClose={handleRoastClose} 
          />
        )}
      </div>
    </Draggable>
  );
};

export default SweaterApp;
