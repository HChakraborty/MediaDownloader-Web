import { useEffect, useState } from "react";
import Carousel from "@/ui/carousel";
import SearchSection from "@/components/search-section/search-section";
import FloatingFooter from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { ErrorBoundary } from "@/error/error-handler";
import { triggerError } from "@/error/error-trigger";
import { slowLoadingWarning } from "@/constants/constants";

const HomePage = () => {
  const [onSubmitValue, setOnSubmitValue] = useState<string>();
  const [onSubmitExtension, setOnSubmitExtension] = useState<string>();

  useEffect(() => {
    triggerError(new Error(slowLoadingWarning));
  }, []);

  useEffect(()=> {
    if(onSubmitValue || onSubmitExtension) {
    }
  },[onSubmitValue, onSubmitExtension])

  return (
    <ErrorBoundary>
      <Header onSubmit={setOnSubmitValue} />
      <SearchSection onSubmitExtension={setOnSubmitExtension} onSubmit={setOnSubmitValue} activeExtension={onSubmitExtension}/>
      <div className="mb-50 flex flex-col items-center justify-center w-full">
        <Carousel image={onSubmitValue} extension={onSubmitExtension}/>
      </div>
      <FloatingFooter />
    </ErrorBoundary>
  );
};

export default HomePage;
