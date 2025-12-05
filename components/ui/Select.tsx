import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      wrapperClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={`w-full ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full rounded-[var(--radius-md)] border
              ${
                hasError
                  ? "border-[var(--danger-500)] focus:border-[var(--danger-600)] focus:ring-[var(--danger-500)]"
                  : "border-[var(--border-default)] focus:border-[var(--border-focus)] focus:ring-[var(--focus-ring-color)]"
              }
              bg-[var(--surface-base)] text-[var(--text-primary)]
              px-3 py-2.5 pr-10 text-base
              min-h-[var(--touch-target-min)]
              appearance-none cursor-pointer
              transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]
              focus:outline-none focus:ring-[var(--focus-ring-width)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--surface-1)]
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                ? `${selectId}-helper`
                : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
            {hasError && (
              <AlertCircle
                className="h-5 w-5 text-[var(--danger-500)]"
                aria-hidden="true"
              />
            )}
            <ChevronDown
              className="h-5 w-5 text-[var(--text-tertiary)]"
              aria-hidden="true"
            />
          </div>
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-[var(--danger-600)]"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${selectId}-helper`}
            className="mt-1.5 text-sm text-[var(--text-secondary)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
