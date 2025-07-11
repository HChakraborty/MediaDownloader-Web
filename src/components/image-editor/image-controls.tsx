// components/editor/tools/CropControls.tsx
import {
  Undo2,
  Redo2,
  Minus,
  Plus,
  Home,
  Maximize,
  Minimize,
} from "lucide-react";


type CanvasRef = {
  undo: () => void;
  redo: () => void;
  resetZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (scale: number) => void;
  fitToScreen: () => void;
  saveHistory: () => void;
};

const ImageControls = ({
  canvasControls,
  isZoomingRef,
  setZoomValue,
  zoomValue
}: {
  canvasControls: CanvasRef | null;
  isZoomingRef: React.RefObject<boolean>;
  setZoomValue: (e: number) => void;
  zoomValue: number;
}) => {
  
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 border-none bg-zinc-100 text-black text-sm w-fit mx-auto mb-0">
      <Undo2
        className="w-4 h-4 text-black/80 cursor-pointer"
        onClick={() => canvasControls?.undo()}
      />
      <Redo2
        className="w-4 h-4 text-black/80 cursor-pointer"
        onClick={() => canvasControls?.redo()}
      />
      <Minus
        className="w-4 h-4 text-black/80 cursor-pointer"
        onClick={() => canvasControls?.zoomOut()}
      />
      <input
        type="range"
        min="1"
        max="200"
        defaultValue="100"
        className="accent-blue-500 w-24 h-1"
        onChange={(e) => {
          const percent = parseInt(e.target.value, 10);
          const scale = percent / 100;
          setZoomValue(percent);
          isZoomingRef.current = true;
          canvasControls?.setZoom?.(scale);
        }}
        onMouseUp={() => {
          if (isZoomingRef.current) {
            isZoomingRef.current = false;
            canvasControls?.saveHistory(); // <-- Explicit final save
          }
        }}
        onTouchEnd={() => {
          if (isZoomingRef.current) {
            isZoomingRef.current = false;
            canvasControls?.saveHistory();
          }
        }}
      />

      <Plus
        className="w-4 h-4 text-black/80 cursor-pointer"
        onClick={() => canvasControls?.zoomIn()}
      />
      <span className="w-10 text-center text-black">{zoomValue}%</span>
      <Home
        className="w-4 h-4 text-black/80 cursor-pointer"
        onClick={() => canvasControls?.resetZoom()}
      />
      <Maximize
        className="w-4 h-4 text-black/80 cursor-pointer"
        onClick={() => canvasControls?.fitToScreen()}
      />
      <Minimize
        className="w-4 h-4 text-black/80 cursor-pointer"
        onClick={() => canvasControls?.resetZoom()}
      />
    </div>
  );
};

export default ImageControls;
