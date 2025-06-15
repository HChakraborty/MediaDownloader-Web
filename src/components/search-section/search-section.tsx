"use client";
import { motion } from "motion/react";
import { memo } from "react";
import ImagesSlider from "../../ui/images-slider";
import PlaceholdersAndVanishInput from "@/ui/placeholders-and-vanish-input";
import ButtonRow from "@/ui/buttons";
import { TextGenerateEffect } from "@/ui/text-generate-effect";
import { InfiniteMovingButtons } from "@/ui/infinite-moving-buttons";

import * as constants from "../../constants/constants";

import getRandomItems from "@/lib/random-list-generator";
import getRandomSortedItems from "@/lib/random-list-sort";

type RouteSelectedProp = {
  onSubmit: (e: string | undefined) => void;
};

const SearchSection = ({ onSubmit }: RouteSelectedProp) => {
  const { images, message, ButtonLabels } = constants;

  const buttonLabels = getRandomItems(ButtonLabels);

  const miniButtons = getRandomSortedItems(ButtonLabels);
  const placeholders = getRandomSortedItems(ButtonLabels);

  const animatation = {
    initial: {
      opacity: 0,
      y: -80,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: 1.5,
    },
  };

  return (
    <ImagesSlider
      className="min-h-[40rem] transition-all duration-300 ease-in-out"
      images={images}
    >
      <motion.div
        initial={animatation.initial}
        animate={animatation.animate}
        transition={animatation.transition}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.div>
          <div className="min-h-[40rem] min-w-full flex flex-col justify-center items-center px-4">
            <h2 className="mb-6 text-3xl sm:text-5xl font-bold text-white text-center">
              <TextGenerateEffect
                words={message}
                duration={2}
                delayBetween={6000}
              />
            </h2>

            <ButtonRow buttonLabels={buttonLabels} onSubmit={onSubmit} />

            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onSubmit={onSubmit}
            />

            <InfiniteMovingButtons
              buttonLabels={miniButtons}
              onSubmit={onSubmit}
            />
          </div>
        </motion.div>
      </motion.div>
    </ImagesSlider>
  );
};

export default memo(SearchSection);
