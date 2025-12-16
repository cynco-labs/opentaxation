import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Buildings,
  UsersThree,
  Briefcase,
  CalendarCheck,
  Calendar,
  Clock,
  Warning,
  CaretDown,
  CaretRight,
  Receipt,
  FileText,
  Wallet,
  ChartLineUp,
  Alarm,
  Flag,
} from 'phosphor-react';
import {
  type EntityType,
  type TaxDeadline,
  getDeadlinesByEntity,
  getAllDeadlinesSorted,
} from '@/data/taxDeadlines';

const smoothEase = [0.25, 0.1, 0.25, 1];

const entityIcons: Record<EntityType, typeof User> = {
  Individual: User,
  Company: Buildings,
  Employer: UsersThree,
  Partnership: Briefcase,
};

const entityDescriptions: Record<EntityType, { title: string; subtitle: string; joke: string }> = {
  Individual: {
    title: 'Individual',
    subtitle: 'Personal income tax',
    joke: 'Yes, you have to file too',
  },
  Company: {
    title: 'Company',
    subtitle: 'Corporate tax (Sdn Bhd)',
    joke: 'The price of being official',
  },
  Employer: {
    title: 'Employer',
    subtitle: 'Employee tax forms',
    joke: 'HR\'s favorite season',
  },
  Partnership: {
    title: 'Partnership',
    subtitle: 'Partnership filing',
    joke: 'Sharing the burden',
  },
};

// Phosphor-style background
function PhosphorBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Topographic contour lines */}
      <svg
        className="absolute w-full h-full opacity-[0.3]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M-100 400 Q 200 350, 400 380 T 800 360 T 1300 400" className="stroke-border" strokeWidth="1" fill="none" />
        <path d="M-100 450 Q 250 400, 500 420 T 900 400 T 1300 450" className="stroke-border" strokeWidth="1" fill="none" />
        <path d="M-100 500 Q 300 450, 550 470 T 950 450 T 1300 500" className="stroke-border" strokeWidth="1" fill="none" />
        <path d="M-100 300 Q 150 280, 350 300 T 700 280 T 1300 320" className="stroke-border" strokeWidth="1" fill="none" />
        <path d="M-100 200 Q 180 170, 380 190 T 750 170 T 1300 210" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="1000" cy="120" rx="80" ry="40" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="1000" cy="120" rx="40" ry="20" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="100" cy="700" rx="60" ry="30" className="stroke-border" strokeWidth="1" fill="none" />
      </svg>

      {/* Floating icons */}
      <div className="absolute top-[10%] left-[5%] flex flex-col items-center gap-1 opacity-30">
        <Calendar weight="light" className="h-6 w-6 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">calendar</span>
      </div>

      <div className="absolute top-[25%] right-[8%] flex flex-col items-center gap-1 opacity-30">
        <Receipt weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">receipt</span>
      </div>

      <div className="absolute top-[60%] left-[3%] flex flex-col items-center gap-1 opacity-30">
        <FileText weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">file-text</span>
      </div>

      <div className="absolute top-[45%] right-[4%] flex flex-col items-center gap-1 opacity-30">
        <Alarm weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">alarm</span>
      </div>

      <div className="absolute bottom-[25%] right-[15%] flex flex-col items-center gap-1 opacity-30">
        <Flag weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">flag</span>
      </div>

      <div className="absolute bottom-[15%] left-[12%] flex flex-col items-center gap-1 opacity-30">
        <Wallet weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">wallet</span>
      </div>
    </div>
  );
}

