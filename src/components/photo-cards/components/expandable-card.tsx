import { useEffect, useState } from "react";
import { Download, Info, ShoppingCart, SquarePen, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import SkeletonCard from "@/components/photo-cards/components/skeleton-card";
import downloadImage from "@/hooks/image-download";
import ExpandableChildren from "@/ui/expandable-children";
import { ZoomIn, ZoomOut } from "lucide-react";
import cn from "@/utils/tailwindMerge";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";

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

function ExpandableImage({
  activeCard,
  setActiveCard,
  setActiveEditCard,
}: {
  activeCard: CardData | null;
  setActiveCard: React.Dispatch<React.SetStateAction<CardData | null>>;
  setActiveEditCard: React.Dispatch<React.SetStateAction<CardData | null>>;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const disabled = true;
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (activeCard) setLoaded(false);
  }, [activeCard]);

  const {isTouch, isMobile} = useDeviceInfo();

  return (
    <ExpandableChildren
      isOpen={!!activeCard}
      onClose={() => setActiveCard(null)}
      zIndex={6600}
      className={cn(
        "w-screen h-screen sm:w-auto sm:h-auto sm:max-w-[90vw] sm:max-h-[90vh] rounded-2xl overflow-hidden",
        "bg-transparent border-none shadow-none"
      )}
    >
      {activeCard && (
        <div className="relative w-full h-full">
          {/* Close Button */}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            {!loaded && (
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <SkeletonCard />
              </div>
            )}

            <div className="relative inline-block mx-auto">
              <img
                src={activeCard.thumbnail}
                alt={activeCard.url}
                className="bg-white rounded-lg block"
                style={{
                  maxHeight: "80vh",
                  maxWidth: "90vw",
                  width: "min(80vh, 90vw)",
                  height: "min(80vh, 90vw)",
                  objectFit: isZoomed ? "cover" : "contain",
                }}
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
              />

              {/* Close Button */}
              <div className="absolute top-2 right-2 z-20">
                <button
                  onClick={() => {
                    setActiveCard(null);
                    setIsZoomed(false);
                  }}
                  className="bg-white rounded-full p-2 shadow hover:bg-gray-200 cursor-pointer"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* Info Button */}
              <div className="absolute top-2 left-2 z-20">
                {isTouch ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip((prev) => !prev);
                      }}
                      className="relative overflow-hidden bg-white/30 backdrop-blur-xs shadow hover:bg-gray-200 p-2 rounded-full"
                    >
                      <Info className="w-6 h-6 text-black relative z-10" />
                    </button>
                    {showTooltip && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-white text-black p-3 rounded-lg shadow-lg text-sm w-[90vw] max-w-xs break-words"
                        style={{
                          maxHeight: "60vh",
                          overflowY: "auto",
                          wordWrap: "break-word",
                        }}
                      >
                        {activeCard.attribution}
                      </div>
                    )}
                  </div>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="relative overflow-hidden bg-white/30 backdrop-blur-xs shadow hover:bg-gray-200 p-2 rounded-full cursor-pointer">
                        <Info className="w-6 h-6 text-black relative z-10" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[7000] max-w-[250px] whitespace-normal break-words">
                      {activeCard.attribution}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                <button
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className="bg-white/30 backdrop-blur-xs shadow p-2 rounded-full hover:bg-gray-200"
                >
                  {isZoomed ? (
                    <ZoomOut className="w-6 h-6 text-black" />
                  ) : (
                    <ZoomIn className="w-6 h-6 text-black" />
                  )}
                </button>
              </div>

              {/* Bottom buttons */}
              <div className="absolute bottom-3 left-3 z-20">
                <button
                  disabled={disabled}
                  className="relative bg-white/30 backdrop-blur-xs rounded-sm p-2 shadow hover:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-6 h-6 text-black" />
                </button>
              </div>

              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
                <button
                  onClick={() => {
                    setActiveEditCard(activeCard);
                    setActiveCard(null);
                  }}
                  disabled={!disabled}
                  className="relative bg-white/30 backdrop-blur-xs rounded-sm p-2 shadow hover:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SquarePen className="w-6 h-6 text-black" />
                </button>
              </div>

              <div className="absolute bottom-3 right-3 z-20">
                <button
                  onClick={() =>
                    downloadImage(activeCard.url, activeCard.title)
                  }
                  className="relative bg-white/30 backdrop-blur-xs rounded-sm p-2 shadow hover:bg-gray-200 cursor-pointer"
                >
                  <Download className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Gradient Overlays */}
          {!isMobile && (
            <>
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
            </>
          )}
        </div>
      )}
    </ExpandableChildren>
  );
}

export default ExpandableImage;
