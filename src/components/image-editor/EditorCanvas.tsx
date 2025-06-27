"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useOutsideClick } from "@/ui/useOutsideClick";
import ImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import {
  IconCrop, IconFlipHorizontal, IconFlipVertical, IconRotateClockwise, IconTypography,
  IconRefresh, IconDownload, IconZoomIn, IconZoomOut, IconSquare, IconCircle,
  IconBrush, IconEraser, IconArrowBackUp, IconArrowForwardUp, IconResize,
  IconAdjustments, IconZoomReset,
} from "@tabler/icons-react";

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

const EditorCanvas = ({
  activeEditCard,
  setActiveEditCard,
}: {
  activeEditCard: CardData | null;
  setActiveEditCard: React.Dispatch<React.SetStateAction<CardData | null>>;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorVisible, setEditorVisible] = useState(false);

  useEffect(() => {
    import("fabric").then((fabricModule) => {
      (window as any).fabric = fabricModule.default;
    });
  }, []);

  useOutsideClick(wrapperRef, () => {
    if (activeEditCard) setActiveEditCard(null);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveEditCard(null);
    };

    if (activeEditCard) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "auto";
      setEditorVisible(false);
    }

    return () => window.removeEventListener("keydown", onKey);
  }, [activeEditCard, setActiveEditCard]);

  if (!activeEditCard) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-40"
      />
      <motion.div
        key="editor"
        ref={wrapperRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onAnimationComplete={() => setEditorVisible(true)}
        className="fixed inset-0 z-6000 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden flex">
          <button
            onClick={() => setActiveEditCard(null)}
            className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
          {editorVisible && <CustomImageEditor activeEditCard={activeEditCard} />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditorCanvas;

function CustomImageEditor({ activeEditCard }: { activeEditCard: CardData }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ImageEditor | null>(null);
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState({ width: 800, height: 600 });

  const safeCall = (fn: (ed: ImageEditor) => void) => {
    const ed = instanceRef.current;
    if (!ed) return console.warn("Editor not ready");
    try {
      fn(ed);
    } catch (err) {
      console.error("Editor action failed", err);
    }
  };

  useEffect(() => {
    let cancelled = false;

    if (!editorRef.current) return;

    if (!instanceRef.current) {
      instanceRef.current = new ImageEditor(editorRef.current, {
        cssMaxWidth: 800,
        cssMaxHeight: 600,
        usageStatistics: false,
      });
    }

    const preloadAndLoad = async () => {
      const img = new Image();
      img.src = activeEditCard.url;
      try {
        await img.decode();
        if (!cancelled) loadIntoEditor(activeEditCard.url, activeEditCard.title);
      } catch {
        console.warn("Primary image failed, trying thumbnail");
        img.src = activeEditCard.thumbnail;
        try {
          await img.decode();
          if (!cancelled) loadIntoEditor(activeEditCard.thumbnail, activeEditCard.title + " fallback");
        } catch {
          console.error("Both image and thumbnail failed to load");
        }
      }
    };

    const loadIntoEditor = async (url: string, title: string) => {
      if (!instanceRef.current) return;
      await instanceRef.current.loadImageFromURL(url, title);
      instanceRef.current.clearUndoStack();

      const canvas = (instanceRef.current as any)._graphics.getCanvas();
      const image = canvas.getObjects().find((obj: any) => obj.type === "image");
      if (image) {
        const scale = Math.max(size.width / image.width, size.height / image.height);
        image.set({ scaleX: scale, scaleY: scale, left: 0, top: 0 });
        canvas.renderAll();
      }
    };

    preloadAndLoad();

    return () => {
      cancelled = true;
    };
  }, [activeEditCard]);

  const actions = {
    crop: () => safeCall(ed => ed.startDrawingMode?.("CROPPER")),
    applyCrop: () => safeCall(ed => {
      const rect = ed.getCropzoneRect?.();
      if (rect && rect.width > 0 && rect.height > 0) {
        ed.crop?.(rect);
      }
      ed.stopDrawingMode?.();
    }),
    flipX: () => safeCall(ed => ed.flipX?.()),
    flipY: () => safeCall(ed => ed.flipY?.()),
    rotate: () => safeCall(ed => ed.rotate?.(90)),
    addText: () => safeCall(ed => ed.addText?.("Sample Text", {
      styles: { fill: "#333", fontSize: 32 },
      position: { x: 100, y: 100 }
    })),
    addShape: (type: "rect" | "circle") => safeCall(ed => ed.addShape?.(type, {
      fill: "rgba(255,255,255,0.3)", stroke: "#333", strokeWidth: 2,
      width: 100, height: 100,
      rx: type === "circle" ? 50 : 0,
      ry: type === "circle" ? 50 : 0
    })),
    draw: () => safeCall(ed => ed.startDrawingMode?.("FREE_DRAWING", { width: 5, color: "#ff0000" })),
    stopDraw: () => safeCall(ed => ed.stopDrawingMode?.()),
    filter: (name: string) => safeCall(ed => ed.applyFilter?.(name)),
    undo: () => safeCall(ed => ed.undo?.()),
    redo: () => safeCall(ed => ed.redo?.()),
    reset: () => safeCall(ed => ed.loadImageFromURL?.(activeEditCard.url, activeEditCard.title)
      ?.then(() => ed.clearUndoStack?.())
      .catch(err => console.warn("Reset failed", err))),
    download: () => safeCall(ed => {
      const url = ed.toDataURL?.();
      if (url) {
        const a = document.createElement("a");
        a.download = "edited-image.png";
        a.href = url;
        a.click();
      }
    }),
    zoomIn: () => setZoom(z => Math.min(z + 0.1, 3)),
    zoomOut: () => setZoom(z => Math.max(z - 0.1, 0.1)),
    resetZoom: () => setZoom(1),
    resize: () => setSize({ width: 600, height: 400 }),
  };

  return (
    <div className="flex h-full w-full">
      <div className="bg-neutral-100 border-r w-48 flex flex-col gap-2 p-2 overflow-y-auto">
        <Tool label="Start Crop" icon={<IconCrop size={20} />} onClick={actions.crop} />
        <Tool label="Apply Crop" icon={<IconCrop size={20} />} onClick={actions.applyCrop} />
        <Tool label="Flip X" icon={<IconFlipHorizontal size={20} />} onClick={actions.flipX} />
        <Tool label="Flip Y" icon={<IconFlipVertical size={20} />} onClick={actions.flipY} />
        <Tool label="Rotate" icon={<IconRotateClockwise size={20} />} onClick={actions.rotate} />
        <Tool label="Add Text" icon={<IconTypography size={20} />} onClick={actions.addText} />
        <Tool label="Rectangle" icon={<IconSquare size={20} />} onClick={() => actions.addShape("rect")} />
        <Tool label="Circle" icon={<IconCircle size={20} />} onClick={() => actions.addShape("circle")} />
        <Tool label="Draw" icon={<IconBrush size={20} />} onClick={actions.draw} />
        <Tool label="Stop Draw" icon={<IconEraser size={20} />} onClick={actions.stopDraw} />
        <Tool label="Grayscale" icon={<IconAdjustments size={20} />} onClick={() => actions.filter("grayscale")} />
        <Tool label="Invert" icon={<IconAdjustments size={20} />} onClick={() => actions.filter("invert")} />
        <Tool label="Undo" icon={<IconArrowBackUp size={20} />} onClick={actions.undo} />
        <Tool label="Redo" icon={<IconArrowForwardUp size={20} />} onClick={actions.redo} />
        <Tool label="Reset" icon={<IconRefresh size={20} />} onClick={actions.reset} />
        <Tool label="Zoom In" icon={<IconZoomIn size={20} />} onClick={actions.zoomIn} />
        <Tool label="Zoom Out" icon={<IconZoomOut size={20} />} onClick={actions.zoomOut} />
        <Tool label="Reset Zoom" icon={<IconZoomReset size={20} />} onClick={actions.resetZoom} />
        <Tool label="Resize" icon={<IconResize size={20} />} onClick={actions.resize} />
        <Tool label="Download" icon={<IconDownload size={20} />} onClick={actions.download} />
      </div>
      <div className="flex-1 flex justify-center items-center bg-gray-50 overflow-auto">
        <div
          ref={editorRef}
    style={{
      width: `${size.width * zoom}px`,
      height: `${size.height * zoom}px`,
      maxWidth: "100%",
      maxHeight: "100%",
    }}
          className="border border-gray-300"
        />
      </div>
    </div>
  );
}

function Tool({
  icon, label, onClick,
}: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-2 rounded hover:bg-neutral-300 transition text-sm"
    >
      {icon}
      <span className="whitespace-pre">{label}</span>
    </button>
  );
}
