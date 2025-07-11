import {
  Crop,
  RotateCw,
  Square,
  Sparkles,
  Gem,
  Droplet,
  Focus,
  Waves,
  SquareDashed,
  Ruler,
  Type
} from "lucide-react";
import Tool from "./tool";
import type { ToolType } from "./editor-canvas";

const tools: { label: ToolType; icon: React.ReactNode }[] = [
  { label: "Crop", icon: <Crop size={24} /> },
  { label: "Rotate", icon: <RotateCw size={24} /> },
  { label: "Resize", icon: <Ruler size={24} /> },
  { label: "Text", icon: <Type size={24} /> },
  { label: "Exposure", icon: <CircleHalf className="w-6 h-6 text-blue-500" /> },
  { label: "Round", icon: <SquareDashed size={24} /> },
  { label: "Color", icon: <Sparkles size={24} /> },
  { label: "Sharpen", icon: <Gem size={24} /> },
  { label: "Blur", icon: <Droplet size={24} /> },
  { label: "Tilt Shift", icon: <Focus size={24} /> },
  { label: "Noise", icon: <Waves size={24} /> },
  { label: "Vignette", icon: <Square size={24} /> },
];

const BottomEditToolbar = ({
  setActiveTool,
  activeTool,
}: {
  setActiveTool: React.Dispatch<React.SetStateAction<ToolType | null>>;
  activeTool: ToolType | null;
}) => {
  return (
    <div className="w-full border-t bg-white px-4 py-2">
      <div className="flex justify-center gap-4 overflow-x-auto">
        {tools.map((tool) => (
          <Tool
            key={tool.label}
            icon={tool.icon}
            label={tool.label}
            active={activeTool === tool.label}
            onClick={() => {
              const next = tool.label === activeTool ? null : tool.label;
              setActiveTool(next);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomEditToolbar;


// components/icons/CircleHalf.tsx
function CircleHalf(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" stroke="none" />
    </svg>
  );
}
