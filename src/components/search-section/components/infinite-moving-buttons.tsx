import cn from "@/utils/tailwindMerge";
import React, { useEffect, useLayoutEffect, useState } from "react";
import MiniButtonRow from "../../../ui/mini-buttons";

export const InfiniteMovingButtons = ({
  buttonLabels,
  onSubmit,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  buttonLabels: string[];
  onSubmit: (e: string) => void;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (
      scrollerRef.current &&
      scrollerRef.current.children.length > buttonLabels.length
    )
      return;
    requestAnimationFrame(() => {
      addAnimation();
    });
  }, []);

  useEffect(() => {
    return () => {
      scrollerRef.current?.replaceChildren(); // Clear duplicated nodes on unmount
    };
  }, []);

  const [start, setStart] = useState(false);
  const addAnimation = () => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      const fragment = document.createDocumentFragment();

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;

        // Disable accessibility on the cloned element
        duplicatedItem.setAttribute("aria-hidden", "true");

        // Also remove it from tab order
        duplicatedItem
          .querySelectorAll<HTMLElement>("button")
          .forEach((btn) => {
            btn.setAttribute("tabindex", "-1");
            btn.setAttribute("aria-hidden", "true");
          });

        fragment.appendChild(duplicatedItem);
      });

      scrollerRef.current.appendChild(fragment);

      getDirection();
      getSpeed();
      setStart(true);
    }
  };
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "300s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-4xl overflow-hidden sm:px-0 [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        <MiniButtonRow onSubmit={onSubmit} miniButtonLabels={buttonLabels} />
      </ul>
    </div>
  );
};
