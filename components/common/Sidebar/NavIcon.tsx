export function NavIcon({ name, className = "" }: { name: string; className?: string }) {
  const props = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "layout-dashboard":
      return (
        <svg {...props}>
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "activity":
      return (
        <svg {...props}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg {...props}>
          <path d="M11 2v2a5 5 0 0 0 10 0V2" />
          <path d="M16 7v6a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6V4" />
          <circle cx="20" cy="18" r="2" />
          <path d="M20 10v6" />
        </svg>
      );
    case "flask":
      return (
        <svg {...props}>
          <path d="M8.5 2h7" />
          <path d="M10 2v7.31L4.85 18A2 2 0 0 0 6.55 21h10.9a2 2 0 0 0 1.7-3L14 9.31V2" />
          <path d="M6.5 14h11" />
        </svg>
      );
    case "pill":
      return (
        <svg {...props}>
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...props}>
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M9 14h6" />
          <path d="M9 18h6" />
          <path d="M9 10h6" />
        </svg>
      );
    default:
      return null;
  }
}
