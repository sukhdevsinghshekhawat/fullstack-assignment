interface GoogleIconProps {
  className?: string;
}

/**
 * Official multicolor Google "G" mark used on the
 * "Login with Google" button.
 */
export function GoogleIcon({ className }: GoogleIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.39a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.97-4.32 2.97-7.33z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.97-.9 6.63-2.44l-3.24-2.51c-.9.6-2.05.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.04v2.6A10 10 0 0 0 10 20z"
      />
      <path
        fill="#FBBC05"
        d="M4.4 11.89a5.98 5.98 0 0 1 0-3.78V5.51H1.04a10 10 0 0 0 0 8.98L4.4 11.89z"
      />
      <path
        fill="#EA4335"
        d="M10 3.99c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.96 9.96 0 0 0 10 0 10 10 0 0 0 1.04 5.51L4.4 8.11C5.19 5.75 7.4 3.99 10 3.99z"
      />
    </svg>
  );
}