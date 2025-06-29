import { AnimatePresence, motion } from "framer-motion";
import cn from "@/utils/tailwindMerge";
import PlaceholdersAndVanishInput from "@/ui/placeholders-and-vanish-input";
import { navItems } from "@/constants/constants";
import productLogo from "@/assets/icons/open-image-logo.png";

type ScrollHeaderProp = {
  onSubmit: (e: string | undefined) => void;
  setShowLogin: (e: boolean) => void;
  scrollHeaderVisible: boolean;
  setScrollHeaderVisible: (e: boolean) => void;
};

const ScrollHeader = (props: ScrollHeaderProp) => {
  return (
    <div className="relative  w-full">
      <AnimatePresence mode="wait">
        {props.scrollHeaderVisible && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed top-0 left-0 right-0 w-full z-[5000] bg-white dark:bg-black shadow border-b border-white/20 py-2 px-6"
            )}
          >
            <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-6">
              <div className="block sm:hidden">
                <img
                  src={productLogo}
                  alt="OpenImage Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>

              {navItems.map((navItem, idx) => (
                <a
                  key={`link-${idx}`}
                  href={navItem.link}
                  className="hidden sm:flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-50 hover:text-neutral-500"
                >
                  <span>{navItem.icon}</span>
                  <span>{navItem.name}</span>
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
    </div>
  );
};

export default ScrollHeader;
