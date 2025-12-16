/**
 * Topographic Background - Subtle decorative contour lines
 * Creates atmospheric depth without distracting from content
 */
export default function TopographicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full h-full opacity-[0.15]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Flowing contour lines */}
        <path
          d="M-100 350 Q 200 300, 400 330 T 800 310 T 1300 360"
          className="stroke-foreground/40"
          strokeWidth="0.75"
          fill="none"
        />
        <path
          d="M-100 400 Q 250 350, 500 380 T 900 360 T 1300 410"
          className="stroke-foreground/30"
          strokeWidth="0.75"
          fill="none"
        />
        <path
          d="M-100 450 Q 300 400, 550 430 T 950 400 T 1300 460"
          className="stroke-foreground/25"
          strokeWidth="0.75"
          fill="none"
        />
        <path
          d="M-100 500 Q 200 470, 450 490 T 850 470 T 1300 510"
          className="stroke-foreground/20"
          strokeWidth="0.75"
          fill="none"
        />
        <path
          d="M-100 280 Q 150 260, 350 280 T 700 260 T 1300 300"
          className="stroke-foreground/20"
          strokeWidth="0.75"
          fill="none"
        />
        <path
          d="M-100 220 Q 180 190, 380 210 T 750 190 T 1300 240"
          className="stroke-foreground/15"
          strokeWidth="0.75"
          fill="none"
        />

        {/* Subtle elevation contours - upper right */}
        <ellipse cx="950" cy="180" rx="100" ry="50" className="stroke-foreground/15" strokeWidth="0.5" fill="none" />
        <ellipse cx="950" cy="180" rx="60" ry="30" className="stroke-foreground/10" strokeWidth="0.5" fill="none" />

        {/* Subtle elevation contours - lower left */}
        <ellipse cx="150" cy="620" rx="80" ry="40" className="stroke-foreground/15" strokeWidth="0.5" fill="none" />
        <ellipse cx="150" cy="620" rx="45" ry="22" className="stroke-foreground/10" strokeWidth="0.5" fill="none" />
      </svg>
    </div>
  );
}
