import { Suspense, useEffect, useState } from "react";
import Carousel from "@/ui/carousel";
import SearchSection from "@/components/search-section/search-section";
import FloatingFooter from "@/components/footer/footer";
import ScrollHeader from "@/components/header/scroll-header";
import { ErrorBoundary } from "@/error/error-handler";
import { triggerError } from "@/error/error-trigger";
import { slowLoadingWarning } from "@/constants/constants";
import React from "react";
import ScrollToTopButton from "@/ui/scroll-up";
const Authentication = React.lazy(
  () => import("@/pages/authentication/authentication")
);

const HomePage = () => {
  const [onSubmitValue, setOnSubmitValue] = useState<string>();
  const [onSubmitExtension, setOnSubmitExtension] = useState<string>("all");
  const [showLogin, setShowLogin] = useState(false);
  const [scrollHeaderVisible, setScrollHeaderVisible] = useState(false);

  useEffect(() => {
    triggerError(new Error(slowLoadingWarning));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrollHeaderVisible(true);
      } else {
        setScrollHeaderVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (onSubmitValue || onSubmitExtension) {
    }
  }, [onSubmitValue, onSubmitExtension]);

  return (
    <ErrorBoundary>
      <ScrollHeader
        onSubmit={setOnSubmitValue}
        setShowLogin={setShowLogin}
        scrollHeaderVisible={scrollHeaderVisible}
        setScrollHeaderVisible={setScrollHeaderVisible}
      />
      <SearchSection
        onSubmitExtension={setOnSubmitExtension}
        onSubmit={setOnSubmitValue}
        activeExtension={onSubmitExtension}
        setShowLogin={setShowLogin}
        scrollHeaderVisible={scrollHeaderVisible}
        setScrollHeaderVisible={setScrollHeaderVisible}
      />
      <div className="mb-50 flex flex-col items-center justify-center w-full">
        <Carousel image={onSubmitValue} extension={onSubmitExtension} />
      </div>
      <ScrollToTopButton />
      <FloatingFooter />
      <Suspense fallback={null}>
        <Authentication showLogin={showLogin} setShowLogin={setShowLogin} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default HomePage;
