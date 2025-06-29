import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import cn from "@/utils/tailwindMerge";
import useScrollDirection from "@smakss/react-scroll-direction";

function FooterContent({ showHaze }: { showHaze: boolean }) {
  return (
    <footer className="relative bg-gray-100 text-gray-700 text-sm w-full border-t border-gray-300">
      {showHaze && (
        <div
          className="absolute -top-12 left-0 right-0 h-12 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(243, 244, 246, 1) 0%, rgba(243,244,246,0) 100%)",
          }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:space-x-8">
          <div className="mb-4 md:mb-0 max-w-md">
            <div className="text-2xl font-bold text-gray-800 mb-2">OpenImage</div>
            <p>
              Over 5.5 million+ high quality stock images, videos and music shared by our talented community.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Discover</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Editor's Choice</a></li>
                <li><a href="#" className="hover:underline">Curated Collections</a></li>
                <li><a href="#" className="hover:underline">OpenImage Radio</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Community</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Forum</a></li>
                <li><a href="#" className="hover:underline">Creators</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li><a href="#" className="hover:underline">License Summary</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} OpenImage. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const FloatingFooter = ({ className }: { className?: string }) => {
  const [atEnd, setAtEnd] = useState(false);
  const [show, setShow] = useState(false);
  const { scrollDir } = useScrollDirection();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const nearBottom = scrollY + viewportHeight >= fullHeight - 50;
      setAtEnd(nearBottom);

      // Only update show if state actually changes
      if (nearBottom) {
        if (!show) setShow(true);
      } else if (scrollDir === "up") {
        if (!show) setShow(true);
      } else {
        if (show) setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDir, show]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: show ? 0 : 100,
        opacity: show ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className={cn("fixed bottom-0 left-0 right-0 z-[5000]", className)}
    >
      <FooterContent showHaze={!atEnd} />
    </motion.div>
  );
};

export default FloatingFooter;
