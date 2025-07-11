import { buttonVariants } from "@/constants/constants";
import Button from "@/ui/button";
import cn from "@/utils/tailwindMerge";

type ButtonRowProps = {
  extensions: string[];
  onSubmitExtension: (e: string) => void;
  activeExtension: string | undefined;
  downloadComplete: boolean;
  setDownloadComplete: (e: boolean) => void;
};

const ExtensionsButtonRow = ({
  extensions,
  onSubmitExtension,
  activeExtension,
  downloadComplete,
  setDownloadComplete
}: ButtonRowProps) => {
  const handleClick = (extension: string) => {
    onSubmitExtension?.(extension);
    setDownloadComplete(false);
  };

  return (
    <>
      {extensions.map((extension) => (
        <Button
          key={extension}
          type="button"
          onClick={() => handleClick(extension)}
          aria-pressed={activeExtension === extension}
          aria-label={`submit ${extension}`}
          disabled={!downloadComplete}
          className={cn(
            buttonVariants({ variant: "extension", rounded: "full" }),
            "text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2",
            activeExtension === extension
              ? "bg-neutral-100 text-black ring-2 ring-neutral-300"
              : "text-white"
          )}
        >
          {extension.toUpperCase()}
        </Button>
      ))}
    </>
  );
};

export default ExtensionsButtonRow;
