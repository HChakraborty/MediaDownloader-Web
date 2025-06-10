"use client";
import { motion } from "motion/react";
import React from "react";
import ImagesSlider from "../../ui/images-slider";
import PlaceholdersAndVanishInput from "@/ui/placeholders-and-vanish-input";
import ButtonRow from "@/ui/buttons";
import { TextGenerateEffect } from "@/ui/text-generate-effect";
import { InfiniteMovingButtons } from "@/ui/infinite-moving-buttons";
import { minButtonLables } from "../../constants/constants";
import * as constants from "../../constants/constants";
import { placeholders } from "../../constants/constants";

type RouteSelectedProp = {
  onSubmit: (e: string | undefined) => void;
};

const SearchSection = ({ onSubmit }: RouteSelectedProp) => {
  const images = constants.images;

  const button: ButtonRowProps = constants.button;

  type ButtonRowProps = {
    buttonLabels: string[];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const message: string[] = constants.message;

  return (
    <ImagesSlider
      className="h-[40rem] transition-all duration-300 ease-in-out"
      images={images}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.5,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.div>
          <div className="h-[40rem] min-w-full flex flex-col justify-center items-center px-4">
            <h2 className="mb-6 text-3xl sm:text-5xl font-bold text-white text-center">
              <TextGenerateEffect
                words={message}
                duration={2}
                delayBetween={6000}
              />
            </h2>

            <ButtonRow buttonLabels={button.buttonLabels} onSubmit={onSubmit} />

            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />

            <InfiniteMovingButtons
              buttonLabels={minButtonLables}
              onSubmit={onSubmit}
            />
          </div>
        </motion.div>
      </motion.div>
    </ImagesSlider>
  );
};

export default SearchSection;
