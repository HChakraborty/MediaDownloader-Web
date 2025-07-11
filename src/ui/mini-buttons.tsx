import { buttonVariants } from "@/constants/constants";
import Button from "./button";
import cn from "@/utils/tailwindMerge";

const MiniButtonRow = ({
  miniButtonLabels,
  onSubmit,
  downloadComplete,
  setDownloadComplete
}: {
  miniButtonLabels: string[];
  onSubmit: (e: string) => void;
  downloadComplete: boolean;
  setDownloadComplete: (e: boolean) => void;
}) => {
  const handleClick = (label: string) => {
    if (label) {
      onSubmit(label);
      setDownloadComplete(false);
    }
  };

  return (
    <div className="mt-4 flex justify-center flex-wrap gap-2">
      {miniButtonLabels.map((label, index) => (
        <Button
          key={index}
          type="button"
          aria-label="submit"
          disabled={!downloadComplete}
          onClick={() => handleClick(label)}
          className={cn(buttonVariants({ variant: "mini", size: "sm", rounded: "md" }))}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default MiniButtonRow;
