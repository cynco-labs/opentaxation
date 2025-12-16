import {
  User,
  Buildings,
  Coins,
  Receipt,
  Wallet,
  ChartLineUp,
} from 'phosphor-react';

/**
 * Topographic Map Background - Phosphor-inspired decorative element
 * Used on the landing page hero section
 */
export default function TopographicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full h-full opacity-[0.35]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Topographic contour lines */}
        <path
          d="M-100 400 Q 200 350, 400 380 T 800 360 T 1300 400"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 450 Q 250 400, 500 420 T 900 400 T 1300 450"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 500 Q 300 450, 550 470 T 950 450 T 1300 500"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 550 Q 200 520, 450 540 T 850 520 T 1300 560"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 300 Q 150 280, 350 300 T 700 280 T 1300 320"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />

        {/* Closed contour - like a hill/peak */}
        <ellipse cx="900" cy="200" rx="120" ry="60" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="900" cy="200" rx="80" ry="40" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="900" cy="200" rx="40" ry="20" className="stroke-border" strokeWidth="1" fill="none" />

        {/* Another contour cluster */}
        <ellipse cx="200" cy="600" rx="100" ry="50" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="200" cy="600" rx="60" ry="30" className="stroke-border" strokeWidth="1" fill="none" />
      </svg>

      {/* Scattered tax-themed icons with labels */}
      <div className="absolute top-[15%] left-[5%] flex flex-col items-center gap-1 opacity-40">
        <Receipt weight="light" className="h-6 w-6 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">receipt-light</span>
      </div>

      <div className="absolute top-[60%] left-[8%] flex flex-col items-center gap-1 opacity-40">
        <Wallet weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">wallet-light</span>
      </div>

      <div className="absolute top-[25%] right-[5%] flex flex-col items-center gap-1 opacity-40">
        <Buildings weight="light" className="h-6 w-6 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">buildings-light</span>
      </div>

      <div className="absolute top-[70%] right-[10%] flex flex-col items-center gap-1 opacity-40">
        <ChartLineUp weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">chart-line-up</span>
      </div>

      <div className="absolute bottom-[15%] left-[25%] flex flex-col items-center gap-1 opacity-40">
        <Coins weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">coins-light</span>
      </div>

      <div className="absolute top-[45%] right-[3%] flex flex-col items-center gap-1 opacity-40">
        <User weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">user-light</span>
      </div>

      {/* Place names - finance themed */}
      <span
        className="absolute top-[12%] right-[15%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        Profit Peak
      </span>
      <span
        className="absolute bottom-[25%] left-[15%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        Tax Valley
      </span>
      <span
        className="absolute top-[50%] left-[3%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        Deduction Bay
      </span>
      <span
        className="absolute bottom-[35%] right-[5%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        Crossover Point
      </span>
      <span
        className="absolute top-[35%] left-[12%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        EPF Heights
      </span>
    </div>
  );
}
