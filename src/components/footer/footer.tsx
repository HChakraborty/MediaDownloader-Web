import cn from "@/utils/tailwindMerge";

function FooterContent() {
  return (
    <footer className="relative bg-[#eaeaea] text-gray-800 text-sm w-full overflow-hidden shadow-sm">
      {/* Hazy gradient that blends upward into page content */}
      <div
        className="absolute -top-6 left-0 right-0 h-6 z-10 pointer-events-none backdrop-blur-sm"
        style={{
          background:
            "linear-gradient(to top, rgba(234, 234, 234, 0.9), rgba(234, 234, 234, 0))",
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-4 flex justify-center">
        <div className="text-gray-700 text-xs sm:text-sm text-center">
          © {new Date().getFullYear()} <span className="font-semibold">OpenImage</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const Footer = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full relative", className)}>
      <FooterContent />
    </div>
  );
};

export default Footer;
