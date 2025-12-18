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

const smoothEase = [0.25, 0.1, 0.25, 1];

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

// Entity selector pill
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
      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 ${
        isSelected
          ? 'border-transparent text-white shadow-lg'
          : 'border-[#E8DDD0] bg-white/50 hover:bg-white hover:border-[#D4C4B0]'
      }`}
      style={isSelected ? { backgroundColor: config.bgColor } : {}}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
          isSelected ? 'bg-white/20' : 'bg-[#F5EDE3]'
        }`}
      >
        <Icon
          weight={isSelected ? 'fill' : 'duotone'}
          className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-[#4A3728]'}`}
        />
      </div>
      <div className="text-left">
        <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-[#4A3728]'}`}>
          {config.title}
        </p>
        <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-[#8B7B6B]'}`}>
          {config.subtitle}
        </p>
      </div>
    </motion.button>
  );
}

// Deadline card
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
        className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
          isExpanded
            ? 'bg-white border-[#D4C4B0] shadow-sm'
            : 'bg-white/50 border-[#E8DDD0] hover:bg-white hover:border-[#D4C4B0]'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Entity indicator */}
            <div
              className="w-1 h-12 rounded-full flex-shrink-0"
              style={{ backgroundColor: entityColor }}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono text-sm font-semibold px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: `${entityColor}15`, color: entityColor }}
                >
                  {deadline.formCode}
                </span>
                <span className="text-xs text-[#8B7B6B] bg-[#F5EDE3] px-2 py-0.5 rounded-full">
                  {deadline.frequency}
                </span>
                {isUpcoming && (
                  <span className="flex items-center gap-1 text-xs text-[#E5A84B] bg-[#E5A84B]/10 px-2 py-0.5 rounded-full">
                    <Bell weight="fill" className="w-3 h-3" />
                    Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-[#4A3728]">{deadline.description}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-[#4A3728]">{deadline.dueDate}</p>
            <p className="text-xs text-[#8B7B6B]">{deadline.month}</p>
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
              <div className="mt-4 pt-4 border-t border-[#E8DDD0] ml-5">
                <div className="flex items-start gap-2 text-sm text-[#6B5B4F] bg-[#E5A84B]/10 p-3 rounded-xl">
                  <Warning weight="fill" className="h-4 w-4 text-[#E5A84B] flex-shrink-0 mt-0.5" />
                  <span>{deadline.notes}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {deadline.notes && (
          <div className="mt-3 ml-5 flex items-center gap-1 text-xs text-[#8B7B6B]">
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

// Visual month timeline
function MonthTimeline({ deadlines }: { deadlines: TaxDeadline[] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
      {months.map((month, idx) => {
        const monthDeadlines = deadlines.filter((d) => d.monthNumber === idx + 1);
        const hasDeadlines = monthDeadlines.length > 0;
        const isCurrent = idx === currentMonth;
        const isPast = idx < currentMonth;

        return (
          <div
            key={month}
            className={`relative flex flex-col items-center px-2 sm:px-3 py-2 rounded-xl transition-all min-w-[40px] sm:min-w-[52px] ${
              isCurrent
                ? 'bg-[#722F37] text-white'
                : hasDeadlines
                ? 'bg-[#F5EDE3]'
                : ''
            }`}
          >
            <span
              className={`text-xs font-medium ${
                isCurrent
                  ? 'text-white'
                  : isPast
                  ? 'text-[#8B7B6B]/50'
                  : hasDeadlines
                  ? 'text-[#4A3728]'
                  : 'text-[#8B7B6B]/50'
              }`}
            >
              {month}
            </span>
            {hasDeadlines && (
              <div className="flex gap-0.5 mt-1">
                {monthDeadlines.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCurrent ? 'bg-white/60' : 'bg-[#722F37]/40'
                    }`}
                  />
                ))}
                {monthDeadlines.length > 3 && (
                  <span className={`text-[10px] sm:text-[8px] ml-0.5 ${isCurrent ? 'text-white/60' : 'text-[#722F37]/60'}`}>
                    +{monthDeadlines.length - 3}
                  </span>
                )}
              </div>
            )}
            {isPast && hasDeadlines && (
              <CheckCircle
                weight="fill"
                className="absolute -top-1 -right-1 w-4 h-4 text-[#5B8A72] bg-[#FAF7F2] rounded-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// FAQ Item
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
        className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
          isOpen
            ? 'bg-white border-[#D4C4B0]'
            : 'bg-white/30 border-[#E8DDD0] hover:bg-white/60 hover:border-[#D4C4B0]'
        }`}
      >
        <div className="flex items-start gap-4">
          <span
            className="text-xs font-mono px-2 py-1 rounded-lg bg-[#722F37]/10 text-[#722F37]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1">
            <p className="font-medium text-[#4A3728]">{question}</p>
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-[#6B5B4F] mt-3 leading-relaxed overflow-hidden"
                >
                  {answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <CaretDown
            weight="bold"
            className={`h-4 w-4 text-[#8B7B6B] transition-transform flex-shrink-0 ${
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
    <div className="min-h-full bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="text-center space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-[#E8DDD0] rounded-full text-xs font-medium text-[#6B5B4F]">
            <Clock weight="fill" className="h-3.5 w-3.5 text-[#E5A84B]" />
            YA 2024/2025 Deadlines
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] font-normal leading-tight tracking-tight text-[#4A3728]">
            Tax deadlines that won't
            <br />
            <span className="text-[#722F37] italic">sneak up on you</span>
          </h1>

          <p className="text-[#6B5B4F] max-w-md mx-auto text-[15px]">
            Because "I forgot" doesn't work on LHDN. All Malaysian tax filing deadlines in one place.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { value: getAllDeadlinesSorted().length, label: 'Deadlines tracked' },
            { value: '4', label: 'Entity types' },
            { value: '0', label: 'Excuses accepted' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="font-serif text-2xl sm:text-3xl font-normal text-[#4A3728]"
              >
                {stat.value}
              </p>
              <p className="text-xs text-[#8B7B6B]">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Entity Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="font-serif text-lg font-normal text-[#4A3728]"
            >
              I'm filing as...
            </h2>
            {selectedEntity && (
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-sm text-[#722F37] hover:text-[#5A252C] font-medium transition-colors"
              >
                Show all →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
          className="bg-white/60 border border-[#E8DDD0] rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck weight="duotone" className="h-4 w-4 text-[#722F37]" />
            <span className="text-sm font-medium text-[#4A3728]">Year at a glance</span>
          </div>
          <MonthTimeline deadlines={displayedDeadlines} />
        </motion.div>

        {/* Deadlines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="font-serif text-lg font-normal text-[#4A3728]"
            >
              {selectedEntity ? `${entityConfig[selectedEntity].title} deadlines` : 'All deadlines'}
            </h2>
            <span className="text-sm text-[#8B7B6B] bg-[#F5EDE3] px-3 py-1 rounded-full">
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
        <div className="space-y-4">
          <h2
            className="font-serif text-lg font-normal text-[#4A3728]"
          >
            Common questions
          </h2>
          <p className="text-sm text-[#8B7B6B] -mt-2">
            The stuff you're too embarrassed to ask your accountant.
          </p>
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
          className="bg-[#722F37] rounded-3xl p-8 text-center"
        >
          <h3
            className="font-serif text-xl font-normal text-white mb-2"
          >
            Need official information?
          </h3>
          <p className="text-white/70 text-sm mb-6">
            Deadlines accurate as of YA 2024/2025. When in doubt, check with LHDN.
          </p>
          <a
            href="https://www.hasil.gov.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5A84B] text-[#4A3728] font-medium rounded-full hover:bg-[#D9A045] transition-colors"
          >
            Visit LHDN Website
            <CaretRight weight="bold" className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
