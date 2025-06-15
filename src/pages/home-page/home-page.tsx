import { useEffect, useState } from "react";
import Carousel from "@/ui/carousel";
import SearchSection from "@/components/search-section/search-section";
import Footer from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { ErrorBoundary } from "@/error/error-handler";
import { triggerError } from "@/error/error-trigger";
import { slowLoadingWarning } from "@/constants/constants";

const HomePage = () => {
  const [onSubmitValue, setOnSubmitValue] = useState<string>();

  useEffect(() => {
    triggerError(new Error(slowLoadingWarning));
  }, []);

  useEffect(()=> {
    if(onSubmitValue) {
    }
  },[onSubmitValue])

  return (
    <ErrorBoundary>
      <Header onSubmit={setOnSubmitValue} />
      <SearchSection onSubmit={setOnSubmitValue} />
      <div className="mb-5 flex flex-col items-center justify-center w-full">
        <Carousel image={onSubmitValue} />
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

export default HomePage;
