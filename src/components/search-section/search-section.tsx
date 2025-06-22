"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import ImagesSlider from "@/ui/images-slider";
import PlaceholdersAndVanishInput from "@/ui/placeholders-and-vanish-input";
import ExtensionsButtonRow from "@/ui/buttons";
import { TextGenerateEffect } from "@/ui/text-generate-effect";
import { InfiniteMovingButtons } from "@/ui/infinite-moving-buttons";
import * as constants from "@/constants/constants";
import getRandomSortedItems from "@/utils/random-list-sort";
import { HiddenHeader } from "@/components/header/search-header";

type RouteSelectedProp = {
  onSubmit: (e: string) => void;
  onSubmitExtension: (e: string) => void;
  activeExtension: string | undefined;
};

const SearchSection = ({
  onSubmit,
  onSubmitExtension,
  activeExtension,
}: RouteSelectedProp) => {
  const { images, message, ButtonLabels, extensions } = constants;

  const miniButtons = getRandomSortedItems(ButtonLabels);
  const placeholders = getRandomSortedItems(ButtonLabels);

  const animation = {
    initial: { opacity: 0, y: -80 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5 },
  };

  return (
    <ImagesSlider
      className="relative transition-all duration-300 ease-in-out"
      images={images}
    >
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="relative z-50 w-full">
          <HiddenHeader />
        </div>
      </div>

      <motion.div
        initial={animation.initial}
        animate={animation.animate}
        transition={animation.transition}
        className="relative z-40 flex flex-col justify-center items-center min-h-[40rem] w-full px-4"
      >
        <h2 className="mb-6 text-3xl sm:text-5xl font-bold text-white text-center">
          <TextGenerateEffect
            words={message}
            duration={2}
            delayBetween={6000}
          />
        </h2>

        <ExtensionsButtonRow
          extensions={extensions}
          onSubmitExtension={onSubmitExtension}
          activeExtension={activeExtension}
        />

        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onSubmit={onSubmit}
        />

        <InfiniteMovingButtons
          buttonLabels={miniButtons}
          onSubmit={onSubmit}
        />
      </motion.div>
    </ImagesSlider>
  );
};

export default memo(SearchSection);
