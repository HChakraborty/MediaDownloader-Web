"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/ui/useOutsideClick";
import { Download, Info, ShoppingCart, SquarePen, X } from "lucide-react";
import { AspectRatio } from "@/ui/aspect-ratio";
import downloadImage from "@/hooks/image-download";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { SkeletonCard } from "@/components/display-cards/skeleton-card";

type CardData = {
  title: string;
  url: string;
  license: string;
  thumbnail: string;
  attribution: string;
  extension?: string;
  width: number;
};

export function ExpandableImage({
  activeCard,
  setActiveCard,
  setActiveEditCard,
}: {
  activeCard: CardData | null;
  setActiveCard: React.Dispatch<React.SetStateAction<CardData | null>>;
  setActiveEditCard: React.Dispatch<React.SetStateAction<CardData | null>>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();
  const [showTooltip, setShowTooltip] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveCard(null);
      }
    }

    if (activeCard) {
      document.body.style.overflow = "hidden";
      setLoaded(false); // Reset loaded when a new image opens
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCard, setActiveCard]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setActiveCard(null)
  );

  return (
    <>
      {activeCard && (
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
          <AnimatePresence>
            {activeCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeInOut" }}
                className="fixed inset-0 bg-black/80 z-10"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeCard && (
              <div className="fixed inset-0 grid place-items-center z-50">
                <motion.div
                  ref={ref}
                  className="relative w-screen h-screen sm:w-auto sm:h-auto sm:max-w-[90vw] sm:max-h-[90vh] rounded-2xl overflow-hidden shadow-lg bg-black"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: "easeInOut" }}
                    className="absolute top-2 right-2 z-20"
                  >
                    <button
                      onClick={() => setActiveCard(null)}
                      className="bg-white rounded-full p-2 shadow hover:bg-gray-200"
                    >
                      <X className="w-5 h-5 text-black cursor-pointer" />
                    </button>
                  </motion.div>

                  {/* Top-left Info button with gloss */}
                  <div className="absolute z-20 top-2 left-2">
                    {isTouch ? (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTooltip((prev) => !prev);
                          }}
                          className="relative overflow-hidden transition cursor-pointer bg-white/30 backdrop-blur-xs shadow hover:bg-gray-200 p-2 rounded-full"
                        >
                          <Info className="w-6 h-6 text-black relative z-10" />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </button>

                        {showTooltip && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-10 left-0 z-50 bg-white text-black p-3 rounded-lg shadow-lg max-w-[250px] text-sm"
                          >
                            {activeCard.attribution}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="relative overflow-hidden transition cursor-pointer bg-white/30 backdrop-blur-xs shadow hover:bg-gray-200 p-2 rounded-full">
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
                          {activeCard.attribution}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {/* Bottom-left ShoppingCart button with gloss */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <button className="relative overflow-hidden bg-white/30 backdrop-blur-xs rounded-sm p-2 shadow hover:bg-gray-200">
                      <ShoppingCart className="w-6 h-6 text-black relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </button>
                  </div>

                  {/* Bottom-center custom icon/button */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
                    <button
                      onClick={() => {
                        setActiveEditCard(activeCard);
                        setActiveCard(null);
                      }}
                      className="relative overflow-hidden bg-white/30 backdrop-blur-xs rounded-sm p-2 shadow hover:bg-gray-200"
                    >
                      <SquarePen className="w-6 h-6 text-black relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </button>
                  </div>

                  {/* Bottom-right Download button with gloss */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <button
                      onClick={() =>
                        downloadImage(activeCard.url, activeCard.title)
                      }
                      className="relative overflow-hidden bg-white/30 backdrop-blur-xs rounded-sm p-2 shadow hover:bg-gray-200"
                    >
                      <Download className="w-6 h-6 text-black relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </button>
                  </div>

                  <div className="relative w-full h-full flex items-center justify-center">
                    {!loaded && (
                      <div className="absolute inset-0 z-0 flex items-center justify-center">
                        <SkeletonCard />
                      </div>
                    )}

                    <motion.img
                      src={activeCard.url}
                      alt={activeCard.thumbnail}
                      className="mx-auto bg-white rounded-lg"
                      style={{
                        maxHeight: "80vh",
                        maxWidth: "90vw",
                        width: "min(80vh, 90vw)",
                        height: "min(80vh, 90vw)",
                        objectFit: "contain",
                        imageRendering: "auto",
                      }}
                      initial={{ scale: 1 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.98 }}
                      onLoad={() => setLoaded(true)}
                      onError={() => setLoaded(true)}
                    />
                  </div>

                  {/* Top gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </AspectRatio>
      )}
    </>
  );
}

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkIfTouch = () =>
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);

    checkIfTouch();
  }, []);

  return isTouch;
}
