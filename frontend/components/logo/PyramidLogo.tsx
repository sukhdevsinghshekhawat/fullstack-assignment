interface PyramidLogoProps {
    className?: string;
}

/**
 * Simple geometric pyramid mark used on the login screen.
 * Matches the Figma logo placement at the top center.
 */
export function PyramidLogo({ className }: PyramidLogoProps) {
    return (
        <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="TaskFlow logo"
        >
            <path
                d="M28 6 50 46H6L28 6Z"
                fill="rgb(var(--color-primary))"
            />
            <path
                d="M28 6V46"
                stroke="rgb(var(--color-primary-foreground))"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M28 26 44 46H12L28 26Z"
                fill="rgb(var(--color-primary-foreground))"
                opacity="0.15"
            />
        </svg>
    );
}