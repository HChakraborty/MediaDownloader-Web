"use client";

import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { cn } from "@/utils/tailwindMerge";
import { useInView } from "react-intersection-observer";
import { SkeletonCard } from "@/components/display-cards/skeleton-card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ExpandableImage } from "@/components/display-cards/expandable-card";
import * as constant from "../constants/constants";
import { Maximize, Download, ShoppingCart, Info, SquarePen } from "lucide-react";
import downloadImage from "@/hooks/image-download";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import EditorCanvas from "@/components/image-editor/EditorCanvas";

type CardData = {
  title: string;
  url: string;
  thumbnail: string;
  license: string;
  attribution: string;
  width: number;
};

export const CardDisplay = ({
  card,
  index,
  hovered,
  setHovered,
  setActiveCard,
  setEditActiveCard,
}: {
  card: CardData;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveCard: React.Dispatch<React.SetStateAction<CardData | null>>;
  setEditActiveCard: React.Dispatch<React.SetStateAction<CardData | null>>;
}) => {
  const [loaded, setLoaded] = useState(false);

  const [visible, setVisible] = useState(true);
  const [isTouchOnlyDevice, setIsTouchOnlyDevice] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const checkTouchOnly = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const noHover = !window.matchMedia("(hover: hover)").matches;
      setIsTouchOnlyDevice(isTouch && noHover);
    };

    checkTouchOnly();
    window.addEventListener("resize", checkTouchOnly);
    return () => window.removeEventListener("resize", checkTouchOnly);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => {
          if (isTouchOnlyDevice) setActiveCard(card);
        }}
        className={cn(
          "relative rounded-lg overflow-hidden w-full mx-auto mb-2 p-1 transition-all duration-500 ease-in",
          hovered !== null && hovered !== index && "scale-[0.98]"
        )}
      >
        {!loaded && (
          <div className="absolute inset-0 z-10">
            <SkeletonCard />
          </div>
        )}

        {inView && (
          <>
            <LazyLoadImage
              src={card.thumbnail}
              alt={card.url}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                setVisible(false);
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
                e.currentTarget.src = "";
              }}
              className={cn(
                "block w-full h-full object-cover transition-all duration-[1000ms] ease-in-out",
                loaded
                  ? hovered === index
                    ? "opacity-100 scale-105"
                    : "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              )}
            />

            {!isTouchOnlyDevice && hovered === index && (
              <>
                {/* Top overlay */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />

                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />

                {/* Top Left */}
                {/* Top Left */}
                <div className="absolute z-20 top-2 left-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="relative overflow-hidden transition cursor-pointer shadow hover:bg-gray-200 p-1 rounded-full bg-white/30 backdrop-blur-xs">
                        <Info className="w-6 h-6 text-black relative z-10" />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="max-w-[250px] whitespace-normal break-words"
                    >
                      {card.attribution}
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Top Right */}
                <div className="absolute z-20 top-2 right-2">
                  <button className="relative overflow-hidden transition cursor-pointer shadow hover:bg-gray-200 p-1 rounded-sm bg-white/30 backdrop-blur-xs">
                    {/* Icon stays fixed */}
                    <ShoppingCart className="w-6 h-6 text-black relative z-10" />

                    {/* Shimmer under icon */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </button>
                </div>

                {/* Bottom Right */}
                <div className="absolute z-20 bottom-2 right-2">
                  <button
                    onClick={() => setActiveCard(card)}
                    className="relative overflow-hidden transition cursor-pointer shadow hover:bg-gray-200 p-1 rounded-sm bg-white/30 backdrop-blur-xs"
                  >
                    {/* Icon stays fixed */}
                    <Maximize className="w-6 h-6 text-black relative z-10" />

                    {/* Shimmer under icon */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </button>
                </div>

                {/* Bottom Center */}
                <div className="absolute z-20 bottom-2 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={() =>  setEditActiveCard(card)}
                    className="relative overflow-hidden transition cursor-pointer shadow hover:bg-gray-200 p-1 rounded-sm bg-white/30 backdrop-blur-xs"
                  >
                    {/* Icon stays fixed */}
                    <SquarePen className="w-6 h-6 text-black relative z-10" />

                    {/* Shimmer under icon */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </button>
                </div>


                {/* Bottom Left */}
                <div className="absolute z-20 bottom-2 left-2">
                  <button
                    onClick={() => downloadImage(card.url, card.title)}
                    className="relative overflow-hidden transition cursor-pointer shadow hover:bg-gray-200 p-1 rounded-sm bg-white/30 backdrop-blur-xs"
                  >
                    {/* Icon stays fixed */}
                    <Download className="w-6 h-6 text-black relative z-10" />

                    {/* Shimmer under icon */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </button>
                </div>
              </>
            )}
          </>
        )}

        <div
          className={cn(
            "absolute inset-0 bg-black/10 flex items-end py-8 px-4 transition-opacity duration-300 pointer-events-none",
            hovered === index ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </AnimatePresence>
  );
};

export function FocusCards({ cards }: { cards: CardData[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [activeEditCard, setEditActiveCard] = useState<CardData | null>(null);

  const breakpointColumnsObj = constant.breakpointColumnsObj;

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="bg-clip-padding"
      >
        {cards.map((card, index) => (
          <CardDisplay
            key={`image-${index}`}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            setActiveCard={setActiveCard}
            setEditActiveCard={setEditActiveCard}
          />
        ))}
      </Masonry>

      {/* Global Expanded View Modal */}
      <ExpandableImage activeCard={activeCard} setActiveCard={setActiveCard} setActiveEditCard={setEditActiveCard}/>
      <EditorCanvas activeEditCard={activeEditCard} setActiveEditCard={setEditActiveCard} />
    </>
  );
}