import { useEffect } from "react";
import {
  Briefcase,
  Users,
  Download,
  RefreshCcw,
  X,
  Coffee,
} from "lucide-react";
import ExpandableChildren from "@/ui/expandable-children";

type AboutProps = {
  isAboutOpen: boolean;
  setIsAboutOpen: (e: boolean) => void;
};

const services = [
  {
    icon: <Briefcase className="h-8 w-8" />,
    title: "High-impact business services",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Learn from the community",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: <Download className="h-8 w-8" />,
    title: "Customer acquisition",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: <RefreshCcw className="h-8 w-8" />,
    title: "Business to business",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const ExpandableAbout = ({ isAboutOpen, setIsAboutOpen }: AboutProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAboutOpen(false);
    };

    if (isAboutOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAboutOpen]);

  return (
    <ExpandableChildren
      isOpen={isAboutOpen}
      onClose={() => setIsAboutOpen(false)}
      zIndex={7000}
      overlayClassName="bg-black/70"
      className="w-full h-full sm:w-[90vw] sm:h-[85vh] max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-lg"
    >
      <div className="relative w-full h-full p-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsAboutOpen(false)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-black rounded-full p-2 shadow cursor-pointer animate-pulse z-[7500]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          High-impact business services
        </h2>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-green-50 p-5 rounded-lg shadow-sm flex flex-col gap-4"
            >
              <div className="text-gray-800">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="text-sm text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Big, Friendly Support Section */}
        {/* Friendly Support Message */}
        <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
          <p className="text-sm text-yellow-800">
            💛 This project is still in development. If you enjoy using it and
            would like to support its growth, consider{" "}
            <button
              onClick={() =>
                window.open("https://www.buymeacoffee.com/yourname", "_blank")
              }
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-yellow-600 text-white rounded-full font-medium hover:bg-yellow-700 transition-colors duration-200 cursor-pointer"
            >
              Buy me a coffee <Coffee className="w-4 h-4" />
            </button>
          </p>
        </div>
      </div>
    </ExpandableChildren>
  );
};

export default ExpandableAbout;
