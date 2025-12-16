interface FloatingCalcCardProps {
  children: React.ReactNode;
  className?: string;
  animationDelay?: string;
  accent?: boolean;
}

/**
 * Floating Calculation Card - CSS animation for infinite float effect
 * Used as decorative elements on the landing page
 */
export default function FloatingCalcCard({
  children,
  className,
  animationDelay = '0s',
  accent = false,
}: FloatingCalcCardProps) {
  return (
    <div
      className={`absolute pointer-events-none select-none animate-float ${className}`}
      style={{ animationDelay }}
    >
      <div className={`px-4 py-2.5 rounded-xl shadow-sm ${accent ? 'bg-amber/10 border border-amber/30' : 'bg-card border border-border'}`}>
        <span className={`text-sm font-mono ${accent ? 'text-amber' : 'text-muted-foreground'}`}>{children}</span>
      </div>
    </div>
  );
}
