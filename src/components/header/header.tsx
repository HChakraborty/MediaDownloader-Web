import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonLabels, navItems, productName } from "@/constants/constants";
import Button from "@/ui/button";

const animation = {
  initial: { opacity: 0, y: -50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.2 },
  },
};

type HeaderProp = {
  setShowLogin: (e: boolean) => void;
  scrollHeaderVisible: boolean;
  setScrollHeaderVisible: (e: boolean) => void;
};

const Header = memo((props: HeaderProp) => {
  const disabled = true;

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {!props.scrollHeaderVisible && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animation}
            className="fixed top-0 left-0 right-0 z-[5000] bg-transparent border-none py-2 px-4 font-[Inter] text-white transition-colors duration-300"
          >
            <div className="w-full flex items-center justify-between">
              <div className="text-lg font-semibold truncate">
                {productName}
              </div>

              <div className="flex items-center gap-2 sm:gap-4 flex-wrap overflow-x-auto whitespace-nowrap flex-shrink min-w-0">
                <div className="hidden sm:flex gap-2 sm:gap-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.link}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                <Button
                  variant="default"
                  aria-label="Open login"
                  aria-haspopup="dialog"
                  onClick={() => props.setShowLogin(true)}
                  className="border-white rounded-full hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  {buttonLabels.Join.name}
                </Button>

                <Button
                  variant="success"
                  aria-label="Open Upload"
                  aria-haspopup="dialog"
                  className="rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  {buttonLabels.Upload.name}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Header;
