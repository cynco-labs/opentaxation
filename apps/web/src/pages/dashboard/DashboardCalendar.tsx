import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  Export,
  User,
  Buildings,
  UsersThree,
  Briefcase,
  Info,
  Bell,
  CheckCircle,
} from 'phosphor-react';
import {
  type EntityType,
  type TaxDeadline,
  taxDeadlines,
  entityTypeInfo,
} from '@/data/taxDeadlines';

// Icons for entity types
const entityIcons: Record<EntityType, typeof User> = {
  Individual: User,
  Company: Buildings,
  Employer: UsersThree,
  Partnership: Briefcase,
};

// Entity colors - Open Ledger design system
const entityColors: Record<EntityType, { bg: string; text: string; border: string }> = {
  Individual: { bg: 'bg-[#722F37]/10', text: 'text-[#722F37]', border: 'border-[#722F37]/20' },
  Company: { bg: 'bg-[#5B8A72]/10', text: 'text-[#5B8A72]', border: 'border-[#5B8A72]/20' },
  Employer: { bg: 'bg-[#E5A84B]/10', text: 'text-[#E5A84B]', border: 'border-[#E5A84B]/20' },
  Partnership: { bg: 'bg-[#8B7B6B]/10', text: 'text-[#8B7B6B]', border: 'border-[#8B7B6B]/20' },
};

const entityDotColors: Record<EntityType, string> = {
  Individual: 'bg-[#722F37]',
  Company: 'bg-[#5B8A72]',
  Employer: 'bg-[#E5A84B]',
  Partnership: 'bg-[#8B7B6B]',
};

// Months data
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Get deadlines for a specific month
function getDeadlinesForMonth(month: number, entityFilter: EntityType | null): TaxDeadline[] {
  return taxDeadlines.filter(d => {
    const matchesMonth = d.monthNumber === month;
    const matchesEntity = !entityFilter || d.entityType === entityFilter;
    return matchesMonth && matchesEntity;
  });
}

// Parse deadline date to get days until
function getDaysUntil(deadline: TaxDeadline): number | null {
  const dueDateStr = deadline.dueDate;
  const monthMatch = dueDateStr.match(/(\d+)\s+(\w+)/);

  if (!monthMatch) return null;

  const day = parseInt(monthMatch[1]);
  const monthName = monthMatch[2];
  const months: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };

  const month = months[monthName];
  if (month === undefined) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  let deadlineDate = new Date(currentYear, month, day);

  if (deadlineDate < now) {
    deadlineDate = new Date(currentYear + 1, month, day);
  }

  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get next upcoming deadlines
function getUpcomingDeadlines(count: number = 3): (TaxDeadline & { daysUntil: number })[] {
  const withDays = taxDeadlines
    .map(d => ({ ...d, daysUntil: getDaysUntil(d) }))
    .filter(d => d.daysUntil !== null && d.daysUntil >= 0) as (TaxDeadline & { daysUntil: number })[];

  return withDays.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, count);
}

// Generate ICS file
function generateICSContent(deadlines: TaxDeadline[]): string {
  const now = new Date();
  const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//OpenTaxation.my//Tax Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Malaysian Tax Deadlines
`;

  deadlines.forEach((deadline) => {
    const dueDateStr = deadline.dueDate;
    const monthMatch = dueDateStr.match(/(\d+)\s+(\w+)/);
    if (!monthMatch) return;

    const day = parseInt(monthMatch[1]);
    const monthName = monthMatch[2];
    const months: Record<string, number> = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
    };

    const month = months[monthName];
    if (month === undefined) return;

    const currentYear = now.getFullYear();
    let deadlineDate = new Date(currentYear, month, day);
    if (deadlineDate < now) {
      deadlineDate = new Date(currentYear + 1, month, day);
    }

    const uid = `${deadline.id}-${deadlineDate.getFullYear()}@opentaxation.my`;

    icsContent += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatDate(now)}
DTSTART;VALUE=DATE:${deadlineDate.toISOString().split('T')[0].replace(/-/g, '')}
DTEND;VALUE=DATE:${deadlineDate.toISOString().split('T')[0].replace(/-/g, '')}
SUMMARY:${deadline.formCode} - Tax Filing Deadline
DESCRIPTION:${deadline.description}${deadline.notes ? '\\n\\nNote: ' + deadline.notes : ''}
CATEGORIES:TAX,LHDN
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:Tax deadline in 7 days: ${deadline.formCode}
END:VALARM
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Tax deadline TOMORROW: ${deadline.formCode}
END:VALARM
END:VEVENT
`;
  });

  icsContent += 'END:VCALENDAR';
  return icsContent;
}

