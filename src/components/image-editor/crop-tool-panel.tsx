import { useState } from "react";
import { X, Check } from "lucide-react";
import type { CanvasRef } from "./canvas-wrapper";

const CropToolPanel = (
  { canvasControls, visible }:
  { canvasControls: CanvasRef | null; visible: boolean; }
) => {
  const [selectedRatio, setSelectedRatio] = useState("Free");
  const [lockAspect, setLockAspect] = useState(false);

  if(!visible) return;

  const getAspectRatio = (ratio: string): number | null => {
    if (ratio === "Free") return null;
    const [w, h] = ratio.split(":").map(Number);
    return h !== 0 ? w / h : null;
  };

  const handleRatioChange = (value: string) => {
    setSelectedRatio(value);
    const ratio = getAspectRatio(value);
    canvasControls?.setCropAspectRatio?.(ratio);
  };

  const handleLockToggle = () => {
    const next = !lockAspect;
    setLockAspect(next);
    canvasControls?.setLockAspect?.(next);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-t w-full max-w-2xl mx-auto bg-white rounded-md shadow text-sm">
      <div className="flex gap-2">
        {/* You can remove this button if not needed */}
        <button
          className="p-1 rounded hover:bg-red-100"
          onClick={() => canvasControls?.cancelCrop()}
        >
          <X className="w-5 h-5 text-red-500" />
        </button>
        <button
          className="p-1 rounded hover:bg-green-100"
          onClick={() => canvasControls?.applyCrop()}
        >
          <Check className="w-5 h-5 text-green-600" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-gray-600">Ratio</label>
        <select
          className="border px-2 py-1 rounded text-sm"
          value={selectedRatio}
          onChange={(e) => handleRatioChange(e.target.value)}
        >
          <option value="Free">Free</option>
          <option value="1:1">1:1</option>
          <option value="4:3">4:3</option>
          <option value="16:9">16:9</option>
        </select>
      </div>

      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          id="lock"
          className="accent-blue-500"
          checked={lockAspect}
          onChange={handleLockToggle}
        />
        <label htmlFor="lock" className="text-gray-600 select-none">
          Lock aspect
        </label>
      </div>
    </div>
  );
};

export default CropToolPanel;
