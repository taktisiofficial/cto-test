import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      wrapperClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={`w-full ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-[var(--radius-md)] border
              ${
                hasError
                  ? "border-[var(--danger-500)] focus:border-[var(--danger-600)] focus:ring-[var(--danger-500)]"
                  : "border-[var(--border-default)] focus:border-[var(--border-focus)] focus:ring-[var(--focus-ring-color)]"
              }
              bg-[var(--surface-base)] text-[var(--text-primary)]
              placeholder:text-[var(--text-tertiary)]
              px-3 py-2.5 text-base
              min-h-[var(--touch-target-min)]
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon || hasError ? "pr-10" : ""}
              transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]
              focus:outline-none focus:ring-[var(--focus-ring-width)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--surface-1)]
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />
          {(rightIcon || hasError) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {hasError ? (
                <AlertCircle
                  className="h-5 w-5 text-[var(--danger-500)]"
                  aria-hidden="true"
                />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-[var(--danger-600)]"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-[var(--text-secondary)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
