import { useEffect, useState } from "react";
import Carousel from "@/ui/carousel";
import SearchSection from "../search-section/search-section";
import Footer from "../footer/footer";
import { Header } from "../header/header";
import { ErrorBoundary } from "../error/error-handler";
import { triggerError } from "@/lib/error-trigger";




const HomePage = () => {

  const [onSubmitValue, setOnSubmitValue] = useState<string>();

  useEffect(() => {
triggerError(new Error("First load may be slow due to Netlify free hosting. Please reload — we’ll fix this soon."));
},[]);


  useEffect(() => {
    if (onSubmitValue) {
    }
  }, [onSubmitValue]);

  return (
    <>
<ErrorBoundary>
  <Header onSubmit={setOnSubmitValue} />
  <SearchSection onSubmit={setOnSubmitValue} />
  <div className="mb-5 flex flex-col items-center justify-center w-full">
    <Carousel image={onSubmitValue} />
  </div>
  <Footer />
</ErrorBoundary>
    </>
  );
};

export default HomePage;