// Entity selector card
function EntityCard({
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
  const Icon = entityIcons[entity];
  const info = entityDescriptions[entity];

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.4, ease: smoothEase }}
      onClick={onSelect}
      className={`group p-5 rounded-xl border text-left transition-all duration-200 ${
        isSelected
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card hover:border-foreground/30 hover:bg-muted/30'
      }`}
    >
      <div className="space-y-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            isSelected ? 'bg-background/20' : 'bg-muted/50'
          }`}
        >
          <Icon
            weight={isSelected ? 'fill' : 'duotone'}
            className={`h-5 w-5 ${isSelected ? 'text-background' : 'text-foreground'}`}
          />
        </div>
        <div>
          <p className={`font-semibold ${isSelected ? 'text-background' : 'text-foreground'}`}>
            {info.title}
          </p>
          <p className={`text-sm ${isSelected ? 'text-background/70' : 'text-muted-foreground'}`}>
            {info.subtitle}
          </p>
          <p className={`text-xs mt-1 ${isSelected ? 'text-background/50' : 'text-muted-foreground/70'}`}>
            {info.joke}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

// Deadline card
function DeadlineCard({ deadline, index }: { deadline: TaxDeadline; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: smoothEase }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
          isExpanded
            ? 'bg-card border-foreground/20 shadow-sm'
            : 'bg-card/50 border-border hover:border-foreground/20 hover:bg-card'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold px-2.5 py-1 bg-muted rounded-md">
                {deadline.formCode}
              </span>
              <span className="text-xs text-muted-foreground">{deadline.frequency}</span>
            </div>
            <p className="text-sm text-foreground">{deadline.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-foreground">{deadline.dueDate}</p>
            <p className="text-xs text-muted-foreground">{deadline.month}</p>
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
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Warning weight="fill" className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{deadline.notes}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {deadline.notes && (
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
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

// Month timeline
function MonthTimeline({ deadlines }: { deadlines: TaxDeadline[] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
      {months.map((month, idx) => {
        const hasDeadlines = deadlines.some((d) => d.monthNumber === idx + 1);
        const isCurrent = idx === currentMonth;

        return (
          <div
            key={month}
            className={`flex flex-col items-center px-2 py-2 rounded-lg transition-colors ${
              isCurrent ? 'bg-foreground text-background' : hasDeadlines ? 'bg-muted/50' : ''
            }`}
          >
            <span className={`text-xs font-medium ${!isCurrent && !hasDeadlines ? 'text-muted-foreground/50' : ''}`}>
              {month}
            </span>
            {hasDeadlines && !isCurrent && (
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1" />
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
        className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
          isOpen ? 'bg-card border-foreground/20' : 'bg-transparent border-border hover:bg-card/50'
        }`}
      >
        <div className="flex items-start gap-4">
          <span className="text-xs font-mono text-muted-foreground mt-1">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1">
            <p className="font-medium text-foreground">{question}</p>
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-muted-foreground mt-3 leading-relaxed overflow-hidden"
                >
                  {answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <CaretDown
            weight="bold"
            className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${
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
    <div className="h-full overflow-y-auto overscroll-contain relative bg-background">
      <PhosphorBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-safe">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-full text-xs font-medium text-muted-foreground">
            <Clock weight="fill" className="h-3.5 w-3.5" />
            YA 2024/2025 Deadlines
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Tax deadlines that won't<br />
            <span className="text-muted-foreground">sneak up on you</span>
          </h1>

          <p className="text-muted-foreground max-w-lg mx-auto">
            Because "I forgot" doesn't work on LHDN. All Malaysian tax filing deadlines in one place.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center justify-center gap-8 text-center"
        >
          <div>
            <p className="text-2xl font-bold">{getAllDeadlinesSorted().length}</p>
            <p className="text-xs text-muted-foreground">Deadlines tracked</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Entity types</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Excuses accepted</p>
          </div>
        </motion.div>

        {/* Entity Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">I'm filing as...</h2>
            {selectedEntity && (
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Show all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {entities.map((entity, index) => (
              <EntityCard
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
          className="bg-card border border-border rounded-xl p-4"
        >
          <MonthTimeline deadlines={displayedDeadlines} />
        </motion.div>

        {/* Deadlines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {selectedEntity ? `${entityDescriptions[selectedEntity].title} deadlines` : 'All deadlines'}
            </h2>
            <span className="text-sm text-muted-foreground">
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
          <h2 className="font-semibold">Common questions</h2>
          <p className="text-sm text-muted-foreground -mt-2">
            The stuff you're too embarrassed to ask your accountant.
          </p>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} {...faq} index={index} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center pt-6 pb-8 space-y-4"
        >
          <a
            href="https://www.hasil.gov.my"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Official LHDN website
            <CaretRight weight="bold" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <p className="text-xs text-muted-foreground/70">
            Deadlines accurate as of YA 2024/2025. When in doubt, check with LHDN. We're just here to help you not panic.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
