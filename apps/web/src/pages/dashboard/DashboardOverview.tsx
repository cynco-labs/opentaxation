import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  ClockCounterClockwise,
  Plus,
  ArrowRight,
  ChartLineUp,
} from 'phosphor-react';
import { useSavedCalculations } from '@/hooks/useSavedCalculations';
import { formatCurrency } from '@/lib/utils';

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { calculations, isLoading, isConfigured } = useSavedCalculations();

  const recentCalculations = calculations?.slice(0, 3) ?? [];
  const totalCalculations = calculations?.length ?? 0;

  // Calculate some stats from saved calculations
  const averageSavings =
    totalCalculations > 0
      ? calculations!.reduce((sum, calc) => sum + Math.abs(calc.results.taxSavings), 0) /
        totalCalculations
      : 0;

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage your saved calculations and track your tax planning.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card
          className="p-4 sm:p-5 cursor-pointer active:scale-[0.98] sm:hover:border-foreground/20 transition-all"
          onClick={() => navigate('/')}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center">
              <Calculator weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">New Calculation</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Start a fresh comparison</p>
            </div>
            <ArrowRight weight="bold" className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </Card>

        <Card
          className="p-4 sm:p-5 cursor-pointer active:scale-[0.98] sm:hover:border-foreground/20 transition-all"
          onClick={() => navigate('/dashboard/calculations')}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center">
              <ClockCounterClockwise weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">View History</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {totalCalculations} saved calculation{totalCalculations !== 1 ? 's' : ''}
              </p>
            </div>
            <ArrowRight weight="bold" className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center">
              <ChartLineUp weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">Avg. Tax Difference</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {totalCalculations > 0 ? formatCurrency(averageSavings) : 'No data yet'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Supabase not configured warning */}
      {!isConfigured && (
        <Card className="p-4 sm:p-6 border-amber-500/50 bg-amber-500/5">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-amber-600 dark:text-amber-400">
                Database Not Configured
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Add your Supabase credentials to enable saving calculations. Set{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  VITE_SUPABASE_URL
                </code>{' '}
                and{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  VITE_SUPABASE_ANON_KEY
                </code>{' '}
                in your .env.local file.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent calculations */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-semibold text-base sm:text-lg">Recent Calculations</h2>
          {totalCalculations > 3 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/calculations')}>
              View all
              <ArrowRight weight="bold" className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 sm:p-5 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </Card>
            ))}
          </div>
        ) : recentCalculations.length > 0 ? (
          <div className="grid gap-3 sm:gap-4">
            {recentCalculations.map((calc) => (
              <Card
                key={calc.id}
                className="p-4 sm:p-5 cursor-pointer active:scale-[0.99] sm:hover:border-foreground/20 transition-all"
                onClick={() => navigate(`/dashboard/calculations/${calc.id}`)}
              >
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base truncate">{calc.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      Profit: {formatCurrency(calc.inputs.businessProfit)} •{' '}
                      {calc.results.recommendation === 'sole-prop'
                        ? 'Enterprise recommended'
                        : calc.results.recommendation === 'sdn-bhd'
                          ? 'Sdn Bhd recommended'
                          : 'Similar results'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-sm sm:text-base">
                      {formatCurrency(Math.abs(calc.results.taxSavings))}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">potential savings</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 sm:p-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calculator weight="duotone" className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1">No calculations yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Start by running a tax comparison to save your first calculation.
            </p>
            <Button onClick={() => navigate('/')} className="min-h-[44px]">
              <Plus weight="bold" className="h-4 w-4 mr-2" />
              New Calculation
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
