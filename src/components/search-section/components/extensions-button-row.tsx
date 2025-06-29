import { buttonVariants } from "@/constants/constants";
import Button from "@/ui/button";
import cn from "@/utils/tailwindMerge";

type ButtonRowProps = {
  extensions: string[];
  onSubmitExtension: (e: string) => void;
  activeExtension: string | undefined;
};

const ExtensionsButtonRow = ({
  extensions,
  onSubmitExtension,
  activeExtension,
}: ButtonRowProps) => {
  const handleClick = (extension: string) => {
    onSubmitExtension?.(extension);
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
          className={cn(
            buttonVariants({ variant: "extension", rounded: "full" }),
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
