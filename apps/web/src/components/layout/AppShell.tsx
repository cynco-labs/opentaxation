import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { UserMenu } from '@/components/UserMenu';
import ToolNav from './ToolNav';

interface AppShellProps {
  children?: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E8D5C4] bg-[#FAF7F2]/95 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex-shrink-0">
              <Logo size="sm" />
            </NavLink>

            {/* Desktop: Tool tabs in header */}
            <div className="hidden md:block">
              <ToolNav />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {children || <Outlet />}
        </motion.div>
      </main>

      {/* Mobile: Bottom navigation handled by ToolNav */}
      <div className="md:hidden">
        <ToolNav />
      </div>
    </div>
  );
}
