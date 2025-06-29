import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import cn from "@/utils/tailwindMerge";
import Button from "./button";
import { buttonVariants } from "@/constants/constants";
import { useRef, useEffect } from "react";

const animateScroll = {
  animate: {
    x: ["-100%", "100%"],
    transition: { duration: 1.5, repeat: Infinity },
  },
};

const ScrollToTopButton = () => {
  const isScrolling = useRef(false);
  const animationFrame = useRef<number | null>(null);

  const stopScroll = () => {
    if (isScrolling.current) {
      isScrolling.current = false;
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    }
  };

  const scrollToTopSlowly = () => {
    if (isScrolling.current) return;

    isScrolling.current = true;

    const step = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;

      if (Math.floor(currentScroll) <= 4) {
        window.scrollTo({ top: 0, behavior: "auto" });
        stopScroll();
        return;
      }

      const nextScroll = currentScroll - currentScroll / 8;
      window.scrollTo(0, nextScroll);

      animationFrame.current = requestAnimationFrame(step);
    };

    animationFrame.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    // Stop scrolling on user interaction
    const handleUserScroll = () => stopScroll();

    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchstart", handleUserScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchstart", handleUserScroll);

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed bottom-10 right-4 sm:bottom-16 sm:right-6 z-[6500]">
      <Button
        onClick={scrollToTopSlowly}
        aria-label="Scroll to top"
        className={cn(buttonVariants({ variant: "arrow", rounded: "full" }))}
      >
        <ArrowUp className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white relative z-10 animate-pulse" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent z-0 pointer-events-none"
          animate="animate"
          variants={animateScroll}
        />
      </Button>
    </div>
  );
};

export default ScrollToTopButton;
