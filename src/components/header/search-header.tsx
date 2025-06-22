"use client";

import { useEffect, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/tailwindMerge";
import { CardDemo } from "@/pages/authentication/authentication";
import { X } from "lucide-react";
import { IconHome, IconUser, IconMessage } from "@tabler/icons-react";

export function HiddenHeader() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];
  return (
    <div className="relative w-full">
      <HiddenNav navItems={navItems} />
    </div>
  );
}

const HiddenNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(true); // start visible
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 50) {
        // Near top — always show
        setVisible(true);
      } else if (currentY < lastY) {
        // Scroll up — show
        setVisible(true);
      } else {
        // Scroll down — hide
        setVisible(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed top-0 left-0 right-0 z-[5000]",
              "bg-transparent border-none",
              "py-2 px-4 font-[Inter] text-white",
              className
            )}
          >
            <div className="w-full flex items-center justify-between">
              {/* Left logo */}
              <div className="text-lg font-semibold">OpenImage</div>

              {/* Right nav + buttons */}
              <div className="flex items-center gap-4">
                {navItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    className="text-sm hover:text-gray-300"
                  >
                    {item.name}
                  </a>
                ))}

                <button
                  onClick={() => setShowLogin(true)}
                  className="border border-white rounded-full text-sm px-3 py-1 hover:bg-white/10"
                >
                  Join
                </button>

                <button className="bg-green-500 rounded-full text-sm px-4 py-1 hover:bg-green-600">
                  Upload
                </button>
              </div>
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

export default HiddenNav;
