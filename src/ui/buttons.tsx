"use client";

import { Link, useLocation } from "react-router-dom";

type ButtonRowProps = {
  buttonLabels: { label: string; path: string }[];
  onRouteSelected: (route: string) => void;
};

export default function ButtonRow({ buttonLabels, onRouteSelected }: ButtonRowProps) {
  const location = useLocation();

  return (
    <div className="mt-5 mb-5 flex justify-center flex-wrap gap-2">
      {buttonLabels.map(({ label, path }) => {
        const isActive = location.pathname === path;

        return (
          <Link
            key={label}
            to={path}
            onClick={() => onRouteSelected(path)}
            className={`text-md font-medium transition-all duration-200 px-4 py-2 rounded-full ${
              isActive
                ? "bg-white text-black shadow"
                : "text-white hover:text-gray-300"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
