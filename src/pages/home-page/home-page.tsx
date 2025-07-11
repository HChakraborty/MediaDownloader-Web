import { Suspense, useEffect, useState } from "react";
import Carousel from "@/ui/carousel";
import SearchSection from "@/components/search-section/search-section";
import { ErrorBoundary } from "@/error/error-handler";
import React from "react";
import ScrollToTopButton from "@/ui/scroll-up";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
const Authentication = React.lazy(
  () => import("@/pages/authentication/authentication")
);
const MobileSearchBar = React.lazy(() => import("./mobile-search-bar"));

const HomePage = () => {
  const [onSubmitValue, setOnSubmitValue] = useState<string>();
  const [onSubmitExtension, setOnSubmitExtension] = useState<string>("all");
  const [showLogin, setShowLogin] = useState(false);
  const [scrollHeaderVisible, setScrollHeaderVisible] = useState(false);
  const [scrollMobileHeaderVisible, setScrollMobileHeaderVisible] =
    useState(false);
  const [downloadComplete, setDownloadComplete] = useState(true);
  const [mobileSearchBarOpen, setMobileSearchBarOpen] = useState(false);

  useEffect(() => {
    let desktopThreshold = 10;
    let mobileThreshold = 300;

    const updateScrollVisibility = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        setScrollHeaderVisible(scrollY > desktopThreshold);
        setScrollMobileHeaderVisible(scrollY > mobileThreshold);
      } else {
        setScrollHeaderVisible(scrollY > desktopThreshold);
        setScrollMobileHeaderVisible(false);
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollVisibility);

    // Initial run
    updateScrollVisibility();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollVisibility);
    };
  }, []);

  useEffect(() => {
    if (onSubmitValue || onSubmitExtension) {
    }
  }, [onSubmitValue, onSubmitExtension]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-900">
      <ErrorBoundary>
        {/* Header always on top */}
        <Header
          onSubmit={setOnSubmitValue}
          setShowLogin={setShowLogin}
          scrollHeaderVisible={scrollHeaderVisible}
          downloadComplete={downloadComplete}
          setDownloadComplete={setDownloadComplete}
          setMobileSearchBarOpen={setMobileSearchBarOpen}
          scrollMobileHeaderVisible={scrollMobileHeaderVisible}
        />

        {/* Main content grows */}
        <main className="flex-1 flex flex-col">
          <SearchSection
            onSubmitExtension={setOnSubmitExtension}
            onSubmit={setOnSubmitValue}
            activeExtension={onSubmitExtension}
            setShowLogin={setShowLogin}
            downloadComplete={downloadComplete}
            setDownloadComplete={setDownloadComplete}
            setMobileSearchBarOpen={setMobileSearchBarOpen}
          />

          <div className="mb-2 lg:mb-6 flex flex-col items-center justify-center w-full">
            <Carousel
              image={onSubmitValue}
              extension={onSubmitExtension}
              downloadComplete={downloadComplete}
              setDownloadComplete={setDownloadComplete}
            />
          </div>
        </main>

        {/* Footer sticks to bottom */}
        <Footer />

        {/* Lazy-loaded overlays */}
        <ScrollToTopButton />
        <Suspense fallback={null}>
          <div className="block sm:hidden">
            <MobileSearchBar
              show={mobileSearchBarOpen}
              onClose={() => setMobileSearchBarOpen(false)}
              onSubmit={setOnSubmitValue}
              downloadComplete={downloadComplete}
              setDownloadComplete={setDownloadComplete}
              setMobileSearchBarOpen={setMobileSearchBarOpen}
            />
          </div>
        </Suspense>
        <Suspense fallback={null}>
          <Authentication showLogin={showLogin} setShowLogin={setShowLogin} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
