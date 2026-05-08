import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Buildings,
  UsersThree,
  Briefcase,
  Clock,
  Warning,
  CaretDown,
  CaretRight,
  CalendarCheck,
  Bell,
  CheckCircle,
} from 'phosphor-react';
import {
  type EntityType,
  type TaxDeadline,
  getDeadlinesByEntity,
  getAllDeadlinesSorted,
} from '@/data/taxDeadlines';

const smoothEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const entityConfig: Record<EntityType, {
  icon: typeof User;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
}> = {
  Individual: {
    icon: User,
    title: 'Individual',
    subtitle: 'Personal income tax',
    color: '#722F37',
    bgColor: '#722F37',
  },
  Company: {
    icon: Buildings,
    title: 'Company',
    subtitle: 'Corporate tax (Sdn Bhd)',
    color: '#5B8A72',
    bgColor: '#5B8A72',
  },
  Employer: {
    icon: UsersThree,
    title: 'Employer',
    subtitle: 'Employee tax forms',
    color: '#C4A484',
    bgColor: '#C4A484',
  },
  Partnership: {
    icon: Briefcase,
    title: 'Partnership',
    subtitle: 'Partnership filing',
    color: '#8B7B6B',
    bgColor: '#8B7B6B',
  },
};

// Entity selector pill - optimized for 2-column mobile layout
function EntityPill({
  entity,
  isSelected,
  onSelect,
  index,
}: {
  entity: EntityType;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const config = entityConfig[entity];
  const Icon = config.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.4, ease: smoothEase }}
      onClick={onSelect}
      className={`group flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border transition-all duration-200 min-h-[60px] sm:min-h-[56px] ${
        isSelected
          ? 'border-transparent text-white shadow-md'
          : 'border-brand-border-ivory bg-white hover:border-brand-border-ivory'
      }`}
      style={isSelected ? { backgroundColor: config.bgColor } : {}}
    >
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
          isSelected ? 'bg-white/20' : 'bg-brand-muted-ivory'
        }`}
      >
        <Icon
          weight={isSelected ? 'fill' : 'duotone'}
          className={`h-4 w-4 sm:h-5 sm:w-5 ${isSelected ? 'text-white' : 'text-brand-espresso'}`}
        />
      </div>
      <div className="text-left flex-1 min-w-0">
        <p className={`text-[13px] sm:text-sm font-medium ${isSelected ? 'text-white' : 'text-brand-espresso'}`}>
          {config.title}
        </p>
        <p className={`text-[11px] sm:text-xs truncate ${isSelected ? 'text-white/70' : 'text-brand-medium-gray'}`}>
          {config.subtitle}
        </p>
      </div>
      {isSelected && (
        <CheckCircle weight="fill" className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 flex-shrink-0" />
      )}
    </motion.button>
  );
}

// Deadline card - mobile optimized
function DeadlineCard({ deadline, index }: { deadline: TaxDeadline; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const entityColor = entityConfig[deadline.entityType]?.color || '#722F37';

  // Check if deadline is upcoming (within 60 days)
  const isUpcoming = deadline.monthNumber === new Date().getMonth() + 1 ||
    deadline.monthNumber === new Date().getMonth() + 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: smoothEase }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-200 min-h-[72px] ${
          isExpanded
            ? 'bg-white border-brand-border-ivory shadow-sm'
            : 'bg-white/50 border-brand-border-ivory hover:bg-white hover:border-brand-border-ivory'
        }`}
      >
        {/* Mobile: Stack layout | Desktop: Row layout */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Entity indicator */}
            <div
              className="w-1 h-10 sm:h-12 rounded-full flex-shrink-0"
              style={{ backgroundColor: entityColor }}
            />
            <div className="space-y-1.5 sm:space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono text-sm font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg"
                  style={{ backgroundColor: `${entityColor}15`, color: entityColor }}
                >
                  {deadline.formCode}
                </span>
                <span className="text-xs text-brand-medium-gray bg-brand-muted-ivory px-2 py-0.5 rounded-full">
                  {deadline.frequency}
                </span>
                {isUpcoming && (
                  <span className="flex items-center gap-1 text-xs text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-full">
                    <Bell weight="fill" className="w-3 h-3" />
                    Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-brand-espresso leading-snug">{deadline.description}</p>
            </div>
          </div>
          {/* Due date - inline on mobile, right-aligned on desktop */}
          <div className="flex items-center justify-between sm:block sm:text-right flex-shrink-0 ml-4 sm:ml-0">
            <p className="font-semibold text-brand-espresso">{deadline.dueDate}</p>
            <p className="text-xs text-brand-medium-gray">{deadline.month}</p>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && deadline.notes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-brand-border-ivory ml-4 sm:ml-5">
                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-brand-amber/10 p-3 rounded-xl">
                  <Warning weight="fill" className="h-4 w-4 text-brand-amber flex-shrink-0 mt-0.5" />
                  <span>{deadline.notes}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {deadline.notes && (
          <div className="mt-2.5 sm:mt-3 ml-4 sm:ml-5 flex items-center gap-1 text-xs text-brand-medium-gray">
            <CaretDown
              weight="bold"
              className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
            <span>{isExpanded ? 'Less' : 'More info'}</span>
          </div>
        )}
      </button>
    </motion.div>
  );
}

