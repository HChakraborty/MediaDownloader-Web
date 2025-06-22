"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useOutsideClick } from "@/ui/useOutsideClick";

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
  const canvasRef = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [fabricModule, setFabricModule] = useState<any>(null);
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveEditCard(null);
      }
    }

    if (activeEditCard) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeEditCard, setActiveEditCard]);

useOutsideClick(editorRef as React.RefObject<HTMLDivElement>, () => setActiveEditCard(null));


  useEffect(() => {
    if (!activeEditCard) return;

    (async () => {
      const fabric = (await import("fabric")).default;
      setFabricModule(fabric);

      const canvas = new fabric.Canvas("canvas", {
        width: 900,
        height: 600,
        backgroundColor: "#f8f9fa",
      });

      canvasRef.current = canvas;
      saveHistory(canvas);
    })();
  }, [activeEditCard]);

  const saveHistory = (canvas: any) => {
    const json = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && fabricModule) {
      const url = URL.createObjectURL(e.target.files[0]);
      fabricModule.Image.fromURL(url, (img: any) => {
        const maxW = canvasRef.current.width;
        const maxH = canvasRef.current.height;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (maxW - img.width * scale) / 2,
          top: (maxH - img.height * scale) / 2,
        });
        canvasRef.current.add(img);
        canvasRef.current.setActiveObject(img);
        canvasRef.current.requestRenderAll();
        saveHistory(canvasRef.current);
      });
    }
  };

  const addRect = () => {
    if (!fabricModule) return;
    const rect = new fabricModule.Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: color,
    });
    canvasRef.current.add(rect);
    saveHistory(canvasRef.current);
  };

  const addCircle = () => {
    if (!fabricModule) return;
    const circle = new fabricModule.Circle({
      left: 200,
      top: 200,
      radius: 50,
      fill: color,
    });
    canvasRef.current.add(circle);
    saveHistory(canvasRef.current);
  };

  const addText = () => {
    if (!fabricModule) return;
    const text = new fabricModule.Textbox("Edit me", {
      left: 300,
      top: 300,
      fill: color,
      fontSize: 24,
    });
    canvasRef.current.add(text);
    saveHistory(canvasRef.current);
  };

  const startDraw = () => {
    if (canvasRef.current) {
      canvasRef.current.isDrawingMode = true;
      canvasRef.current.freeDrawingBrush.color = color;
      canvasRef.current.freeDrawingBrush.width = 3;
    }
  };

  const stopDraw = () => {
    if (canvasRef.current) {
      canvasRef.current.isDrawingMode = false;
      saveHistory(canvasRef.current);
    }
  };

  const exportImage = () => {
    const dataUrl = canvasRef.current?.toDataURL({ format: "png" });
    if (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "image.png";
      link.click();
    }
  };

  const doUndo = () => {
    if (historyIndex > 0) {
      const json = history[historyIndex - 1];
      canvasRef.current.loadFromJSON(json, () => {
        canvasRef.current.renderAll();
        setHistoryIndex(historyIndex - 1);
      });
    }
  };

  const doRedo = () => {
    if (historyIndex < history.length - 1) {
      const json = history[historyIndex + 1];
      canvasRef.current.loadFromJSON(json, () => {
        canvasRef.current.renderAll();
        setHistoryIndex(historyIndex + 1);
      });
    }
  };

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
        ref={editorRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed inset-0 z-[6000] flex items-center justify-center p-4"
      >
        <div className="relative bg-white rounded-lg p-6 shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
          <button
            onClick={() => setActiveEditCard(null)}
            className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-center text-xl font-semibold mb-4">
            🎨 Fabric.js Image Editor
          </h2>

          <div className="flex flex-wrap gap-4 justify-center mb-4">
            <div className="flex flex-col items-center gap-2">
              <input
                type="file"
                onChange={handleUpload}
                className="border border-gray-300 rounded p-2 bg-white"
              />
              <SketchPicker
                color={color}
                onChange={(c: { hex: React.SetStateAction<string>; }) => setColor(c.hex)}
              />
            </div>

            <div className="flex flex-col gap-2">
              {[
                { label: "Add Rectangle", onClick: addRect },
                { label: "Add Circle", onClick: addCircle },
                { label: "Add Text", onClick: addText },
                { label: "Start Draw", onClick: startDraw },
                { label: "Stop Draw", onClick: stopDraw },
                { label: "Undo", onClick: doUndo },
                { label: "Redo", onClick: doRedo },
                { label: "Export PNG", onClick: exportImage },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.onClick}
                  className="bg-gray-700 hover:bg-gray-800 text-white rounded px-3 py-2"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <canvas
              id="canvas"
              className="border-2 border-gray-700 rounded shadow"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditorCanvas;
