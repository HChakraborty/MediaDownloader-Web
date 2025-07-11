import React, { Suspense, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import ExpandableChildren from "@/ui/expandable-children";
import BottomEditToolbar from "./bottom-toolbar";
import CanvasApp from "./canvas-wrapper";
import ImageControls from "./image-controls";
const CropToolPanel = React.lazy(() => import("./crop-tool-panel"));

type CardData = {
  title: string;
  url: string;
  license: string;
  thumbnail: string;
  attribution: string;
  extension?: string;
  width: number;
  height: number;
};

export type ToolType =
  | "Crop"
  | "Rotate"
  | "Resize"
  | "Text"
  | "Exposure"
  | "Round"
  | "Color"
  | "Sharpen"
  | "Blur"
  | "Tilt Shift"
  | "Noise"
  | "Vignette";

export type CanvasRef = {
  undo: () => void;
  redo: () => void;
  resetZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (scale: number) => void;
  fitToScreen: () => void;
  saveHistory: () => void;
  startCrop: () => void;
  cancelCrop: () => void;
  applyCrop: () => void;
  setCropAspectRatio?: (ratio: number | null) => void;
  setLockAspect?: (lock: boolean) => void;
};

const EditorCanvas = ({
  activeEditCard,
  setActiveEditCard,
}: {
  activeEditCard: CardData | null;
  setActiveEditCard: React.Dispatch<React.SetStateAction<CardData | null>>;
}) => {
  const [editorVisible, setEditorVisible] = useState(false);
  const [canvasControls, setCanvasControls] = useState<CanvasRef | null>(null);
  const isZoomingRef = useRef(false);
  const [zoomValue, setZoomValue] = useState(100);
  const [activeTool, setActiveTool] = useState<ToolType | null>("Crop");

  useEffect(() => {
    setEditorVisible(!!activeEditCard);
  }, [activeEditCard]);

  return (
    <ExpandableChildren
      isOpen={editorVisible}
      onClose={() => setActiveEditCard(null)}
      zIndex={7000}
      overlayClassName="bg-black/70"
      className="w-full h-full sm:w-[80vw] sm:h-[80vh] max-w-6xl max-h-[90vh] bg-zinc-100 rounded-lg shadow-lg"
    >
      <div className="relative w-full h-[80vh]">
        {/* Close Button */}
        <button
          onClick={() => setActiveEditCard(null)}
          className="absolute top-3 right-3 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Main Editor Layout */}
        {editorVisible && (
          <div className="flex flex-col h-full w-full">
            {/* Canvas and tool panel */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pt-4 overflow-hidden">
              <CanvasApp
                activeEditCard={activeEditCard}
                onReady={setCanvasControls}
                isZoomingRef={isZoomingRef}
                setZoomValue={setZoomValue}
              />

              {/* Zoom controls */}
              <div className="mt-2">
                <ImageControls
                  canvasControls={canvasControls}
                  isZoomingRef={isZoomingRef}
                  zoomValue={zoomValue}
                  setZoomValue={setZoomValue}
                />

                {/* Tool Panel Container with Placeholder */}
                <div className="mt-2 min-h-[76px]">
                  {activeTool === "Crop" && (
                    <Suspense fallback={null}>
                      <CropToolPanel
                        canvasControls={canvasControls}
                        visible={true}
                      />
                    </Suspense>
                  )}

                  {activeTool === null && (
                    <div className="p-3 border-t w-full max-w-2xl mx-auto bg-white rounded-md shadow text-sm h-[76px]" />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="shrink-0">
              <BottomEditToolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
              />
            </div>
          </div>
        )}
      </div>
    </ExpandableChildren>
  );
};

export default EditorCanvas;
