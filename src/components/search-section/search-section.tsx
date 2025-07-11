import { motion } from "framer-motion";
import { memo } from "react";
import ImagesSlider from "@/components/search-section/components/images-slider";
const PlaceholdersAndVanishInput = React.lazy(() => import("@/ui/placeholders-and-vanish-input"));
import ExtensionsButtonRow from "@/components/search-section/components/extensions-button-row";
import { TextGenerateEffect } from "@/ui/text-generate-effect";
import { InfiniteMovingButtons } from "@/components/search-section/components/infinite-moving-buttons";
import getRandomSortedItems from "@/utils/random-list-sort";

import {
  categoriesButtonLabel,
  extensions,
  messages,
  searchSectionimages,
} from "@/constants/constants";
import React from "react";

type SearchSectionProp = {
  onSubmit: (e: string) => void;
  onSubmitExtension: (e: string) => void;
  activeExtension: string | undefined;
  setShowLogin: (e: boolean) => void;
  downloadComplete: boolean;
  setDownloadComplete: (e: boolean) => void;
  setMobileSearchBarOpen: (e: boolean) => void;
};

const animation = {
  initial: { opacity: 0, y: -80 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5 },
  },
};

const miniButtons = getRandomSortedItems(categoriesButtonLabel);

const SearchSection = (props: SearchSectionProp) => {
  
  return (
    <ImagesSlider
      className="relative transition-all duration-300 ease-in-out"
      images={searchSectionimages}
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={animation}
        className="relative z-40 flex flex-col justify-center items-center min-h-[50vh] sm:min-h-[30rem] w-full px-4 pt-8 sm:pt-0"
      >
        <h2 className="mb-4 text-lg xs:text-xl sm:text-2xl md:text-4xl font-bold text-white text-center">
          <TextGenerateEffect
            words={messages}
            duration={2}
            delayBetween={6000}
          />
        </h2>

        <div className="mt-3 mb-4 flex justify-center flex-wrap gap-2">
          <ExtensionsButtonRow
            extensions={extensions}
            onSubmitExtension={props.onSubmitExtension}
            activeExtension={props.activeExtension}
            setDownloadComplete={props.setDownloadComplete}
            downloadComplete={props.downloadComplete}
          />
        </div>
        <div className="w-full max-w-[55rem] mx-auto">
          <PlaceholdersAndVanishInput
            onSubmit={props.onSubmit}
            setDownloadComplete={props.setDownloadComplete}
            downloadComplete={props.downloadComplete}
            setMobileSearchBarOpen={props.setMobileSearchBarOpen}
            showMobileBar={true}
          />
        </div>

        <InfiniteMovingButtons
          buttonLabels={miniButtons}
          onSubmit={props.onSubmit}
          setDownloadComplete={props.setDownloadComplete}
          downloadComplete={props.downloadComplete}
        />
      </motion.div>
    </ImagesSlider>
  );
};

export default memo(SearchSection);
