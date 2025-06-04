"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";


interface SlideData {
  content: React.ReactElement,
}


interface CarouselProps {
  slides: SlideData[];
  selectedRoute: string | null
}

export function Carousel({ slides, selectedRoute }: CarouselProps) {

const [routeSelected, setRouteSelected] = useState<string | null>(() => {
  return selectedRoute ?? window.location.pathname;
});

const windowMount = useRef(false);

  useEffect(() => {
    if (windowMount.current) {
      setRouteSelected(selectedRoute ?? window.location.pathname);
    } else {
      windowMount.current = true;
    }
  }, [selectedRoute]);

  return (
  <div className="relative mx-auto w-[calc(100%-15rem)] px-10 h-[70vmin]">

    <AnimatePresence mode="wait">
      {slides.map((slide) =>
        routeSelected === slide.content.key ? (
          <motion.li
            key={slide.content.key}
            className="list-none absolute inset-0"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {slide.content}
          </motion.li>
        ) : null
      )}
    </AnimatePresence>

    </div>
  );
}
