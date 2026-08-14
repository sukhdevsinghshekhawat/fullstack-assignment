import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 ' +
  'text-sm font-semibold transition-colors duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 w-full';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  outline:
    'bg-surface text-foreground border border-border hover:bg-muted',
};

/**
 * Reusable button used across the login screen.
 * Handles loading state and prevents duplicate submission.
 */
export function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/** Minimal inline loading spinner. */
function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}