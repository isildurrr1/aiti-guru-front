import { useState, forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff, X } from "lucide-react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: string;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, leftIcon, rightIcon, type = "text", className = "", id, onClear, ...props },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const [internalType, setInternalType] = useState(type);
  const isPassword = type === "password";

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-900 sm:text-base">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={internalType}
          className={[
            "w-full rounded-xl border bg-white px-4 py-2.5 text-base text-gray-900",
            "shadow-sm placeholder:text-gray-400 transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "sm:py-3 sm:text-base",
            leftIcon ? "pl-10" : "",
            isPassword || onClear || rightIcon ? "pr-10" : "",
            error
              ? "border-red-400 focus:ring-red-400/30"
              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20",
          ].join(" ")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setInternalType((p) => (p === "password" ? "text" : "password"))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {internalType === "password" ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
        {!isPassword && onClear && props.value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            tabIndex={-1}
          >
            <X size={18} />
          </button>
        )}
      </div>
      {(error || helperText) && (
        <p className={`text-xs sm:text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});
