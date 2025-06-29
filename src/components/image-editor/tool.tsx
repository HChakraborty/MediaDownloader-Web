function Tool({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-2 rounded hover:bg-neutral-300 transition text-sm"
    >
      {icon}
      <span className="whitespace-pre">{label}</span>
    </button>
  );
}

export default Tool;
