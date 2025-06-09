"use client";

import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "@/components/display-cards/skeleton-card";
import { useInView } from "react-intersection-observer";
import Masonry from "react-masonry-css";

type CardData = {
  title: string;
  url: string;
};

export const CardDisplay = ({
  card,
  index,
  hovered,
  setHovered,
}: {
  card: { title: string; url: string };
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const [visible, setVisible] = useState(true);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setMinDelayPassed(true), 800); // min skeleton duration
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative rounded-lg overflow-hidden w-full mx-auto mb-2 p-1 transition-all duration-500 ease-in",
        hovered !== null && hovered !== index && "blur-xs scale-[0.98]"
      )}
    >
      {/* Show skeleton if not loaded OR not delayed enough */}
      {(!loaded || !minDelayPassed) && (
        <div className="absolute inset-0 z-10">
          <SkeletonCard />
        </div>
      )}

      {inView && (
        <LazyLoadImage
          src={card.url}
          alt={card.title}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            setVisible(false);
            e.currentTarget.onerror = null; // prevent infinite loop
            e.currentTarget.style.display = "none";
            e.currentTarget.src = "";
          }}
          className={cn(
            "block w-full h-full object-cover transition-all duration-[1000ms] ease-in-out",
            loaded && minDelayPassed
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          )}
        />
      )}

      <div
        className={cn(
          "absolute inset-0 bg-black/10 flex items-end py-8 px-4 transition-opacity duration-300 pointer-events-none",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export function FocusCards({ cards }: { cards: CardData[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="bg-clip-padding"
      >
        {cards.map((card, index) => (
          <CardDisplay
            key={`image-${index}`}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </Masonry>
    </>
  );
}
