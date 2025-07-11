function Tool({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={label.trim().toLowerCase() !== "crop" ? undefined : onClick}
      disabled={label.trim().toLowerCase() !== "crop"}
      className={`flex flex-col items-center justify-center px-3 text-xs transition ${
        active ? "text-blue-600" : "text-gray-800"
      } ${
        label.trim().toLowerCase() !== "crop"
          ? "opacity-50 cursor-not-allowed"
          : "hover:text-blue-600"
      }`}
    >
      <div className="text-2xl">{icon}</div>
      <span className="mt-1 uppercase tracking-wider">{label}</span>
    </button>
  );
}

export default Tool;
