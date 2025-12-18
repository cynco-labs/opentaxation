import { useMemo } from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { motion } from 'framer-motion';
import { ClockCounterClockwise, Gear, House, CalendarCheck, Article, Icon } from 'phosphor-react';
import Logo from '@/components/Logo';

interface NavItem {
  to: string;
  icon: Icon;
  label: string;
  end: boolean;
  adminOnly?: boolean;
}

const allNavItems: NavItem[] = [
  { to: '/dashboard', icon: House, label: 'Overview', end: true },
  { to: '/dashboard/calendar', icon: CalendarCheck, label: 'Tax Calendar', end: false },
  { to: '/dashboard/calculations', icon: ClockCounterClockwise, label: 'Saved Calculations', end: false },
  { to: '/dashboard/blog', icon: Article, label: 'Blog', end: false, adminOnly: true },
  { to: '/dashboard/settings', icon: Gear, label: 'Settings', end: false },
];

export default function DashboardLayout() {
  const { user, isLoading, isBlogAdmin } = useAuth();

  // Filter nav items based on admin status
  const navItems = useMemo(() =>
    allNavItems.filter(item => !item.adminOnly || isBlogAdmin),
    [isBlogAdmin]
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="animate-pulse text-[#6B5B4F]">Loading dashboard...</div>
      </div>
    );
  }

  // Redirect to home if not signed in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-[#E8D5C4] bg-[#FAF7F2]/95 backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6">
              {/* Left: Logo + Dashboard badge */}
              <div className="flex items-center gap-3">
                <NavLink to="/" className="flex-shrink-0">
                  <Logo size="sm" />
                </NavLink>
                <div className="hidden sm:block h-5 w-px bg-[#E8D5C4]" />
                <span className="hidden sm:block text-sm text-[#6B5B4F]">Dashboard</span>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <UserMenu />
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-[#E8D5C4] min-h-[calc(100vh-4rem)] bg-[#FAF7F2]">
              <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Dashboard navigation">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-[#722F37]/10 text-[#722F37] border border-[#722F37]/20'
                          : 'text-[#6B5B4F] hover:text-[#4A3728] hover:bg-[#F5EDE3]'
                      }`
                    }
                  >
                    <Icon weight="duotone" className="h-5 w-5" />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </aside>

            {/* Mobile nav */}
            <nav
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8D5C4] bg-[#FAF7F2]/95 backdrop-blur-xl p-2 pb-safe"
              role="navigation"
              aria-label="Dashboard navigation"
            >
              <div className="flex justify-around">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors min-h-[52px] ${
                        isActive
                          ? 'text-[#722F37]'
                          : 'text-[#6B5B4F]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon weight={isActive ? 'fill' : 'duotone'} className="h-5 w-5" />
                        <span>{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </div>
  );
}
