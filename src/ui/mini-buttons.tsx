import { buttonVariants } from "@/constants/constants";
import Button from "./button";

const MiniButtonRow = ({
  miniButtonLabels,
  onSubmit,
}: {
  miniButtonLabels: string[];
  onSubmit: (e: string) => void;
}) => {
  const handleClick = (label: string) => {
    if (label) {
      onSubmit(label);
    }
  };

  return (
    <div className="mt-4 flex justify-center flex-wrap gap-2">
      {miniButtonLabels.map((label, index) => (
        <Button
          key={index}
          type="button"
          aria-label="submit"
          onClick={() => handleClick(label)}
          className={buttonVariants({ variant: "mini", size: "sm", rounded: "md" })}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default MiniButtonRow;
