"use client";

import { fetchOpenverseImages } from "@/hooks/image-fetch";
import { FocusCards } from "../../ui/focus-cards";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type CardData = {
  title: string;
  url: string;
  license: string;
  thumbnail: string;
};

export default function PhotoCards({
  value,
  attributionRequired,
}: {
  value: string | undefined;
  attributionRequired: boolean;
}) {
  const [images, setImages] = useState<CardData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.1 });

  const currentPage = useRef(1);
  const MAX_IMAGES = 200;
  const PAGE_SIZE = 20;

  // Reset when value or attributionRequired changes
  useEffect(() => {
    setImages([]);
    setHasMore(true);
    currentPage.current = 1;
  }, [value, attributionRequired]);

  const fetchImages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const desiredCount = 20;
    const newImages: CardData[] = [];

    while (newImages.length < desiredCount) {
      try {
        const data = await fetchOpenverseImages(
          value ?? "dog",
          currentPage.current,
          PAGE_SIZE,
          attributionRequired,
        );

        const results = data?.results ?? [];
        if (results.length === 0) break;

        const mapped = results.map((img: any) => ({
          title: img.title,
          url: img.url,
          license: img.license,
          thumbnail: img.thumbnail
        }));

        newImages.push(...mapped);
        currentPage.current += 1;

        if (images.length + newImages.length >= MAX_IMAGES) break;
      } catch (err) {
        console.error("Failed to fetch images:", err);
        break;
      }
    }

    setImages((prev) => [...prev, ...newImages]);

    if (
      newImages.length < desiredCount ||
      images.length + newImages.length >= MAX_IMAGES
    ) {
      setHasMore(false);
    }

    setLoading(false);
  };

  // Initial & scroll-triggered fetch
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchImages();
    }
  }, [inView, hasMore, loading]);

  return (
    <AnimatePresence mode="wait">
      <motion.div ref={ref}
        key={`motion-${value}`}
        className="list-none relative inset-0"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 2, delay: 0.2 }}
      >
        <Suspense fallback={<div>Loading photos...</div>}>
          <FocusCards cards={images} />
        </Suspense>

        {hasMore && (
          <div className="h-10 mt-6 flex items-center justify-center">
            <span className="text-sm text-gray-500">Loading more...</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
