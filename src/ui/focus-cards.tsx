import React, { useState, useEffect, Suspense } from "react";
import Masonry from "react-masonry-css";
import cn from "@/utils/tailwindMerge";
import { useInView } from "react-intersection-observer";
import SkeletonCard from "@/components/photo-cards/components/skeleton-card";
import {
  Maximize,
  Download,
  ShoppingCart,
  Info,
  SquarePen,
} from "lucide-react";
import downloadImage from "@/hooks/image-download";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { breakpointColumnsObj } from "@/constants/constants";

const ExpandableImage = React.lazy(() =>
  import("@/components/photo-cards/components/expandable-card")
);
const EditorCanvas = React.lazy(() =>
  import("@/components/image-editor/editor-canvas")
);

type CardData = {
  title: string;
  url: string;
  thumbnail: string;
  license: string;
  attribution: string;
  width: number;
  height: number;
};

const randomHeights = ["h-[300px]", "h-[400px]", "h-[500px]", "h-[600px]"];

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
    rootMargin: "1000px",
  });

  const fixedHeight = randomHeights[index % randomHeights.length];

  useEffect(() => {
    const checkTouchOnly = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hoverMedia = window.matchMedia("(hover: hover)").matches;
      const isLikelyMobile = window.innerWidth < 768;
      setIsTouchOnlyDevice((hasTouch && !hoverMedia) || isLikelyMobile);
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
          "relative rounded-lg overflow-hidden w-full max-w-full mx-auto mb-2 p-1 transition-all duration-500 ease-in",
          isTouchOnlyDevice && "disable-hover",
          hovered !== null && hovered !== index && "scale-[0.98]"
        )}
      >
        <div className={cn("relative w-full", fixedHeight)}>
          {/* Always render skeleton as background */}
          <SkeletonCard height={fixedHeight} />

          {/* Image motion overlay on top of skeleton */}
          {inView && (
            <motion.img
              src={card.thumbnail}
              alt={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                setVisible(false);
                e.currentTarget.onerror = null;
              }}
              className={cn(
                "absolute inset-0 w-full h-full object-cover rounded-xl"
              )}
              loading="lazy"
            />
          )}
        </div>

        {/* Overlays shown only when loaded and hovered */}
        {loaded && !isTouchOnlyDevice && hovered === index && (
          <>
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />

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

            <div className="absolute z-20 top-2 right-2">
              <button
                disabled
                className="relative overflow-hidden transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow hover:bg-gray-200 p-1 rounded-sm bg-white/30 backdrop-blur-xs"
              >
                <ShoppingCart className="w-6 h-6 text-black relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </button>
            </div>

            <div className="absolute z-20 bottom-2 right-2">
              <button
                onClick={() => setActiveCard(card)}
                className="relative overflow-hidden transition cursor-pointer shadow hover:bg-gray-200 p-1 rounded-sm bg-white/30 backdrop-blur-xs"
              >
                <Maximize className="w-6 h-6 text-black relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </button>
            </div>

            <div className="absolute z-20 bottom-2 left-1/2 transform -translate-x-1/2">
              <button
                disabled
                onClick={() => setEditActiveCard(card)}
                className="relative overflow-hidden transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow hover:bg-gray-200 p-1 rounded-sm bg-white/30 backdrop-blur-xs"
              >
                <SquarePen className="w-6 h-6 text-black relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </button>
            </div>

            <div className="absolute z-20 bottom-2 left-2">
              <button
                onClick={() => downloadImage(card.url, card.title)}
                className="relative overflow-hidden transition cursor-pointer shadow hover:bg-gray-200 p-1 rounded-sm bg-white/30 backdrop-blur-xs"
              >
                <Download className="w-6 h-6 text-black relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </AnimatePresence>
  );
};

function FocusCards({ cards }: { cards: CardData[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [activeEditCard, setEditActiveCard] = useState<CardData | null>(null);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid w-full max-w-full overflow-hidden"
        columnClassName="my-masonry-grid_column"
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

      <Suspense fallback={null}>
        <ExpandableImage
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          setActiveEditCard={setEditActiveCard}
        />
      </Suspense>

      <Suspense fallback={null}>
        <EditorCanvas
          activeEditCard={activeEditCard}
          setActiveEditCard={setEditActiveCard}
        />
      </Suspense>
    </div>
  );
}

export default FocusCards;