function downloadICS(deadlines: TaxDeadline[]) {
  const icsContent = generateICSContent(deadlines);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'malaysian-tax-deadlines.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function DashboardCalendar() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const currentMonth = new Date().getMonth() + 1;

  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(3), []);

  // Count deadlines per month for the selected filter
  const deadlinesPerMonth = useMemo(() => {
    return MONTHS.map((_, idx) => getDeadlinesForMonth(idx + 1, selectedEntity));
  }, [selectedEntity]);

  // Total deadlines
  const totalFiltered = useMemo(() => {
    if (!selectedEntity) return taxDeadlines.length;
    return taxDeadlines.filter(d => d.entityType === selectedEntity).length;
  }, [selectedEntity]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#722F37]/5 via-[#FAF7F2] to-[#722F37]/10 border border-[#E8D5C4] p-6 sm:p-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#722F37]/10">
                  <CalendarCheck weight="duotone" className="h-6 w-6 text-[#722F37]" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#4A3728]">Tax Calendar</h1>
                  <p className="text-sm text-[#6B5B4F]">Malaysian tax filing deadlines at a glance</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => downloadICS(selectedEntity ? taxDeadlines.filter(d => d.entityType === selectedEntity) : taxDeadlines)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8D5C4] bg-white text-sm font-medium text-[#4A3728] hover:bg-[#F5EDE3] transition-colors"
            >
              <Export weight="bold" className="h-4 w-4" />
              Export All
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-[#E8D5C4]/30">
              <p className="text-2xl sm:text-3xl font-bold text-[#4A3728]">{totalFiltered}</p>
              <p className="text-xs sm:text-sm text-[#6B5B4F]">Total Deadlines</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-[#E8D5C4]/30">
              <p className="text-2xl sm:text-3xl font-bold text-[#E5A84B]">
                {upcomingDeadlines.length > 0 ? upcomingDeadlines[0].daysUntil : '—'}
              </p>
              <p className="text-xs sm:text-sm text-[#6B5B4F]">Days to Next</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-[#E8D5C4]/30">
              <p className="text-2xl sm:text-3xl font-bold text-[#4A3728]">{Object.keys(entityTypeInfo).length}</p>
              <p className="text-xs sm:text-sm text-[#6B5B4F]">Entity Types</p>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#722F37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock weight="duotone" className="h-5 w-5 text-[#6B5B4F]" />
            <h2 className="font-semibold text-[#4A3728]">Coming Up Next</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {upcomingDeadlines.map((deadline, idx) => {
              const Icon = entityIcons[deadline.entityType];
              const colors = entityColors[deadline.entityType];
              const isUrgent = deadline.daysUntil <= 30;
              return (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`h-full p-4 rounded-xl border bg-white ${isUrgent ? 'border-[#E5A84B]/30' : 'border-[#E8D5C4]'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                      <Icon weight="duotone" className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-[#4A3728]">{deadline.formCode}</span>
                        {isUrgent && (
                          <span className="text-[11px] text-[#E5A84B] border border-[#E5A84B]/30 px-1.5 py-0.5 rounded-full">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B5B4F] mt-1 line-clamp-1">
                        {deadline.description}
                      </p>
                      <p className="text-sm font-medium text-[#4A3728] mt-2">
                        {deadline.daysUntil === 0 ? 'Today!' : `${deadline.daysUntil} days`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Entity Filter */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[#4A3728] flex items-center gap-2">
          <span>Filter by Type</span>
          {selectedEntity && (
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-xs text-[#6B5B4F] hover:text-[#4A3728]"
            >
              (Clear)
            </button>
          )}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {(Object.keys(entityTypeInfo) as EntityType[]).map((entity) => {
            const Icon = entityIcons[entity];
            const isSelected = selectedEntity === entity;
            const info = entityTypeInfo[entity];
            const count = taxDeadlines.filter(d => d.entityType === entity).length;
            const colors = entityColors[entity];

            return (
              <button
                key={entity}
                onClick={() => setSelectedEntity(isSelected ? null : entity)}
                className={`relative p-3 sm:p-4 rounded-xl border text-left transition-all min-h-[60px] ${
                  isSelected
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : 'bg-white border-[#E8D5C4] hover:border-[#D4B8A0]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-current/10' : 'bg-[#F5EDE3]'}`}>
                    <Icon weight={isSelected ? 'fill' : 'duotone'} className={`h-4 w-4 ${isSelected ? '' : 'text-[#4A3728]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${isSelected ? '' : 'text-[#4A3728]'}`}>{info.label}</p>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'opacity-70' : 'text-[#6B5B4F]'}`}>{count} deadlines</p>
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="entity-check"
                    className="absolute top-2 right-2"
                  >
                    <CheckCircle weight="fill" className="h-4 w-4" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Year Timeline */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[#4A3728]">Year at a Glance</h2>
        <div className="p-4 sm:p-6 rounded-xl border border-[#E8D5C4] bg-white">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3">
            {MONTHS.map((month, idx) => {
              const monthNum = idx + 1;
              const deadlines = deadlinesPerMonth[idx];
              const hasDeadlines = deadlines.length > 0;
              const isCurrentMonth = monthNum === currentMonth;
              const isExpanded = expandedMonth === monthNum;

              return (
                <motion.button
                  key={month}
                  onClick={() => setExpandedMonth(isExpanded ? null : monthNum)}
                  className={`relative p-2 sm:p-3 rounded-xl text-center transition-all ${
                    isExpanded
                      ? 'bg-[#722F37] text-white ring-2 ring-[#722F37] ring-offset-2 ring-offset-white'
                      : isCurrentMonth
                      ? 'bg-[#722F37]/10 border border-[#722F37]/30'
                      : hasDeadlines
                      ? 'bg-[#F5EDE3] hover:bg-[#E8DDD0]'
                      : 'bg-[#F5EDE3]/50 hover:bg-[#F5EDE3]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className={`text-xs font-medium ${isExpanded ? 'text-white' : isCurrentMonth ? 'text-[#722F37]' : 'text-[#4A3728]'}`}>
                    {month}
                  </p>
                  {hasDeadlines && (
                    <div className="flex justify-center gap-0.5 mt-1.5">
                      {deadlines.slice(0, 3).map((d, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isExpanded ? 'bg-white' : entityDotColors[d.entityType]
                          }`}
                        />
                      ))}
                      {deadlines.length > 3 && (
                        <span className={`text-[10px] ml-0.5 ${isExpanded ? 'text-white' : 'text-[#6B5B4F]'}`}>
                          +{deadlines.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Expanded Month Details */}
          <AnimatePresence>
            {expandedMonth && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-[#E8D5C4]">
                  <h3 className="font-medium text-sm text-[#4A3728] mb-3">
                    {FULL_MONTHS[expandedMonth - 1]} Deadlines
                  </h3>
                  {deadlinesPerMonth[expandedMonth - 1].length > 0 ? (
                    <div className="space-y-2">
                      {deadlinesPerMonth[expandedMonth - 1].map((deadline) => {
                        const Icon = entityIcons[deadline.entityType];
                        const colors = entityColors[deadline.entityType];
                        return (
                          <div
                            key={deadline.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-[#F5EDE3]/50"
                          >
                            <div className={`p-1.5 rounded-lg ${colors.bg} ${colors.text}`}>
                              <Icon weight="duotone" className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-sm font-semibold text-[#4A3728]">{deadline.formCode}</span>
                                <span className="text-[11px] px-1.5 py-0.5 rounded-full border border-[#E8D5C4] text-[#6B5B4F]">{deadline.entityType}</span>
                                <span className="text-xs text-[#6B5B4F]">{deadline.dueDate}</span>
                              </div>
                              <p className="text-sm text-[#6B5B4F] mt-1">{deadline.description}</p>
                              {deadline.notes && (
                                <p className="text-xs text-[#8B7B6B] mt-1 flex items-start gap-1">
                                  <Info weight="fill" className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                  {deadline.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-[#6B5B4F] text-center py-4">
                      No deadlines in {FULL_MONTHS[expandedMonth - 1]}
                      {selectedEntity ? ` for ${selectedEntity}` : ''}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* All Deadlines List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#4A3728]">All Deadlines</h2>
          <button
            onClick={() => downloadICS(selectedEntity ? taxDeadlines.filter(d => d.entityType === selectedEntity) : taxDeadlines)}
            className="sm:hidden text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#6B5B4F] hover:text-[#4A3728] hover:bg-[#F5EDE3] transition-colors"
          >
            <Export weight="bold" className="h-4 w-4" />
            Export
          </button>
        </div>
        <div className="space-y-2">
          {(selectedEntity ? taxDeadlines.filter(d => d.entityType === selectedEntity) : taxDeadlines)
            .sort((a, b) => a.monthNumber - b.monthNumber)
            .map((deadline, idx) => {
              const Icon = entityIcons[deadline.entityType];
              const colors = entityColors[deadline.entityType];
              return (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group p-3 sm:p-4 rounded-xl border border-[#E8D5C4] bg-white hover:border-[#D4B8A0] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${colors.bg} ${colors.text}`}>
                      <Icon weight="duotone" className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm font-semibold text-[#4A3728]">{deadline.formCode}</span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded-full border border-[#E8D5C4] text-[#6B5B4F]">{deadline.entityType}</span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#F5EDE3] text-[#6B5B4F]">{deadline.frequency}</span>
                          </div>
                          <p className="text-sm text-[#6B5B4F] mt-1">{deadline.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium text-[#4A3728]">{deadline.dueDate}</p>
                        </div>
                      </div>
                      {deadline.notes && (
                        <p className="text-xs text-[#8B7B6B] mt-2 flex items-start gap-1.5 pt-2 border-t border-[#E8D5C4]/30">
                          <Info weight="fill" className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                          {deadline.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 sm:p-5 rounded-xl border border-dashed border-[#E8D5C4] bg-[#F5EDE3]/30">
        <div className="flex items-start gap-3">
          <Bell weight="duotone" className="h-5 w-5 text-[#6B5B4F] flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-sm text-[#6B5B4F]">
            <p className="font-medium text-[#4A3728]">Never miss a deadline</p>
            <p>
              Export these deadlines to your calendar app (Google Calendar, Apple Calendar, Outlook)
              to receive automatic reminders 7 days and 1 day before each due date.
            </p>
            <p className="text-xs text-[#8B7B6B]">
              Deadlines based on LHDN guidelines. Some may vary based on your specific circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
