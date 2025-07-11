import { useEffect } from "react";
import { X, Mail, Twitter, Github } from "lucide-react";
import ExpandableChildren from "@/ui/expandable-children";

type ContactProps = {
  isContactOpen: boolean;
  setIsContactOpen: (e: boolean) => void;
};

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: "Email",
    value: "support@openimage.com",
    href: "mailto:support@openimage.com",
  },
  {
    icon: <Twitter className="w-6 h-6" />,
    label: "Twitter",
    value: "@OpenImage",
    href: "https://twitter.com/OpenImage",
  },
  {
    icon: <Github className="w-6 h-6" />,
    label: "GitHub",
    value: "github.com/openimage",
    href: "https://github.com/openimage",
  },
];

const ExpandableContact = ({
  isContactOpen,
  setIsContactOpen,
}: ContactProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsContactOpen(false);
    };

    if (isContactOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContactOpen]);

  return (
    <ExpandableChildren
      isOpen={isContactOpen}
      onClose={() => setIsContactOpen(false)}
      zIndex={7000}
      overlayClassName="bg-black/70"
      className="w-full h-full sm:w-[90vw] sm:h-[75vh] max-w-5xl max-h-[90vh] bg-white rounded-lg shadow-lg"
    >
      <div className="relative w-full h-full p-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsContactOpen(false)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-black rounded-full p-2 shadow cursor-pointer animate-pulse z-[7500]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Get in Touch
        </h2>

        {/* Contact Info Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {contactInfo.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-50 hover:bg-blue-100 transition-colors duration-200 p-5 rounded-lg shadow-sm flex flex-col items-center gap-2 text-center"
            >
              <div className="text-blue-700">{item.icon}</div>
              <h3 className="text-md font-semibold text-blue-900">
                {item.label}
              </h3>
              <p className="text-sm text-blue-800 break-words">{item.value}</p>
            </a>
          ))}
        </div>

        {/* Message */}
        <p className="text-center text-sm text-gray-600">
          We're always happy to connect with the community and hear your ideas,
          feedback, or partnership inquiries.
        </p>
      </div>
    </ExpandableChildren>
  );
};

export default ExpandableContact;
