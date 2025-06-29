import { useEffect, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cn from "@/utils/tailwindMerge";
import PlaceholdersAndVanishInput from "./placeholders-and-vanish-input";

type AuthenticationProp = {
  onSubmit: (e: string | undefined) => void;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const FloatingNav = ({
  navItems,
  className,
  props,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
  props: AuthenticationProp;
}) => {
  const [visible, setVisible] = useState(false);

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

              <PlaceholdersAndVanishInput onSubmit={props.onSubmit} />

              <button
                className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-neutral-800"
                onClick={() => props.setShowLogin(true)}
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
