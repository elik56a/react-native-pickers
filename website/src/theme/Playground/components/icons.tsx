import type { ReactNode } from 'react';

// Brand marks: Simple Icons (CC0), fetched from Iconify. The rest are drawn on the same 24px grid.
const Icon = ({ children, filled = false }: { children: ReactNode; filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const SANDBOX_ICONS: Record<string, ReactNode> = {
  'Expo Snack': (
    <Icon filled>
      <path d="M0 20.084c.043.53.23 1.063.718 1.778c.58.849 1.576 1.315 2.303.567c.49-.505 5.794-9.776 8.35-13.29a.76.76 0 0 1 1.248 0c2.556 3.514 7.86 12.785 8.35 13.29c.727.748 1.723.282 2.303-.567c.57-.835.728-1.42.728-2.046c0-.426-8.26-15.798-9.092-17.078c-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z" />
    </Icon>
  ),
  StackBlitz: (
    <Icon filled>
      <path d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z" />
    </Icon>
  ),
  CodeSandbox: (
    <Icon filled>
      <path d="M0 24h24V0H0v2.455h21.546v19.09H2.454V0H0Z" />
    </Icon>
  ),
};

export const GitHubIcon = () => (
  <Icon filled>
    <path d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </Icon>
);

export const CopyIcon = () => (
  <Icon>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </Icon>
);

export const CheckIcon = () => (
  <Icon>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const ResetIcon = () => (
  <Icon>
    <path d="M4 12a8 8 0 1 0 2.4-5.7" />
    <path d="M4 4v4.5h4.5" />
  </Icon>
);

export const CodeIcon = () => (
  <Icon>
    <path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5" />
  </Icon>
);
