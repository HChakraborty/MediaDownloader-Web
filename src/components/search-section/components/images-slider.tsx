import cn from "@/utils/tailwindMerge";
import { motion, AnimatePresence } from "framer-motion"; // Changed to correct import
import { memo, useEffect, useState, useCallback, type ReactNode } from "react";

type ImagesSliderProps = {
  images: string[];
  children: ReactNode;
  overlay?: ReactNode;
  className?: string;
  autoplay?: boolean;
};

const slideVariants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1 },
  },
};

const ImagesSlider = ({
  images,
  children,
  overlay = true,
  className = "",
  autoplay = true,
}: ImagesSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Load images progressively
  useEffect(() => {
    const toLoad = images.filter((img) => !loadedImages.includes(img));
    if (toLoad.length === 0) return;

    toLoad.forEach((image) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        setLoadedImages((prev) => [...prev, image]);
      };
    });
  }, [images, loadedImages]);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext]);

  const currentImage = loadedImages[currentIndex % loadedImages.length];

  return (
    <div
      className={cn(
        "overflow-hidden w-full relative flex items-center justify-center perspective-[1000px] min-h-[40rem]",
        className
      )}
    >
      {currentImage && (
        <div className="absolute inset-0 h-full w-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              loading="lazy"
              initial="initial"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              className="h-full w-full object-cover object-center"
            />
          </AnimatePresence>

          {overlay && (
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          )}
        </div>
      )}

      <div className="relative z-50 w-full">{children}</div>
    </div>
  );
};

export default memo(ImagesSlider);
