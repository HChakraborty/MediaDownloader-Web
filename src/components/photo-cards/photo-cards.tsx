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
  setDownloadComplete,
}: {
  value: string | undefined;
  attributionRequired: boolean;
  extension: string | undefined;
  setDownloadComplete: (e: boolean) => void;
}) {
  const [images, setImages] = useState<CardData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.1 });

  const currentPage = useRef(1);
  const MAX_IMAGES = 200;
  const MAX_PAGES = 10;
  const PAGE_SIZE = 20;

  useEffect(() => {
    setImages([]);
    setHasMore(true);
    currentPage.current = 1;
  }, [value, attributionRequired, extension]);

  const fetchImages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newImages: CardData[] = [];
    let reachedEnd = false;

    let totalLength = images.length;

    try {
      while (!reachedEnd) {
        if (currentPage.current > MAX_PAGES) {
          console.warn("📛 Max API pages reached.");
          reachedEnd = true;
          break;
        }

        const query = value ?? (await getRandomItem(categoriesButtonLabel));
        const ext =
          extension === undefined || extension === null || extension === "all"
            ? "all"
            : extension;

        console.log("➡ Fetching page", currentPage.current);

        const data = await fetchOpenverseImages(
          query,
          currentPage.current,
          attributionRequired,
          ext
        );

        currentPage.current += 1;

        const results = data?.results ?? [];

        if (results.length === 0) {
          console.warn("📭 No results returned from API.");
          reachedEnd = true;
          break;
        }

        const mapped = results.map((img: any) => ({
          title: img.title,
          url: img.url,
          license: img.license,
          thumbnail: img.thumbnail,
          attribution: img.attribution,
          width: img.width,
          height: img.height,
        }));

        newImages.push(...mapped);
        totalLength += mapped.length;

        if (results.length < PAGE_SIZE || totalLength >= MAX_IMAGES) {
          reachedEnd = true;
          break;
        }
      }

      setImages((prev) => [...prev, ...newImages]);

      if (
        totalLength >= MAX_IMAGES ||
        reachedEnd ||
        currentPage.current > MAX_PAGES
      ) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Failed to fetch images:", err);
      setHasMore(false);
    }

    setLoading(false);
    await delay(1000);
    setDownloadComplete(true);
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchImages();
    }
  }, [inView, hasMore, loading]);

  return (
    <AnimatePresence mode="wait">
      <div
        ref={ref}
        key={`motion-${value}-${extension}`}
        className="list-none relative inset-0"
      >
        <Suspense fallback={null}>
          <motion.div
            key={`focus-cards-${value}-${extension}`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <FocusCards cards={images} />
          </motion.div>
        </Suspense>

        {hasMore && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
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
      </div>
    </AnimatePresence>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
