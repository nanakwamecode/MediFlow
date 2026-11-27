import { useId } from "react";
import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "lg";
  className?: string;
}

export default function BrandLogo({ size = "sm", className }: Props) {
  const uid = useId().replace(/:/g, "");
  const bgId = `mf-bg-${uid}`;
  const glossId = `mf-gloss-${uid}`;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-[#f05a49] via-[#c8392b] to-[#8f1d14]",
        "ring-1 ring-white/25 shadow-md shadow-accent/25",
        size === "lg" ? "h-16 w-16 rounded-2xl shadow-lg" : "h-9 w-9 rounded-xl",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f25c4b" />
            <stop offset="55%" stopColor="#c8392b" />
            <stop offset="100%" stopColor="#8f1d14" />
          </linearGradient>
          <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="40" height="40" fill={`url(#${bgId})`} />
        <path d="M0 0 H40 V19 Q20 24 0 19 Z" fill={`url(#${glossId})`} />

        {/* Subtle clinical halo ring */}
        <circle
          cx="20"
          cy="20"
          r="15"
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />

        {/* Crisp medical cross crown */}
        <rect x="18.7" y="9.4" width="2.6" height="6.8" rx="1.2" fill="#ffffff" />
        <rect x="16.6" y="11.5" width="6.8" height="2.6" rx="1.2" fill="#ffffff" />

        {/* Smooth flowing "M" ribbon cradling the cross */}
        <path
          d="M9.5 28.7 V21.2 C9.5 17.7, 14.8 17.7, 16.8 21.7 L20 27.7 L23.2 21.7 C25.2 17.7, 30.5 17.7, 30.5 21.2 V28.7"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
