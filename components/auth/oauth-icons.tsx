import type { ReactNode } from "react";

/** Official Google "G" (four brand colors). */
export function GoogleMark({ className }: { className?: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      data-icon="inline-start"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/** Official Apple logo (monochrome; follows currentColor). */
export function AppleMark({ className }: { className?: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      data-icon="inline-start"
    >
      <path
        fill="currentColor"
        d="M16.365 1.43c0 1.14-.415 2.052-1.107 2.85-.775.894-1.703 1.446-2.727 1.362-.132-1.072.415-2.21 1.14-3.017C14.394 1.726 15.646 1.14 16.365 1.43zm4.729 16.098c-.54 1.187-.797 1.716-1.49 2.768-.967 1.478-2.328 3.32-4.01 3.336-1.493.02-1.887-.972-3.935-.962-2.05.01-2.48.988-3.978.968-1.682-.015-2.964-1.675-3.93-3.153C1.94 17.77 1.66 12.88 3.31 10.23c1.176-1.85 3.04-2.93 4.793-2.93 1.783 0 2.905.973 4.38.973 1.43 0 2.3-.978 4.36-.978 1.547 0 3.184.842 4.353 2.295-3.83 2.096-3.21 7.56.898 9.938z"
      />
    </svg>
  );
}

/** Official Facebook "f" mark (brand blue). */
export function FacebookMark({ className }: { className?: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      data-icon="inline-start"
    >
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}
