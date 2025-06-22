"use client";

import { cn } from "@/utils/tailwindMerge";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Load images progressively
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        setLoadedImages((prev) => {
          if (!prev.includes(image)) {
            return [...prev, image];
          }
          return prev;
        });
      };
    });
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") handleNext();
      else if (event.key === "ArrowLeft") handlePrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    let interval: NodeJS.Timeout | undefined;

    if (autoplay) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (interval) clearInterval(interval);
    };
  }, [autoplay]);

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

  return (
    <div
      className={cn(
        "overflow-hidden w-full relative flex items-center justify-center",
        className
      )}
      style={{
        perspective: "1000px",
        minHeight: "40rem", // Reserve space to prevent bounce
      }}
    >
      {loadedImages.length > 0 && (
        <div className="absolute inset-0 h-full w-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={loadedImages[currentIndex % loadedImages.length]}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              className="h-full w-full object-cover object-center"
            />
          </AnimatePresence>

          {overlay && (
            <div
              className={cn(
                "absolute inset-0 bg-black/60",
                overlayClassName
              )}
            />
          )}
        </div>
      )}

      <div className="relative z-50 w-full">{children}</div>
    </div>
  );
};

export default ImagesSlider;
