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
}

function Carousel({ image }: CarouselProps) {
  const [enabled, setEnabled] = React.useState(true);

  useEffect(() => {
    if (!image) {
      return;
    }
  }, [image, enabled]);

  return (
    <div className="relative mx-auto w-[calc(100%-15vw)] px-10 mt-10">
      <div>
        <span className="relative left-0 font-sans font-bold text-base md:text-lg mb-10">
          Over 4.1 million+ royalty-free stock photos shared by our talented
          community.
        </span>
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

      <PhotoCards value={image} attributionRequired ={enabled}/>
    </div>
  );
}

export default Carousel;
