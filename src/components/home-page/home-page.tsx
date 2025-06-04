import { Carousel } from "@/ui/carousel";
import { DisplayCards } from "../display-cards/display-cards";
import { VideoCards } from "../display-cards/video-cards";
import SearchSection from "../search-section/search-section";
import { useState } from "react";

const HomePage = () => {
  const slides = [
    { content: <DisplayCards key="/photos" /> },
    { content: <VideoCards key="/videos" /> },
  ];

  const [selectedRoute, setSelectedRoute] = useState(window.location.pathname || slides[0].content.key);
  

  return (
    <>
      <SearchSection onRouteSelected={setSelectedRoute}/>
      <div className="mt-5 mb-5 flex justify-center items-center w-full">
        <Carousel slides={slides} selectedRoute={selectedRoute}/>
      </div>
    </>
  );
};

export default HomePage;
