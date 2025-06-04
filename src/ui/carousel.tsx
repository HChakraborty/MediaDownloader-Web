"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface SlideData {
  content: React.ReactElement
}

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  return (
  <div className="relative mx-auto w-[calc(100%-15rem)] px-10 h-[70vmin]">

    <AnimatePresence mode="wait">
      {slides.map((slide, idx) =>
        idx === current ? (
          <motion.li
            key={idx}
            className="list-none absolute inset-0"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={() => handleSlideClick(idx)}
          >
            {slide.content}
          </motion.li>
        ) : null
      )}
    </AnimatePresence>

      {/* Your Prev/Next buttons */}
       <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
         <CarouselControl
           type="previous"
           title="Go to previous slide"
           handleClick={handlePreviousClick}
         />

         <CarouselControl
           type="next"
           title="Go to next slide"
           handleClick={handleNextClick}
         />
       </div>

    </div>
  );
}
