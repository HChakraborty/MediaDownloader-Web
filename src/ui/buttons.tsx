"use client";

type ButtonRowProps = {
  buttonLabels: string[];
  onSubmit: (e: string | undefined) => void;
};


export default function ButtonRow({ buttonLabels, onSubmit }: ButtonRowProps) {
  const handleClick = (label: string) => {
    if (onSubmit) {
      onSubmit(label);
    }
  };

  return (
    <div className="mt-5 mb-5 flex justify-center flex-wrap gap-2">
      {buttonLabels.map((label) => (
        <button
          key={label}
          type="button" // prevent form submit if inside a form
          onClick={() => handleClick(label)}
          className="text-md font-medium transition-all duration-200 px-4 py-2 rounded-full hover:bg-gray-200 text-white hover:text-black active:bg-gray-500 active:shadow active:text-white"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
