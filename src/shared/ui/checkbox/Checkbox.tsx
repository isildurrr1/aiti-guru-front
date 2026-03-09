interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  className?: string;
}

export function Checkbox({ label, checked, onChange, id, className = "" }: CheckboxProps) {
  const checkboxId = id || `cb-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div
          className={[
            "h-[18px] w-[18px] sm:h-5 sm:w-5 rounded-md border-2 transition-all duration-150",
            "flex items-center justify-center",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/30 peer-focus-visible:ring-offset-1",
            checked
              ? "bg-indigo-600 border-indigo-600"
              : "bg-white border-gray-300 group-hover:border-gray-400",
          ].join(" ")}
        >
          {checked && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm sm:text-base text-gray-600 group-hover:text-gray-800 transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
