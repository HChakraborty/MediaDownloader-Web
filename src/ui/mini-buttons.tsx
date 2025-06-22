"use client";

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
    <div className="mt-4 flex justify-center flex-wrap">
      {miniButtonLabels.map((label, index) => (
        <button
          key={index}
          onClick={() => handleClick(label)}
          className={`text-sm font-medium transition-all duration-200 ml-1 mr-1 px-3 py-1.5
  bg-gray-500 rounded-md shadow text-white
  hover:text-gray-300 hover:bg-gray-400
  active:bg-white active:text-black
`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default MiniButtonRow;
