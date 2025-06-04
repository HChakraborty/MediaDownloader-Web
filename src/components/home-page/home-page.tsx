import { Carousel } from "@/ui/carousel";
import { DisplayCards } from "../display-cards/display-cards";
import { VideoCards } from "../display-cards/video-cards";
import SearchSection from "../search-section/search-section";

const HomePage = () => {
  const slides = [
    { content: <DisplayCards key="display" /> },
    { content: <VideoCards key="video" /> },
  ];

  return (
    <>
      <SearchSection />
      <div className="mt-5 mb-5 flex justify-center items-center w-full">
        <Carousel slides={slides} />
      </div>
    </>
  );
};

export default HomePage;
