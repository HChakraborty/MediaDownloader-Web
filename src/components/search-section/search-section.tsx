import { motion } from "framer-motion";
import { memo } from "react";
import ImagesSlider from "@/components/search-section/components/images-slider";
import PlaceholdersAndVanishInput from "@/ui/placeholders-and-vanish-input";
import ExtensionsButtonRow from "@/components/search-section/components/extensions-button-row";
import { TextGenerateEffect } from "@/ui/text-generate-effect";
import { InfiniteMovingButtons } from "@/components/search-section/components/infinite-moving-buttons";
import getRandomSortedItems from "@/utils/random-list-sort";
import Header from "@/components/header/header";
import {
  categoriesButtonLabel,
  extensions,
  messages,
  searchSectionimages,
} from "@/constants/constants";

type SearchSectionProp = {
  onSubmit: (e: string) => void;
  onSubmitExtension: (e: string) => void;
  activeExtension: string | undefined;
  setShowLogin: (e: boolean) => void;
  scrollHeaderVisible: boolean;
  setScrollHeaderVisible: (e: boolean) => void;
};

const animation = {
  initial: { opacity: 0, y: -80 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.5 } 
  },
};

const miniButtons = getRandomSortedItems(categoriesButtonLabel);

const SearchSection = (props: SearchSectionProp) => {
  return (
    <ImagesSlider
      className="relative transition-all duration-300 ease-in-out"
      images={searchSectionimages}
    >
      <div className="absolute top-0 left-0 right-0 z-50 w-full">
        <Header setShowLogin={props.setShowLogin} scrollHeaderVisible={props.scrollHeaderVisible} setScrollHeaderVisible={props.setScrollHeaderVisible}/>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={animation}
        className="relative z-40 flex flex-col justify-center items-center min-h-[60vh] sm:min-h-[40rem] w-full px-4"
      >
        <h2 className="mb-6 text-3xl sm:text-5xl font-bold text-white text-center">
          <TextGenerateEffect
            words={messages}
            duration={2}
            delayBetween={6000}
          />
        </h2>
        <div className="mt-5 mb-5 flex justify-center flex-wrap gap-2">
          <ExtensionsButtonRow
            extensions={extensions}
            onSubmitExtension={props.onSubmitExtension}
            activeExtension={props.activeExtension}
          />
        </div>

        <PlaceholdersAndVanishInput onSubmit={props.onSubmit} />

        <InfiniteMovingButtons
          buttonLabels={miniButtons}
          onSubmit={props.onSubmit}
        />
      </motion.div>
    </ImagesSlider>
  );
};

export default memo(SearchSection);
