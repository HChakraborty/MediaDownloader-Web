import { fetchOpenverseImages } from "@/hooks/image-fetch";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { LoaderCircle } from "lucide-react";
import getRandomItem from "@/utils/random-item";
import { categoriesButtonLabel } from "@/constants/constants";
import React from "react";
const FocusCards = React.lazy(() => import("@/ui/focus-cards"));


type CardData = {
  title: string;
  url: string;
  license: string;
  thumbnail: string;
  attribution: string;
  width: number;
  height: number;
};

export default function PhotoCards({
  value,
  attributionRequired,
  extension,
}: {
  value: string | undefined;
  attributionRequired: boolean;
  extension: string | undefined;
}) {
  const [images, setImages] = useState<CardData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.1 });

  const currentPage = useRef(1);
  const MAX_IMAGES = 200;
  const PAGE_SIZE = 20;

  // Reset when value or attributionRequired or extension changes
  useEffect(() => {
    setImages([]);
    setHasMore(true);
    currentPage.current = 1;
  }, [value, attributionRequired, extension]);

  const fetchImages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const desiredCount = PAGE_SIZE;
    const newImages: CardData[] = [];

    while (newImages.length < desiredCount) {
      try {
        const query: string = value ?? await getRandomItem(categoriesButtonLabel);
        const ext: string = (extension === undefined || extension === null || extension === 'all')
          ? 'all'
          : extension;


        const data = await fetchOpenverseImages(
          query,
          currentPage.current,
          attributionRequired,
          ext
        );

        const results = data?.results ?? [];
        currentPage.current += 1;

        if (results.length === 0) {
          console.log("⚠ No results on this page.");
          break; // No more results — stop fetching
        }

        const mapped = results.map((img: any) => ({
          title: img.title,
          url: img.url,
          license: img.license,
          thumbnail: img.thumbnail,
          attribution: img.attribution,
          width: img.width,
          height: img.height
        }));

        newImages.push(...mapped);

        if (images.length + newImages.length >= MAX_IMAGES) {
          break; // We've reached our max
        }

      } catch (err) {
        console.error("❌ Failed to fetch images:", err);
        break;
      }
    }

    setImages(prev => [...prev, ...newImages]);

    if (
      newImages.length === 0 || // No new images this round
      images.length + newImages.length >= MAX_IMAGES
    ) {
      setHasMore(false);
    }

    setLoading(false);
    await delay(1000);
  };

  // Trigger fetch on inView
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchImages();
    }
  }, [inView, hasMore, loading]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        key={`motion-${value}-${extension}`}
        className="list-none relative inset-0"
    initial={{ y: 60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -60, opacity: 0 }}
    transition={{ duration: 0.8 }}
      >
        <Suspense fallback={<div>Loading photos...</div>}>
          <FocusCards cards={images} />
        </Suspense>

        {hasMore && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-10 mt-6 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <LoaderCircle className="w-6 h-6 text-black" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
