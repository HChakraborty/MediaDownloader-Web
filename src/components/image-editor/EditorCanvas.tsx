import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useOutsideClick } from "@/utils/useOutsideClick";

type CardData = {
  title: string;
  url: string;
  license: string;
  thumbnail: string;
  attribution: string;
  extension?: string;
  width: number;
  height: number;
};

const EditorCanvas = ({
  activeEditCard,
  setActiveEditCard,
}: {
  activeEditCard: CardData | null;
  setActiveEditCard: React.Dispatch<React.SetStateAction<CardData | null>>;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorVisible, setEditorVisible] = useState(false);

  useOutsideClick(wrapperRef, () => {
    if (activeEditCard) setActiveEditCard(null);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveEditCard(null);
    };

    if (activeEditCard) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "auto";
      setEditorVisible(false);
    }

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [activeEditCard, setActiveEditCard]);

  if (!activeEditCard) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-40"
      />

      <motion.div
        key="editor"
        ref={wrapperRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onAnimationComplete={() => setEditorVisible(true)}
        className="fixed inset-0 z-6000 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden flex">
          <button
            onClick={() => setActiveEditCard(null)}
            className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {editorVisible }
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditorCanvas;