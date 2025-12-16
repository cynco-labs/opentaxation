/**
 * Crossover Visualization - SVG chart showing where Enterprise and Sdn Bhd tax burden crosses
 * Clean, minimal design with subtle accent on crossover point
 */
export default function CrossoverVisualization() {
  return (
    <div className="relative w-full max-w-lg mx-auto h-52 my-8">
      <svg
        viewBox="0 0 400 180"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Grid lines - very subtle */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h-${i}`}
            x1="50"
            y1={30 + i * 30}
            x2="370"
            y2={30 + i * 30}
            className="stroke-border/30"
            strokeWidth="0.5"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`v-${i}`}
            x1={50 + i * 53.3}
            y1="30"
            x2={50 + i * 53.3}
            y2="150"
            className="stroke-border/30"
            strokeWidth="0.5"
          />
        ))}

        {/* Enterprise line - solid */}
        <path
          d="M 50 140 C 120 130, 180 100, 210 90 S 300 60, 370 45"
          className="stroke-foreground"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sdn Bhd line - dashed */}
        <path
          d="M 50 45 C 100 55, 160 75, 210 90 S 300 115, 370 135"
          className="stroke-muted-foreground"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 4"
          fill="none"
        />

        {/* Crossover point - subtle neutral accent */}
        <circle cx="210" cy="90" r="10" className="fill-muted" />
        <circle cx="210" cy="90" r="6" className="fill-background stroke-foreground/40" strokeWidth="1.5" />
        <circle cx="210" cy="90" r="2" className="fill-foreground/60" />

        {/* Labels */}
        <text x="375" y="48" className="fill-foreground text-[10px] font-medium">Enterprise</text>
        <text x="375" y="138" className="fill-muted-foreground text-[10px] font-medium">Sdn Bhd</text>
        <text x="25" y="90" className="fill-muted-foreground/50 text-[9px]" textAnchor="middle" transform="rotate(-90, 25, 90)">Tax Burden</text>
        <text x="210" y="172" className="fill-muted-foreground/50 text-[9px]" textAnchor="middle">Business Profit →</text>
      </svg>

      {/* Crossover label - subtle, muted */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <div className="px-3 py-1.5 rounded-full bg-muted border border-border text-foreground/70 text-xs font-medium">
          Crossover Point
        </div>
      </div>
    </div>
  );
}
