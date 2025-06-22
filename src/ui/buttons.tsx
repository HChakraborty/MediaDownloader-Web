"use client";

import { cn } from "@/utils/tailwindMerge";

type ButtonRowProps = {
  extensions: string[];
  onSubmitExtension: (e: string) => void;
  activeExtension: string | undefined;
};


export default function ExtensionsButtonRow({ extensions, onSubmitExtension, activeExtension }: ButtonRowProps) {
  const handleClick = (extension: string) => {
    if (onSubmitExtension) {
      onSubmitExtension(extension);
    }
  };

  return (
    <div className="mt-5 mb-5 flex justify-center flex-wrap gap-2">
      {extensions.map((extension) => (
        <button
          key={extension}
          type="button" // prevent form submit if inside a form
          onClick={() => handleClick(extension)}
          className={cn("text-md font-medium transition-all duration-200 px-4 py-2 rounded-full hover:bg-gray-200 hover:text-black active:bg-gray-500 active:shadow active:text-white",
            activeExtension === extension ?
                                    "bg-neutral-100 text-black ring-2 ring-neutral-300" : "text-white"
          )}
        >
          {extension.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
