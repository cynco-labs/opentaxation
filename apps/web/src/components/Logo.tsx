import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showMark?: boolean;
}

export default function Logo({ className, size = 'md', showMark = true }: LogoProps) {
  const sizeConfig = {
    sm: {
      text: 'text-[15px]',
      mark: 'w-5 h-5',
      gap: 'gap-2',
    },
    md: {
      text: 'text-[17px]',
      mark: 'w-6 h-6',
      gap: 'gap-2.5',
    },
    lg: {
      text: 'text-[22px]',
      mark: 'w-7 h-7',
      gap: 'gap-3',
    },
  };

  const config = sizeConfig[size];

  return (
    <motion.a
      href="/"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'inline-flex items-center select-none group',
        config.gap,
        className
      )}
    >
      {/* Mark - Simple "O" with gap representing "open" */}
      {showMark && (
        <div className={cn('relative flex-shrink-0', config.mark)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
            aria-hidden="true"
          >
            {/* Open circle - gap at top right represents "open" */}
            <path
              d="M12 3a9 9 0 1 0 6.36 2.64"
              className="stroke-foreground"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* Wordmark */}
      <span className={cn('font-medium tracking-tight text-foreground', config.text)}>
        opentaxation<span className="text-muted-foreground">.my</span>
      </span>
    </motion.a>
  );
}
