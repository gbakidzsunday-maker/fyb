import React, { useRef, useEffect } from 'react';

interface PhotoEditorProps {
  photoUrl: string;
  photoZoom: number;
  setPhotoZoom: (zoom: number) => void;
  photoPosition: { x: number; y: number };
  setPhotoPosition: (pos: { x: number; y: number }) => void;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  photoUrl,
  photoZoom,
  setPhotoZoom,
  photoPosition,
  setPhotoPosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;
    
    setPhotoPosition({
      x: photoPosition.x + deltaX,
      y: photoPosition.y + deltaY
    });
    
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleMouseMove(e);
    const onUp = () => handleMouseUp();
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [photoPosition, setPhotoPosition]);

  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <div className="flex flex-col md:flex-row items-center gap-16 w-full justify-center">
        {/* Editor Preview Canvas */}
        <div 
          ref={containerRef}
          className="relative w-[320px] aspect-[4/5] bg-[#021a11] overflow-hidden cursor-move border-[6px] border-emerald-500/30 rounded-[40px] shadow-3xl group"
          onMouseDown={handleMouseDown}
        >
          <img
            src={photoUrl}
            alt="Crop Preview"
            className="absolute max-w-none pointer-events-none origin-center"
            style={{
              transform: `translate(${photoPosition.x}px, ${photoPosition.y}px) scale(${photoZoom})`,
              transition: isDragging.current ? 'none' : 'transform 0.1s ease-out'
            }}
          />
          <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-[100%] h-[100%] border border-white/20 border-dashed rounded-3xl" />
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex-1 max-w-sm space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <label className="text-xs font-black uppercase tracking-[4px] text-white/40">Zoom Scale</label>
               <span className="text-2xl font-black text-emerald-500">{photoZoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.05"
              value={photoZoom}
              onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
              className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 border border-white/10"
            />
          </div>
          
          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
             <p className="text-white font-bold mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               Editing Tips
             </p>
             <ul className="text-xs text-white/50 space-y-2 leading-relaxed font-medium">
               <li>• Drag the image within the frame to center it.</li>
               <li>• Use the zoom slider to adjust the portrait size.</li>
               <li>• Ensure the student's face is clearly visible.</li>
             </ul>
          </div>
          
          <button 
            onClick={() => { setPhotoPosition({ x: 0, y: 0 }); setPhotoZoom(1); }}
            className="w-full py-4 text-xs font-black uppercase tracking-[4px] text-white/20 hover:text-white transition-colors"
          >
            Reset Position
          </button>
        </div>
      </div>
    </div>
  );
};
