import { Label } from "@radix-ui/react-label";
import { Switch } from "./switch";

import React from "react";
import { useEffect } from "react";
import PhotoCards from "@/components/photo-cards/photo-cards";

interface CarouselProps {
  image: string | undefined;
  extension: string | undefined;
  downloadComplete: boolean;
  setDownloadComplete: (e: boolean) => void;
}

function Carousel({
  image,
  extension,
  setDownloadComplete,
  downloadComplete,
}: CarouselProps) {
  const [enabled, setEnabled] = React.useState(true);

  useEffect(() => {
    if (!image) {
      return;
    }
  }, [image, enabled, extension]);

  return (
    <div className="relative mx-auto w-[calc(100%-15vw)] px-10 sm:mt-10 bg-zinc-100 dark:bg-zinc-900">
      <div>
        <div className="text-center mt-10 mb-6 px-4">
          <h2 className="md:text-4xl sm:text-lg text-sm font-semibold text-gray-900 tracking-tight">
            Royalty-Free{" "}
            <span className="text-gray-900 dark:text-white font-bold">
              {image ?? "Open Source"}
            </span>{" "}
            Images in{" "}
            <span className="text-gray-900 dark:text-white font-bold">
              {extension ? extension.toUpperCase() : "all"}
            </span>{" "}
            Format
            {extension === undefined ||
            extension === null ||
            extension === "all"
              ? "s"
              : ""}
          </h2>

          <p className="mt-4 text-sm md:text-lg text-gray-900 font-bold hidden sm:block">
            Discover beautiful royalty-free{" "}
            <span className="text-gray-900 dark:text-white font-extrabold">
              {image ?? "Open Source"}
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
            onClick={() => setDownloadComplete(false)}
            disabled={!downloadComplete}
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
        setDownloadComplete={setDownloadComplete}
      />
    </div>
  );
}

export default Carousel;
