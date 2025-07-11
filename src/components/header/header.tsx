import React, {
  memo,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  Suspense,
} from "react";
import { motion } from "framer-motion";
import { buttonLabels, productName } from "@/constants/constants";
import Button from "@/ui/button";
import cn from "@/utils/tailwindMerge";
const PlaceholdersAndVanishInput = React.lazy(
  () => import("@/ui/placeholders-and-vanish-input")
);
import { easeInOut } from "framer-motion";
import productLogo from "@/assets/icons/open-image-logo.png";
const ExpandableAbout = React.lazy(
  () => import("@/pages/home-page/expandable-about")
);
const ExpandableContact = React.lazy(
  () => import("@/pages/home-page/expandable-contact")
);

type HeaderProps = {
  setShowLogin: (show: boolean) => void;
  scrollHeaderVisible: boolean;
  onSubmit: (query: string | undefined) => void;
  downloadComplete: boolean;
  setDownloadComplete: (e: boolean) => void;
  setMobileSearchBarOpen: (e: boolean) => void;
  scrollMobileHeaderVisible: boolean;
};

const animation = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: easeInOut } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: easeInOut } },
};

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

const Header = (props: HeaderProps) => {
  const {
    setShowLogin,
    scrollHeaderVisible,
    onSubmit,
    scrollMobileHeaderVisible,
  } = props;
  const [_, setMenuOffset] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const disabled = false;

  useLayoutEffect(() => {
    if (headerRef.current) {
      setMenuOffset(headerRef.current.offsetHeight);
    }
  }, [scrollHeaderVisible]);

  useEffect(() => {
    const updateOffset = () => {
      if (headerRef.current) setMenuOffset(headerRef.current.offsetHeight);
    };
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

const headerClasses = useMemo(
  () =>
    cn(
      "fixed top-0 left-0 right-0 z-[5000] border-none py-2 px-3 sm:px-4 font-[Inter] transition-all ease-in-out",
      scrollHeaderVisible
        ? " bg-zinc-100 dark:bg-zinc-900 text-foreground shadow border-b border-border"
        : "bg-transparent text-foreground"
    ),
  [scrollHeaderVisible]
);


  const isMobile = useIsMobile();

  return (
    <>
      <motion.div
        ref={headerRef}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animation}
        className={headerClasses}
      >
        <div className="w-full flex items-center justify-between gap-2 pt-2">
          <div className="flex-shrink-0">
            <div className="block sm:hidden">
              <img
                src={productLogo}
                alt="OpenImage Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className={cn("hidden sm:block text-lg font-semibold truncate",
              scrollHeaderVisible ? "text-black" : "text-white"
            )}>
              {productName}
            </div>
          </div>

          <motion.div
            initial={false}
            animate={{
              opacity: (
                isMobile ? scrollMobileHeaderVisible : scrollHeaderVisible
              )
                ? 1
                : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-grow basis-0 px-2 min-w-0"
          >
            <Suspense
              fallback={
                <div className="h-auto bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse" />
              }
            >
              <PlaceholdersAndVanishInput
                onSubmit={onSubmit}
                downloadComplete={props.downloadComplete}
                setDownloadComplete={props.setDownloadComplete}
                setMobileSearchBarOpen={props.setMobileSearchBarOpen}
                showMobileBar={true}
              />
            </Suspense>
          </motion.div>

          <div className="flex flex-row items-center flex-wrap gap-3 text-sm text-white sm:text-inherit">
            <div className="flex gap-3 items-center">
              <span
                onClick={() => setIsAboutOpen(true)}
                className={cn(
                  "hover:underline cursor-pointer transition-colors duration-200",
                  scrollHeaderVisible ? "text-black" : "text-white"
                )}
              >
                About
              </span>
              <span
                onClick={() => setIsContactOpen(true)}
                className={cn(
                  "hover:underline cursor-pointer transition-colors duration-200",
                  scrollHeaderVisible ? "text-black" : "text-white"
                )}
              >
                Contact
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <Button
                variant="default"
                onClick={() => setShowLogin(true)}
                className={cn(
                  "border border-gray-400 dark:border-gray-500 text-white rounded-full bg-transparent cursor-pointer transition-all",
                  scrollHeaderVisible && "text-black bg-white"
                )}
                disabled={!disabled}
              >
                {buttonLabels.Join.name}
              </Button>

              <Button
                variant="success"
                onClick={() => {}}
                className={cn(
                  "rounded-full cursor-pointer transition-all hidden sm:inline-block",
                  scrollHeaderVisible && "text-white"
                )}
                disabled={!disabled}
              >
                {buttonLabels.Upload.name}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      <Suspense fallback={null}>
        <ExpandableAbout
          isAboutOpen={isAboutOpen}
          setIsAboutOpen={setIsAboutOpen}
        />
        <ExpandableContact
          isContactOpen={isContactOpen}
          setIsContactOpen={setIsContactOpen}
        />
      </Suspense>
    </>
  );
};

export default memo(Header);
