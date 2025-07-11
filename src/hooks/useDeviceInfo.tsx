import { useEffect, useRef, useState } from "react";

export function useDeviceInfo(breakpoint = 768) {
  const isTouchRef = useRef<boolean>(
    typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth < breakpoint;
    return false;
  });

  useEffect(() => {
    const updateMobile = () => {
      const isNowMobile = window.innerWidth < breakpoint;
      setIsMobile((prev) => (prev !== isNowMobile ? isNowMobile : prev));
    };

    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, [breakpoint]);

  return {
    isTouch: isTouchRef.current,
    isMobile,
  };
}
