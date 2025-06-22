"use client";

import { useEffect, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/tailwindMerge";
import PlaceholdersAndVanishInput from "./placeholders-and-vanish-input";
import * as constants from "../constants/constants";
import getRandomItems from "@/utils/random-list-generator";
import { CardDemo } from "@/pages/authentication/authentication";
import { X } from "lucide-react";

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
  onSubmit?: (e: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const placeholders = getRandomItems(constants.ButtonLabels, 20);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed top-0 left-0 right-0 w-full z-[5000] bg-white dark:bg-black shadow border-b border-white/20 py-2 px-6",
              className
            )}
          >
            <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-6">
              {navItems.map((navItem, idx) => (
                <a
                  key={`link-${idx}`}
                  href={navItem.link}
                  className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-50 hover:text-neutral-500"
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

              <button
                className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-neutral-800"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[5100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 z-[5101] flex items-center justify-center px-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative bg-transparent max-w-sm w-full">
                <button
                  className="absolute -top-4 -right-4 z-10 text-neutral-500 hover:text-neutral-700 bg-white dark:bg-black rounded-full p-1 shadow"
                  onClick={() => setShowLogin(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <CardDemo />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
