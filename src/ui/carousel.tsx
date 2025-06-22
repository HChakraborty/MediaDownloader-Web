"use client";

import { Label } from "./label";
import { Switch } from "./switch";

import React from "react";
import { useEffect } from "react";
const PhotoCards = React.lazy(
  () => import("../components/display-cards/photo-cards")
);

interface CarouselProps {
  image: string | undefined;
  extension: string | undefined;
}

function Carousel({ image, extension }: CarouselProps) {
  const [enabled, setEnabled] = React.useState(true);

  useEffect(() => {
    if (!image) {
      return;
    }
  }, [image, enabled, extension]);

  return (
    <div className="relative mx-auto w-[calc(100%-15vw)] px-10 mt-10">
      <div>
        <div className="text-center mt-10 mb-6 px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
            Royalty-Free{" "}
            <span className="text-gray-900 dark:text-white font-bold">
              {image ?? 'Open Source'}
            </span>{" "}
            Images in{" "}
            <span className="text-gray-900 dark:text-white font-bold">
              {extension ? extension.toUpperCase() : "all"}
            </span>{" "}
            Format{(extension === undefined || extension === null || extension === 'all')? "s" : ""}
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-900 font-bold">
            Discover beautiful royalty-free{" "}
            <span className="text-gray-900 dark:text-white font-extrabold">
              {image ?? 'Open Source'}
            </span>{" "}
            images in{" "}
            <span className="text-gray-900 dark:text-white font-extrabold">
              {extension ? extension.toUpperCase() : "all"}
            </span>{" "}
            format — created and shared by our global community.
          </p>
        </div>

        <span className="relative flex justify-end space-x-2">
          <Switch
            id="show-attribution"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <Label
            htmlFor="show-attribution"
            className="text-sm font-medium font-sans md:text-base"
          >
            Include all creative works (credit required)
          </Label>
        </span>
      </div>

      <PhotoCards
        value={image}
        attributionRequired={enabled}
        extension={extension}
      />
    </div>
  );
}

export default Carousel;
