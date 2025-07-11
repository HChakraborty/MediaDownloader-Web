import React, { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
const PlaceholdersAndVanishInput = React.lazy(
  () => import("@/ui/placeholders-and-vanish-input")
);
import { useSuggestions } from "@/hooks/words-fetch";

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: string) => void;
  downloadComplete: boolean;
  setDownloadComplete: (e: boolean) => void;
  setMobileSearchBarOpen: (e: boolean) => void;
};

const MobileSearchBar = ({
  show,
  onClose,
  onSubmit,
  downloadComplete,
  setDownloadComplete,
  setMobileSearchBarOpen,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileValue, setMobileValue] = useState<string | null>("");
  const suggestions = useSuggestions(mobileValue, 2, 600); // 600ms throttle, min 2 chars

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[6000] bg-white px-4 pt-16 pb-8 flex flex-col sm:hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setMobileValue(null);
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-600 bg-gray-200 p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <h2 className="text-lg font-semibold mb-4 text-center">
            Search Images...
          </h2>

          {/* Search Input */}
          <Suspense fallback={null}>
            <PlaceholdersAndVanishInput
              onSubmit={onSubmit}
              setDownloadComplete={setDownloadComplete}
              downloadComplete={downloadComplete}
              setMobileSearchBarOpen={setMobileSearchBarOpen}
              showMobileBar={false}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
              setMobileValue={setMobileValue}
            />
          </Suspense>

          <SearchBarSuggestions
            suggestions={suggestions}
            onSelect={(suggestion) => {
              onSubmit(suggestion);
              setMobileValue(null);
              setMobileSearchBarOpen(false);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchBar;

type SuggestionProps = {
  suggestions: string[];
  onSelect: (text: string) => void;
};

export const SearchBarSuggestions = ({ suggestions, onSelect }: SuggestionProps) => {
  if (!suggestions.length) return null;

  return (
    <div className="overflow-y-auto flex-1 mt-4 divide-y divide-zinc-200 dark:divide-zinc-700">
      {suggestions.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelect(item)}
          className="w-full text-left py-3 px-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

