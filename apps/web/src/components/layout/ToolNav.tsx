/* eslint-disable react-refresh/only-export-components */
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  CalendarCheck,
  Receipt,
  CaretDown,
  House,
  type Icon,
} from 'phosphor-react';
import { cn } from '@/lib/utils';

export interface ToolDefinition {
  id: string;
  path: string;
  label: string;
  shortLabel?: string;
  icon: Icon;
  description?: string;
  isNew?: boolean;
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    shortLabel: 'Home',
    icon: House,
    description: 'Dashboard overview',
  },
  {
    id: 'calculator',
    path: '/calculator',
    label: 'Tax Calculator',
    shortLabel: 'Calculator',
    icon: Calculator,
    description: 'Compare Enterprise vs Sdn Bhd',
  },
  {
    id: 'calendar',
    path: '/calendar',
    label: 'Tax Calendar',
    shortLabel: 'Calendar',
    icon: CalendarCheck,
    description: 'Important tax deadlines',
  },
  {
    id: 'e-invoicing',
    path: '/e-invoicing',
    label: 'E-Invoicing',
    shortLabel: 'E-Invoice',
    icon: Receipt,
    description: 'MyInvois compliance guide',
    isNew: true,
  },
];

interface ToolNavProps {
  className?: string;
}

export default function ToolNav({ className }: ToolNavProps) {
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // On desktop, show all tools. On mobile, show first 4 with overflow
  const visibleTools = TOOLS.slice(0, 4);
  const overflowTools = TOOLS.slice(4);

  const isToolActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={cn('relative', className)}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1">
        {TOOLS.map((tool) => (
          <NavLink
            key={tool.id}
            to={tool.path}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                isActive || isToolActive(tool.path)
                  ? 'text-brand-dark-brown'
                  : 'text-brand-warm-gray hover:text-brand-dark-brown hover:bg-brand-border-ivory/30'
              )
            }
          >
            {({ isActive }) => (
              <>
                <tool.icon
                  weight={isActive || isToolActive(tool.path) ? 'fill' : 'duotone'}
                  className={cn(
                    'h-4 w-4',
                    isActive || isToolActive(tool.path) ? 'text-brand-burgundy' : ''
                  )}
                />
                <span>{tool.label}</span>
                {tool.isNew && (
                  <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-brand-burgundy text-white rounded-full">
                    NEW
                  </span>
                )}
                {(isActive || isToolActive(tool.path)) && (
                  <motion.div
                    layoutId="tool-indicator"
                    className="absolute inset-0 bg-brand-border-ivory/40 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-brand-border-ivory bg-brand-ivory/95 backdrop-blur-xl pb-safe">
        <div className="flex justify-around px-2 py-2">
          {visibleTools.map((tool) => (
            <NavLink
              key={tool.id}
              to={tool.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors min-w-[64px] min-h-[52px]',
                  isActive || isToolActive(tool.path)
                    ? 'text-brand-burgundy'
                    : 'text-brand-warm-gray'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <tool.icon
                    weight={isActive || isToolActive(tool.path) ? 'fill' : 'duotone'}
                    className="h-5 w-5"
                  />
                  <span className="truncate">{tool.shortLabel || tool.label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* More menu for overflow tools */}
          {overflowTools.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors min-w-[64px] min-h-[52px]',
                  moreMenuOpen ? 'text-brand-burgundy' : 'text-brand-warm-gray'
                )}
              >
                <CaretDown
                  weight="bold"
                  className={cn('h-5 w-5 transition-transform', moreMenuOpen && 'rotate-180')}
                />
                <span>More</span>
              </button>

              {moreMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMoreMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full right-0 mb-2 w-48 bg-card border border-brand-border-ivory rounded-2xl shadow-lg z-50 overflow-hidden"
                  >
                    {overflowTools.map((tool) => (
                      <NavLink
                        key={tool.id}
                        to={tool.path}
                        onClick={() => setMoreMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                            isActive
                              ? 'bg-brand-border-ivory/40 text-brand-dark-brown'
                              : 'text-brand-warm-gray hover:bg-brand-border-ivory/20 hover:text-brand-dark-brown'
                          )
                        }
                      >
                        <tool.icon weight="duotone" className="h-5 w-5" />
                        <span>{tool.label}</span>
                      </NavLink>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
