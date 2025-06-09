"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  duration = 0.5,
  delayBetween = 3000,
}: {
  words: string | string[];
  className?: string;
  duration?: number;
  delayBetween?: number;
}) => {
  const lines = Array.isArray(words) ? words : [words];
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLine((prev) => (prev + 1) % lines.length);
    }, delayBetween);
    return () => clearTimeout(timer);
  }, [currentLine, delayBetween, lines.length]);

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="text-white leading-snug tracking-wide h-[2.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={lines[currentLine]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              {lines[currentLine]
                .split(" ")
                .map((word, idx) => (
                  <motion.span
                    key={`${word}-${idx}`}
                    className="inline-block mr-1"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{
                      duration: duration,
                      delay: idx * 0.1,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
