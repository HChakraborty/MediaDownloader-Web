import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AuthenticationCard from "./authentication-card";
import { FocusTrap } from "focus-trap-react";
import { useEffect } from "react";

type AuthenticationProp = {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const animateOverlay = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const animateLogin = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const Authentication = (props: AuthenticationProp) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.setShowLogin(false);
    };

    if (props.showLogin) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [props.showLogin]);

  return (
    <AnimatePresence>
      {props.showLogin && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[5100]"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animateOverlay}
            key="auth-modal"
          />
          <motion.div
            className="fixed inset-0 z-[5101] flex items-center justify-center px-4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animateLogin}
            role="dialog"
            aria-modal="true"
            aria-label="authentication"
          >
            <FocusTrap>
              <div className="relative max-w-sm w-full border-none bg-transparent p-4 sm:p-6">
                <button
                  className="absolute top-2 right-2 sm:-top-4 sm:-right-4 z-10 text-neutral-500 hover:text-neutral-700 bg-white dark:bg-black rounded-full p-1 shadow"
                  onClick={() => props.setShowLogin(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <AuthenticationCard />
              </div>
            </FocusTrap>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Authentication;
