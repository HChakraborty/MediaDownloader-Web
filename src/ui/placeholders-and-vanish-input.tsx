import { motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import cn from "@/utils/tailwindMerge";
import { textPlaceholder } from "@/constants/constants";
import { Search } from "lucide-react";
import { SearchBarSuggestions } from "@/pages/home-page/mobile-search-bar";
import { useSuggestions } from "@/hooks/words-fetch";

type functionProps = {
  onSubmit: (e: string) => void;
  downloadComplete: boolean;
  setDownloadComplete: (e: boolean) => void;
  showMobileBar: boolean;
  setMobileSearchBarOpen: (e: boolean) => void;
  inputRef?: React.RefObject<HTMLElement>;
  setMobileValue?: (e: string) => void;
};

const PlaceholdersAndVanishInput = (props: functionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const suggestions = useSuggestions(value, 2, 600); // 600ms throttle, min 2 chars

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (props.inputRef?.current) {
      props.inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = useCallback((start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.downloadComplete && e.key === "Enter" && !animating) {
      e.preventDefault();
      vanishAndSubmit();
      props.onSubmit && props.onSubmit(value);
      props.setDownloadComplete(false);
      props.setMobileSearchBarOpen(false);
      setShowDropdown(false);
    }
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const value = inputRef.current?.value || "";
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (props.downloadComplete && !animating) {
      e.preventDefault();
      vanishAndSubmit();
      props.onSubmit && props.onSubmit(value);
      props.setDownloadComplete(false);
      props.setMobileSearchBarOpen(false);
      setShowDropdown(false);
    }
  };

  const handleClick = () => {
    if (props.showMobileBar) {
      props.setMobileSearchBarOpen(props.showMobileBar);
    }
  };
  return (
    <div className="relative z-[1000] w-full">
      <form
        className={cn(
          "w-full relative mx-auto bg-zinc-100 dark:bg-zinc-900 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
          value && "bg-zinc-200"
        )}
        onSubmit={handleSubmit}
      >
        {/* Canvas for animation */}
        <canvas
          className={cn(
            "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
            !animating ? "opacity-0" : "opacity-100"
          )}
          ref={canvasRef}
        />

        {/* Search icon */}
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 z-40">
          <Search className="h-4 w-4" />
        </div>

        {/* Input wrapper with placeholder overlay */}
        <div className="relative w-full h-full">
          {/* Fake placeholder overlay with truncation */}
          {!value && (
            <div className="absolute left-10 sm:left-12 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-gray-400 pointer-events-none truncate w-[calc(100%-3.5rem)] sm:w-[calc(100%-5rem)]">
              {textPlaceholder}
            </div>
          )}

          {/* Actual input */}
          <input
            onChange={(e) => {
              const inputVal = e.target.value;
              setValue(inputVal);

              if (props.setMobileValue) props.setMobileValue(inputVal);

              // Only show dropdown if value is long enough and desktop
              if (inputVal.length >= 2 && window.innerWidth > 768) {
                setShowDropdown(true);
              } else {
                setShowDropdown(false);
              }
            }}
            onKeyDown={handleKeyDown}
            onClick={() => handleClick()}
            ref={inputRef}
            value={value}
            type="text"
            placeholder=""
            className={cn(
              "w-full relative z-50 border-none text-sm sm:text-base dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-10 sm:pl-12 pr-20 truncate disabled:opacity-50 disabled:cursor-not-allowed",
              animating && "text-transparent dark:text-transparent"
            )}
          />
        </div>

        {/* Submit button */}
        <button
          disabled={!value || !props.downloadComplete}
          type="submit"
          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center disabled:cursor-not-allowed"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 h-4 w-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <motion.path
              d="M5 12l14 0"
              initial={{ strokeDasharray: "50%", strokeDashoffset: "50%" }}
              animate={{ strokeDashoffset: value ? 0 : "50%" }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
            <path d="M13 18l6 -6" />
            <path d="M13 6l6 6" />
          </motion.svg>
        </button>
      </form>

      {/* Dropdown below input */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-xl shadow-xl z-[999]">
          <div className="pt-1 text-sm text-gray-500 dark:text-gray-300 max-h-[300px] overflow-y-auto px-8">
            <SearchBarSuggestions
              suggestions={suggestions}
              onSelect={(suggestion) => {
                props.onSubmit(suggestion);
                setShowDropdown(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceholdersAndVanishInput;
