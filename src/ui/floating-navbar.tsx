"use client";
import { useEffect, useState, type JSX } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import useScrollDirection from "@smakss/react-scroll-direction";
import PlaceholdersAndVanishInput from "./placeholders-and-vanish-input";
import { placeholders } from "../constantsFolder/constants";

const FloatingNav = ({
  navItems,
  className,
  onSubmit,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
  onSubmit?: (e: string | undefined) => void;
}) => {
  const [visible, setVisible] = useState(false);

  const { scrollDir } = useScrollDirection();

  useEffect(() => {
    if (scrollDir === "down") {
      setVisible(true);
    } else if (scrollDir === "up") {
      setVisible(false);
    }
  }, [scrollDir]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-0 left-0 right-0 w-full z-[5000] bg-white dark:bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] border border-transparent dark:border-white/[0.2] py-2 px-6",
            className
          )}
        >
          <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-6">
            {navItems.map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-300 hover:text-neutral-500"
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </a>
            ))}

            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;
