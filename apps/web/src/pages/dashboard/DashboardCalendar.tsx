import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRinging,
  Export,
  GoogleLogo,
  CaretDown,
  CaretUp,
  Warning,
  Info,
  User,
  Buildings,
  UsersThree,
  Briefcase,
  CalendarCheck,
} from 'phosphor-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  type EntityType,
  type TaxDeadline,
  taxDeadlines,
  entityTypeInfo,
} from '@/data/taxDeadlines';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Icons for entity types
const entityIcons: Record<EntityType, typeof User> = {
  Individual: User,
  Company: Buildings,
  Employer: UsersThree,
  Partnership: Briefcase,
};

// Helper to calculate days until a deadline
function getDaysUntilDeadline(deadline: TaxDeadline): number | null {
  // Parse dates like "30 April", "31 March", etc.
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

  // Create deadline date for this year
  let deadlineDate = new Date(currentYear, month, day);

  // If deadline has passed this year, use next year
  if (deadlineDate < now) {
    deadlineDate = new Date(currentYear + 1, month, day);
  }

  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

// Get urgency status
function getUrgencyStatus(days: number | null): 'overdue' | 'urgent' | 'soon' | 'normal' {
  if (days === null) return 'normal';
  if (days < 0) return 'overdue';
  if (days <= 7) return 'urgent';
  if (days <= 30) return 'soon';
  return 'normal';
}

// Format deadline date for next occurrence
function getNextDeadlineDate(deadline: TaxDeadline): string {
  const dueDateStr = deadline.dueDate;
  const monthMatch = dueDateStr.match(/(\d+)\s+(\w+)/);

  if (!monthMatch) return dueDateStr;

  const day = parseInt(monthMatch[1]);
  const monthName = monthMatch[2];
  const months: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };

  const month = months[monthName];
  if (month === undefined) return dueDateStr;

  const now = new Date();
  const currentYear = now.getFullYear();
  let deadlineDate = new Date(currentYear, month, day);

  if (deadlineDate < now) {
    deadlineDate = new Date(currentYear + 1, month, day);
  }

  return deadlineDate.toLocaleDateString('en-MY', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Generate ICS file content
function generateICSContent(deadlines: TaxDeadline[]): string {
  const now = new Date();
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

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

    // Create reminder 7 days before
    const reminderDate = new Date(deadlineDate);
    reminderDate.setDate(reminderDate.getDate() - 7);

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

// Download ICS file
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

// Generate Google Calendar URL
function getGoogleCalendarUrl(deadline: TaxDeadline): string {
  const dueDateStr = deadline.dueDate;
  const monthMatch = dueDateStr.match(/(\d+)\s+(\w+)/);

  if (!monthMatch) return '#';

  const day = parseInt(monthMatch[1]);
  const monthName = monthMatch[2];
  const months: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };

  const month = months[monthName];
  if (month === undefined) return '#';

  const now = new Date();
  const currentYear = now.getFullYear();
  let deadlineDate = new Date(currentYear, month, day);

  if (deadlineDate < now) {
    deadlineDate = new Date(currentYear + 1, month, day);
  }

  const dateStr = deadlineDate.toISOString().split('T')[0].replace(/-/g, '');
  const title = encodeURIComponent(`${deadline.formCode} - Tax Filing Deadline`);
  const details = encodeURIComponent(`${deadline.description}${deadline.notes ? '\n\nNote: ' + deadline.notes : ''}\n\nSource: opentaxation.my`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}`;
}

interface DeadlineCardProps {
  deadline: TaxDeadline;
  isReminderEnabled: boolean;
  onToggleReminder: (id: string) => void;
}

function DeadlineCard({ deadline, isReminderEnabled, onToggleReminder }: DeadlineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const daysUntil = getDaysUntilDeadline(deadline);
  const urgency = getUrgencyStatus(daysUntil);
  const nextDate = getNextDeadlineDate(deadline);
  const Icon = entityIcons[deadline.entityType];

  const urgencyColors = {
    overdue: 'bg-destructive/10 border-destructive/30 text-destructive',
    urgent: 'bg-amber/10 border-amber/30 text-amber-600 dark:text-amber-400',
    soon: 'bg-primary/10 border-primary/30 text-primary',
    normal: 'bg-muted/50 border-border text-muted-foreground',
  };

  const countdownColors = {
    overdue: 'text-destructive',
    urgent: 'text-amber-600 dark:text-amber-400',
    soon: 'text-primary',
    normal: 'text-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card className={`transition-all duration-200 ${urgency === 'urgent' || urgency === 'overdue' ? 'border-l-4 border-l-amber' : ''}`}>
        <CardContent className="p-3 sm:p-4 md:p-5">
          <div className="flex items-start gap-2.5 sm:gap-4">
            {/* Entity Icon */}
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${urgencyColors[urgency]}`}>
              <Icon weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-mono text-xs sm:text-sm font-semibold bg-foreground/5 px-1.5 sm:px-2 py-0.5 rounded">
                      {deadline.formCode}
                    </span>
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {deadline.entityType}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs hidden sm:inline-flex">
                      {deadline.frequency}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {deadline.description}
                  </p>
                </div>

                {/* Countdown */}
                <div className="text-right flex-shrink-0">
                  {daysUntil !== null ? (
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className={`text-lg sm:text-2xl font-bold font-numbers ${countdownColors[urgency]}`}>
                        {daysUntil < 0 ? 'Overdue' : daysUntil === 0 ? 'Today!' : `${daysUntil}d`}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        {nextDate}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                      {deadline.dueDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-border/50 space-y-3 sm:space-y-4">
                      {deadline.notes && (
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Info weight="fill" className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                          <span>{deadline.notes}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`reminder-${deadline.id}`}
                            checked={isReminderEnabled}
                            onCheckedChange={() => onToggleReminder(deadline.id)}
                          />
                          <Label htmlFor={`reminder-${deadline.id}`} className="text-xs sm:text-sm cursor-pointer">
                            {isReminderEnabled ? (
                              <span className="flex items-center gap-1.5 text-foreground">
                                <BellRinging weight="fill" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                Reminder on
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Bell weight="regular" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                Set reminder
                              </span>
                            )}
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={getGoogleCalendarUrl(deadline)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg bg-muted active:bg-muted/70 sm:hover:bg-muted/80 transition-colors min-h-[36px]"
                          >
                            <GoogleLogo weight="bold" className="h-3.5 w-3.5" />
                            Add to Google
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expand button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                  }
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Show less options' : 'Show more options'}
                className="mt-2 sm:mt-3 flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[32px] sm:min-h-[36px]"
              >
                {isExpanded ? (
                  <>
                    <CaretUp weight="bold" className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Less
                  </>
                ) : (
                  <>
                    <CaretDown weight="bold" className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    More options
                  </>
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardCalendar() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType | null>(null);
  const [enabledReminders, setEnabledReminders] = useLocalStorage<string[]>('tax-reminders', []);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);

  // Filter and sort deadlines
  const filteredDeadlines = useMemo(() => {
    let deadlines = [...taxDeadlines];

    // Filter by entity type
    if (selectedEntity) {
      deadlines = deadlines.filter(d => d.entityType === selectedEntity);
    }

    // Add days until for sorting
    const withDays = deadlines.map(d => ({
      ...d,
      daysUntil: getDaysUntilDeadline(d),
    }));

    // Filter upcoming only (within 90 days)
    if (showUpcomingOnly) {
      return withDays
        .filter(d => d.daysUntil !== null && d.daysUntil >= 0 && d.daysUntil <= 90)
        .sort((a, b) => (a.daysUntil ?? 999) - (b.daysUntil ?? 999));
    }

    // Sort by days until
    return withDays.sort((a, b) => (a.daysUntil ?? 999) - (b.daysUntil ?? 999));
  }, [selectedEntity, showUpcomingOnly]);

  // Upcoming urgent count
  const urgentCount = filteredDeadlines.filter(d => {
    const urgency = getUrgencyStatus(d.daysUntil);
    return urgency === 'urgent' || urgency === 'overdue';
  }).length;

  const toggleReminder = (id: string) => {
    setEnabledReminders(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const exportDeadlines = showUpcomingOnly
    ? filteredDeadlines
    : taxDeadlines.filter(d => !selectedEntity || d.entityType === selectedEntity);

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarCheck weight="duotone" className="h-5 w-5 sm:h-7 sm:w-7" />
          Tax Calendar
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track Malaysian tax deadlines and never miss a filing date
        </p>
      </div>

      {/* Urgent Alert */}
      {urgentCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <Warning weight="fill" className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm sm:text-base text-amber-700 dark:text-amber-400">
                  {urgentCount} deadline{urgentCount > 1 ? 's' : ''} due within 7 days
                </p>
                <p className="text-xs sm:text-sm text-amber-600/80 dark:text-amber-400/80">
                  Make sure to file on time to avoid penalties
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Entity Filter */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedEntity(null)}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[36px] sm:min-h-[40px] ${
              selectedEntity === null
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground active:bg-muted/80'
            }`}
          >
            All
          </button>
          {(Object.keys(entityTypeInfo) as EntityType[]).map((entity) => {
            const Icon = entityIcons[entity];
            return (
              <button
                key={entity}
                onClick={() => setSelectedEntity(entity)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[36px] sm:min-h-[40px] ${
                  selectedEntity === entity
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground active:bg-muted/80'
                }`}
              >
                <Icon weight={selectedEntity === entity ? 'fill' : 'regular'} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{entity}</span>
              </button>
            );
          })}
        </div>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadICS(exportDeadlines)}
          className="flex items-center gap-2 min-h-[40px] sm:min-h-[36px] w-full sm:w-auto justify-center"
        >
          <Export weight="bold" className="h-4 w-4" />
          Export to Calendar
        </Button>
      </div>

      {/* Toggle upcoming only */}
      <div className="flex items-center gap-2">
        <Switch
          id="upcoming-only"
          checked={showUpcomingOnly}
          onCheckedChange={setShowUpcomingOnly}
        />
        <Label htmlFor="upcoming-only" className="text-xs sm:text-sm cursor-pointer">
          Show upcoming only (next 90 days)
        </Label>
      </div>

      {/* Deadlines List */}
      <div className="space-y-2.5 sm:space-y-3">
        {filteredDeadlines.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-6 sm:p-8 text-center">
              <CalendarCheck weight="duotone" className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                {showUpcomingOnly
                  ? 'No upcoming deadlines in the next 90 days'
                  : 'No deadlines found for the selected filter'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDeadlines.map((deadline) => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              isReminderEnabled={enabledReminders.includes(deadline.id)}
              onToggleReminder={toggleReminder}
            />
          ))
        )}
      </div>

      {/* Info Footer */}
      <Card className="bg-muted/30">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Info weight="fill" className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
              <p>
                Deadlines are based on LHDN (Lembaga Hasil Dalam Negeri Malaysia) guidelines.
                Some deadlines may vary based on your specific business circumstances.
              </p>
              <p>
                <strong>Tip:</strong> Export to your calendar app to get automatic reminders 7 days and 1 day before each deadline.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
