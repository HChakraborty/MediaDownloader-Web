import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ExpandableChildrenProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
  className?: string;
  overlayClassName?: string;
};

function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

function useConditionalOutsideClick(
  ref: React.RefObject<HTMLElement>,
  onClose: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    let handler: (e: MouseEvent) => void;

    const timeout = setTimeout(() => {
      if (!ref.current) return;

      handler = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handler);
    }, 0); // wait 1 tick for ref.current

    return () => {
      clearTimeout(timeout);
      if (handler) {
        document.removeEventListener("mousedown", handler);
      }
    };
  }, [ref, onClose, enabled]);
}

const ExpandableChildren = ({
  isOpen,
  onClose,
  children,
  zIndex = 6000,
  className = "",
  overlayClassName = "bg-black/70",
}: ExpandableChildrenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();

  useConditionalOutsideClick(
    ref as React.RefObject<HTMLElement>,
    onClose,
    isOpen && !isTouch
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0" style={{ zIndex }}>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 ${overlayClassName}`}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            ref={ref}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div
              className={`relative max-h-[90vh] overflow-y-auto ${className}`}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExpandableChildren;
