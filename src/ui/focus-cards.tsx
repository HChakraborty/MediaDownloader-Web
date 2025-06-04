"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const CardDisplay = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: { src: string; title: string };
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full h-fit transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-xs scale-[0.98]"
      )}
    >
      <img
        src={card.src}
        alt={card.title}
        className="block w-full h-auto object-cover"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
      </div>
    </div>
  )
);


CardDisplay.displayName = "Card";

// FocusCards.tsx
type CardData = {
  title: string;
  src: string;
};

export function FocusCards({ cards }: { cards: CardData[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
<div className="overflow-x-hidden">
  <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-10 w-full">
    {cards.map((card, index) => (
      <div key={card.title} className="min-w-0">
        <CardDisplay
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      </div>
    ))}
  </div>
</div>

  );
}