// Visual month timeline - mobile optimized with touch-friendly targets
function MonthTimeline({ deadlines }: { deadlines: TaxDeadline[] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return (
    <div className="relative -mx-4 sm:mx-0">
      {/* Fade edges on mobile to indicate scrollability */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none sm:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none sm:hidden" />

      <div className="flex items-center gap-1.5 sm:gap-1 overflow-x-auto pb-2 px-4 sm:px-0 scrollbar-none snap-x snap-mandatory sm:snap-none">
        {months.map((month, idx) => {
          const monthDeadlines = deadlines.filter((d) => d.monthNumber === idx + 1);
          const hasDeadlines = monthDeadlines.length > 0;
          const isCurrent = idx === currentMonth;
          const isPast = idx < currentMonth;

          return (
            <div
              key={month}
              className={`relative flex flex-col items-center px-3 sm:px-3 py-2.5 sm:py-2 rounded-xl transition-all min-w-[48px] sm:min-w-[52px] snap-center ${
                isCurrent
                  ? 'bg-brand-burgundy text-white shadow-sm'
                  : hasDeadlines
                  ? 'bg-brand-muted-ivory'
                  : ''
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  isCurrent
                    ? 'text-white'
                    : isPast
                    ? 'text-brand-medium-gray/50'
                    : hasDeadlines
                    ? 'text-brand-espresso'
                    : 'text-brand-medium-gray/50'
                }`}
              >
                {month}
              </span>
              {hasDeadlines && (
                <div className="flex gap-0.5 mt-1.5 sm:mt-1">
                  {monthDeadlines.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCurrent ? 'bg-white/60' : 'bg-brand-burgundy/40'
                      }`}
                    />
                  ))}
                  {monthDeadlines.length > 3 && (
                    <span className={`text-[10px] ml-0.5 ${isCurrent ? 'text-white/60' : 'text-brand-burgundy/60'}`}>
                      +{monthDeadlines.length - 3}
                    </span>
                  )}
                </div>
              )}
              {isPast && hasDeadlines && (
                <CheckCircle
                  weight="fill"
                  className="absolute -top-1 -right-1 w-4 h-4 text-brand-sage bg-brand-ivory rounded-full"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// FAQ Item - mobile optimized
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.05, duration: 0.3, ease: smoothEase }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-200 min-h-[56px] ${
          isOpen
            ? 'bg-white border-brand-border-ivory'
            : 'bg-white/30 border-brand-border-ivory hover:bg-white/60 hover:border-brand-border-ivory'
        }`}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <span
            className="text-xs font-mono px-2 py-1 rounded-lg bg-brand-burgundy/10 text-brand-burgundy flex-shrink-0"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-brand-espresso text-[15px] sm:text-base leading-snug">{question}</p>
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-muted-foreground mt-2.5 sm:mt-3 leading-relaxed overflow-hidden"
                >
                  {answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <CaretDown
            weight="bold"
            className={`h-4 w-4 text-brand-medium-gray transition-transform flex-shrink-0 mt-0.5 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
    </motion.div>
  );
}

export default function CalendarContent() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType | null>(null);

  const displayedDeadlines = selectedEntity
    ? getDeadlinesByEntity(selectedEntity)
    : getAllDeadlinesSorted();

  const entities: EntityType[] = ['Individual', 'Company', 'Employer', 'Partnership'];

  const faqs = [
    {
      question: 'What happens if I miss a deadline?',
      answer: 'LHDN will send you a love letter (penalty notice) starting from RM200 to RM20,000. Plus interest on unpaid taxes. Not the kind of interest you want.',
    },
    {
      question: 'Which form do I file as a sole proprietor?',
      answer: 'Form B for business income, due by June 30 (manual) or July 15 (e-Filing). Mark your calendar, or better yet, let us remind you.',
    },
    {
      question: 'When does my company need to file?',
      answer: 'Form C is due 7 months after your financial year end. CP204 (estimated tax) is due in monthly installments. Yes, monthly. We know.',
    },
    {
      question: "What's CP58 and do I need it?",
      answer: 'If you paid anyone (contractors, freelancers, etc.) and withheld tax, you need to issue CP58. Due by March 31. Your payees will thank you.',
    },
  ];

  return (
    <div className="min-h-full bg-brand-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-10 pb-24">
        {/* Hero - more compact on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="text-center space-y-4 sm:space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/60 border border-brand-border-ivory rounded-full text-xs font-medium text-muted-foreground">
            <Clock weight="fill" className="h-3.5 w-3.5 text-brand-amber" />
            YA 2024/2025 Deadlines
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-[2.75rem] font-normal leading-tight tracking-tight text-brand-espresso">
            Tax deadlines that won't
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-brand-burgundy italic">sneak up on you</span>
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-[15px] px-2 sm:px-0">
            Because "I forgot" doesn't work on LHDN. All Malaysian tax filing deadlines in one place.
          </p>
        </motion.div>

        {/* Stats - more compact on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center justify-center gap-5 sm:gap-10"
        >
          {[
            { value: getAllDeadlinesSorted().length, label: 'Deadlines' },
            { value: '4', label: 'Entity types' },
            { value: '0', label: 'Excuses' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="font-serif text-xl sm:text-3xl font-normal text-brand-espresso"
              >
                {stat.value}
              </p>
              <p className="text-[11px] sm:text-xs text-brand-medium-gray">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Entity Selector */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="font-serif text-base sm:text-lg font-normal text-brand-espresso"
            >
              I'm filing as...
            </h2>
            {selectedEntity && (
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-sm text-brand-burgundy hover:text-brand-maroon font-medium transition-colors min-h-[44px] flex items-center"
              >
                Show all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {entities.map((entity, index) => (
              <EntityPill
                key={entity}
                entity={entity}
                isSelected={selectedEntity === entity}
                onSelect={() => setSelectedEntity(selectedEntity === entity ? null : entity)}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="bg-white/60 border border-brand-border-ivory rounded-xl sm:rounded-2xl p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3 px-1">
            <CalendarCheck weight="duotone" className="h-4 w-4 text-brand-burgundy" />
            <span className="text-sm font-medium text-brand-espresso">Year at a glance</span>
          </div>
          <MonthTimeline deadlines={displayedDeadlines} />
        </motion.div>

        {/* Deadlines */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="font-serif text-base sm:text-lg font-normal text-brand-espresso"
            >
              {selectedEntity ? `${entityConfig[selectedEntity].title} deadlines` : 'All deadlines'}
            </h2>
            <span className="text-xs sm:text-sm text-brand-medium-gray bg-brand-muted-ivory px-2.5 sm:px-3 py-1 rounded-full">
              {displayedDeadlines.length} {displayedDeadlines.length === 1 ? 'deadline' : 'deadlines'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEntity || 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {displayedDeadlines.map((deadline, index) => (
                <DeadlineCard key={deadline.id} deadline={deadline} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FAQ */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h2
              className="font-serif text-base sm:text-lg font-normal text-brand-espresso"
            >
              Common questions
            </h2>
            <p className="text-xs sm:text-sm text-brand-medium-gray mt-1">
              The stuff you're too embarrassed to ask your accountant.
            </p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} {...faq} index={index} />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-brand-burgundy rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center"
        >
          <h3
            className="font-serif text-lg sm:text-xl font-normal text-white mb-1.5 sm:mb-2"
          >
            Need official information?
          </h3>
          <p className="text-white/70 text-xs sm:text-sm mb-4 sm:mb-6">
            Deadlines accurate as of YA 2024/2025. When in doubt, check with LHDN.
          </p>
          <a
            href="https://www.hasil.gov.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-brand-amber text-brand-espresso font-medium rounded-full hover:bg-brand-amber/90 transition-colors min-h-[48px] text-sm sm:text-base"
          >
            Visit LHDN Website
            <CaretRight weight="bold" className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
