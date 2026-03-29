import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calculator,
  CalendarCheck,
  Receipt,
  ArrowRight,
  House,
  Rocket,
  Sliders,
  Money,
  Scales,
  Buildings,
  Percent,
  ChartLine,
  Users,
  ShieldCheck,
  CloudArrowUp,
  Share,
  Warning,
  BookOpen,
  Coins,
  Bank,
  FileText,
  CheckCircle,
  Info,
  MagnifyingGlass,
  Sparkle,
  Command,
} from 'phosphor-react';
import Logo from '@/components/Logo';

// Documentation structure
const DOC_SECTIONS = [
  {
    category: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview', icon: House },
      { id: 'quick-start', label: 'Quick Start', icon: Rocket },
    ],
  },
  {
    category: 'Calculator',
    items: [
      { id: 'input-modes', label: 'Input Modes', icon: Sliders },
      { id: 'sdn-bhd-settings', label: 'Sdn Bhd Settings', icon: Buildings },
      { id: 'dividends', label: 'Dividends & Surcharge', icon: Money },
      { id: 'audit-exemption', label: 'Audit Exemption', icon: ShieldCheck },
    ],
  },
  {
    category: 'Tax Reliefs',
    items: [
      { id: 'relief-categories', label: 'Relief Categories', icon: BookOpen },
      { id: 'relief-caps', label: 'Caps & Limits', icon: Scales },
      { id: 'quick-setup', label: 'Quick Setup', icon: Rocket },
    ],
  },
  {
    category: 'Tax Concepts',
    items: [
      { id: 'personal-tax', label: 'Personal Tax Brackets', icon: Percent },
      { id: 'corporate-tax', label: 'Corporate Tax (SME)', icon: Buildings },
      { id: 'epf-socso', label: 'EPF & SOCSO', icon: Bank },
      { id: 'zakat', label: 'Zakat Treatment', icon: Coins },
    ],
  },
  {
    category: 'Tools',
    items: [
      { id: 'tax-calendar', label: 'Tax Calendar', icon: CalendarCheck },
      { id: 'e-invoicing', label: 'E-Invoicing', icon: Receipt },
    ],
  },
  {
    category: 'Features',
    items: [
      { id: 'results', label: 'Understanding Results', icon: ChartLine },
      { id: 'saving', label: 'Saving Calculations', icon: CloudArrowUp },
      { id: 'sharing', label: 'Sharing & Export', icon: Share },
      { id: 'limitations', label: 'Limitations', icon: Warning },
    ],
  },
];

const ALL_SECTIONS = DOC_SECTIONS.flatMap(cat => cat.items);

// Styled components for Open Ledger aesthetic
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-espresso mb-4 tracking-tight">
      {children}
    </h2>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-brand-espresso/70 leading-relaxed mb-6">{children}</p>;
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-brand-espresso">{children}</span>;
}

function InfoBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="my-6 p-5 rounded-2xl bg-brand-muted-ivory border border-brand-border-ivory">
      {title && <p className="font-medium text-brand-espresso text-sm mb-2">{title}</p>}
      <div className="text-sm text-brand-espresso/75">{children}</div>
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 p-5 rounded-2xl bg-brand-muted-rose/30 border border-brand-border-ivory">
      <div className="text-sm text-brand-espresso/75">{children}</div>
    </div>
  );
}

function FeatureCard({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <div className="p-4 rounded-2xl border border-brand-border-ivory bg-white hover:bg-brand-muted-ivory transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-rose/10 flex items-center justify-center flex-shrink-0">
          <Icon weight="duotone" className="h-4 w-4 text-brand-rose" />
        </div>
        <div>
          <p className="font-medium text-brand-espresso text-sm">{title}</p>
          <p className="text-xs text-brand-espresso/70 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  );
}

function TaxTable({ data }: { data: { range: string; rate: string; notes?: string }[] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-brand-border-ivory">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-muted-ivory">
            <th className="text-left py-3 px-4 font-medium text-brand-espresso">Income Range</th>
            <th className="text-left py-3 px-4 font-medium text-brand-espresso">Rate</th>
            <th className="text-left py-3 px-4 font-medium text-brand-espresso">Notes</th>
          </tr>
        </thead>
        <tbody className="text-brand-espresso/75">
          {data.map((row, i) => (
            <tr key={i} className="border-t border-brand-border-ivory/80">
              <td className="py-3 px-4 font-mono text-xs">{row.range}</td>
              <td className="py-3 px-4 font-medium text-brand-rose">{row.rate}</td>
              <td className="py-3 px-4 text-xs">{row.notes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepList({ steps }: { steps: { title: string; desc: string }[] }) {
  return (
    <div className="my-6 space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-[#722F37] flex items-center justify-center flex-shrink-0 text-sm font-medium text-white">
            {i + 1}
          </div>
          <div className="pt-1">
            <p className="font-medium text-[#4A2C2A]">{step.title}</p>
            <p className="text-sm text-[#6B5B5B] mt-0.5">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinkCard({ to, title, description, icon: Icon }: { to: string; title: string; description: string; icon: React.ElementType }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 p-5 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9] hover:bg-[#FDF5F0] hover:border-[#D4B8A0] transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-[#722F37]/10 flex items-center justify-center flex-shrink-0">
        <Icon weight="duotone" className="h-6 w-6 text-[#722F37]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#4A2C2A]">{title}</p>
        <p className="text-sm text-[#6B5B5B] mt-0.5">{description}</p>
      </div>
      <ArrowRight weight="bold" className="h-5 w-5 text-[#722F37]/40 group-hover:text-[#722F37] group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    ALL_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K focuses the search input
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const currentCategory = DOC_SECTIONS.find(cat =>
    cat.items.some(item => item.id === activeSection)
  );

  const matchingSections = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return ALL_SECTIONS.filter((item) =>
      item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchTerm]);

  const handleSelectSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-ivory/95 backdrop-blur-xl border-b border-brand-border-ivory">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>
            <span className="hidden sm:block text-sm font-medium text-brand-burgundy">Docs</span>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-lg mx-4 sm:mx-8 relative">
            <div className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full border border-brand-border-ivory bg-white/70 hover:bg-white hover:border-brand-rose/40 transition-all text-left shadow-soft">
              <MagnifyingGlass weight="regular" className="h-4 w-4 text-brand-espresso/70" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
                    // Explicitly select all text in the input
                    e.preventDefault();
                    searchInputRef.current?.select();
                    return;
                  }
                  if (e.key === 'Enter' && matchingSections[0]) {
                    handleSelectSection(matchingSections[0].id);
                  }
                }}
                ref={searchInputRef}
                placeholder="Search documentation..."
                className="flex-1 bg-transparent outline-none text-sm text-brand-espresso placeholder:text-brand-espresso/50"
                aria-label="Search documentation"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-muted-ivory text-[11px] font-mono text-brand-espresso/70 border border-brand-border-ivory">
                <Command weight="bold" className="h-2.5 w-2.5" />K
              </kbd>
            </div>
            {matchingSections.length > 0 && (
              <div className="absolute top-[110%] left-0 right-0 rounded-2xl border border-brand-border-ivory bg-white shadow-card z-40 overflow-hidden">
                <ul className="divide-y divide-brand-border-ivory/60">
                  {matchingSections.map(({ id, label }) => (
                    <li key={id}>
                      <button
                        onClick={() => handleSelectSection(id)}
                        className="w-full text-left px-4 py-3 hover:bg-brand-muted-ivory transition-colors text-sm text-brand-espresso flex items-center justify-between"
                      >
                        <span>{label}</span>
                        <span className="text-[11px] text-brand-espresso/60 uppercase tracking-wider">{id}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="group flex items-center gap-2 px-4 py-2 rounded-full border border-brand-border-ivory bg-white/70 hover:bg-white hover:border-brand-rose/40 transition-all">
              <Sparkle weight="duotone" className="h-4 w-4 text-brand-gold" />
              <span className="text-sm font-medium text-brand-espresso">Ask AI</span>
              <span className="text-[11px] text-brand-espresso/70 bg-brand-muted-ivory px-2 py-0.5 rounded-full border border-brand-border-ivory">Soon</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-brand-border-ivory">
          <nav className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 px-5">
            {DOC_SECTIONS.map((section) => (
              <div key={section.category} className="mb-8">
                <p className="text-[11px] font-semibold text-brand-espresso/70 uppercase tracking-wider mb-3 px-3">
                  {section.category}
                </p>
                <ul className="space-y-1">
                  {section.items.map(({ id, label, icon: Icon }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                          activeSection === id
                            ? 'bg-brand-maroon text-brand-on-maroon font-medium'
                            : 'text-brand-espresso/70 hover:text-brand-espresso hover:bg-brand-muted-ivory'
                        }`}
                      >
                        <Icon weight={activeSection === id ? 'fill' : 'regular'} className="h-4 w-4" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex">
            {/* Content Area */}
            <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
              {/* Mobile back */}
              <div className="lg:hidden mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-brand-espresso/70 hover:text-brand-espresso transition-colors"
                >
                  <ArrowLeft weight="bold" className="h-4 w-4" />
                  Back
                </Link>
              </div>

              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2"
              >
                <p className="text-sm font-medium text-brand-rose">{currentCategory?.category || 'Getting Started'}</p>
              </motion.div>

              <div className="max-w-2xl">
                {/* Overview */}
                <Section id="overview">
                  <SectionTitle>Overview</SectionTitle>
                  <SectionDesc>
                    OpenTaxation is a <Highlight>free, open-source Malaysian tax comparison calculator</Highlight> that helps business owners decide between two legal structures: Enterprise (Sole Proprietorship) and Sdn Bhd (Private Limited Company).
                  </SectionDesc>

                  <div className="grid sm:grid-cols-2 gap-4 my-8">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-brand-muted-ivory border border-brand-border-ivory">
                      <p className="font-serif font-semibold text-brand-espresso mb-2">Enterprise</p>
                      <p className="text-sm text-brand-espresso/75">
                        Business profit flows directly to you. Pay personal income tax (0-30%) on the total. Minimal compliance, unlimited liability.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-rose/10 to-brand-muted-rose/60 border border-brand-border-ivory">
                      <p className="font-serif font-semibold text-brand-espresso mb-2">Sdn Bhd</p>
                      <p className="text-sm text-brand-espresso/75">
                        Company pays corporate tax (15-24%). You receive salary + dividends, each taxed separately. Limited liability, mandatory EPF.
                      </p>
                    </div>
                  </div>

                  <InfoBox title="No signup required">
                    All calculations happen in your browser. Your data never leaves your device unless you choose to save it to the cloud.
                  </InfoBox>
                </Section>

                {/* Quick Start */}
                <Section id="quick-start">
                  <SectionTitle>Quick Start</SectionTitle>
                  <SectionDesc>
                    Get your first tax comparison in under 60 seconds.
                  </SectionDesc>

                  <StepList
                    steps={[
                      { title: 'Enter your annual business profit', desc: 'This is your expected revenue minus expenses before tax.' },
                      { title: 'Set your monthly salary (Sdn Bhd)', desc: 'How much would you pay yourself as director? This affects EPF and personal tax.' },
                      { title: 'Add your tax reliefs', desc: 'Use Quick Setup or manually enter reliefs like EPF, insurance, medical.' },
                      { title: 'Compare the results', desc: 'See which structure gives you more take-home cash and why.' },
                    ]}
                  />

                  <div className="mt-8">
                    <LinkCard
                      to="/calculator"
                      title="Open Calculator"
                      description="Start comparing Enterprise vs Sdn Bhd"
                      icon={Calculator}
                    />
                  </div>
                </Section>

                {/* Input Modes */}
                <Section id="input-modes">
                  <SectionTitle>Input Modes</SectionTitle>
                  <SectionDesc>
                    The calculator supports two ways to enter your income.
                  </SectionDesc>

                  <div className="space-y-4 my-6">
                    <div className="p-5 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#722F37]/10 flex items-center justify-center">
                          <Coins weight="duotone" className="h-4 w-4 text-[#722F37]" />
                        </div>
                        <p className="font-medium text-[#4A2C2A]">Profit Mode (Default)</p>
                      </div>
                      <p className="text-sm text-[#6B5B5B] ml-11">
                        Enter your expected annual business profit. The calculator shows how much you keep after tax in each structure.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#E5A84B]/10 flex items-center justify-center">
                          <ChartLine weight="duotone" className="h-4 w-4 text-[#E5A84B]" />
                        </div>
                        <p className="font-medium text-[#4A2C2A]">Target Mode (Reverse)</p>
                      </div>
                      <p className="text-sm text-[#6B5B5B] ml-11">
                        Enter your desired monthly take-home income. The calculator reverse-calculates the business profit needed to achieve it.
                      </p>
                    </div>
                  </div>
                </Section>

                {/* Sdn Bhd Settings */}
                <Section id="sdn-bhd-settings">
                  <SectionTitle>Sdn Bhd Settings</SectionTitle>
                  <SectionDesc>
                    Configure company-specific settings that affect your Sdn Bhd calculation.
                  </SectionDesc>

                  <div className="space-y-6 my-6">
                    <div>
                      <p className="font-medium text-[#4A2C2A] mb-2">Monthly Salary</p>
                      <p className="text-sm text-[#6B5B5B]">
                        Your director's salary draw. This triggers <Highlight>mandatory EPF contributions</Highlight> (13% employer + 11% employee for salary ≤RM5,000/month).
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-[#4A2C2A] mb-2">Compliance Costs</p>
                      <p className="text-sm text-[#6B5B5B]">
                        Annual costs for company secretary, accounting, SSM fees. Typical range: RM5,000 - RM15,000/year.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-[#4A2C2A] mb-2">Foreign Ownership</p>
                      <p className="text-sm text-[#6B5B5B]">
                        If your company has ≥20% foreign ownership, it <Highlight>does not qualify for SME tax rates</Highlight>. All profit is taxed at 24%.
                      </p>
                    </div>
                  </div>

                  <WarningBox>
                    <strong>Salary Affordability:</strong> The calculator warns you if your proposed salary exceeds what the company can afford.
                  </WarningBox>
                </Section>

                {/* Dividends */}
                <Section id="dividends">
                  <SectionTitle>Dividends & Surcharge</SectionTitle>
                  <SectionDesc>
                    Control how post-tax company profits are distributed to you.
                  </SectionDesc>

                  <div className="my-6 p-5 rounded-2xl bg-[#722F37]/5 border border-[#722F37]/20">
                    <p className="font-medium text-[#4A2C2A] mb-2">YA 2025 Dividend Surcharge</p>
                    <p className="text-sm text-[#6B5B5B]">
                      Starting YA 2025, individuals receiving dividends exceeding <Highlight>RM100,000/year</Highlight> pay an additional <Highlight>2% surcharge</Highlight> on the excess amount.
                    </p>
                  </div>

                  <InfoBox title="Example">
                    If you receive RM150,000 in dividends, the surcharge is: (RM150,000 - RM100,000) × 2% = RM1,000 additional tax.
                  </InfoBox>
                </Section>

                {/* Audit Exemption */}
                <Section id="audit-exemption">
                  <SectionTitle>Audit Exemption</SectionTitle>
                  <SectionDesc>
                    Private companies may be exempt from statutory audit if they meet <Highlight>all three criteria</Highlight>:
                  </SectionDesc>

                  <div className="my-6 grid sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Revenue', value: '≤ RM100,000' },
                      { label: 'Total Assets', value: '≤ RM300,000' },
                      { label: 'Employees', value: '≤ 5 people' },
                    ].map((item) => (
                      <div key={item.label} className="p-5 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9] text-center">
                        <p className="text-xs text-[#6B5B5B] mb-1">{item.label}</p>
                        <p className="font-serif font-semibold text-[#722F37]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Relief Categories */}
                <Section id="relief-categories">
                  <SectionTitle>Relief Categories</SectionTitle>
                  <SectionDesc>
                    Tax reliefs reduce your taxable income. Malaysia offers <Highlight>30+ personal reliefs</Highlight> across these categories:
                  </SectionDesc>

                  <div className="my-6 grid sm:grid-cols-2 gap-3">
                    {[
                      { title: 'Individual', items: 'Basic (RM9k auto-applied), Disabled self (RM6k)', icon: Users },
                      { title: 'Family', items: 'Spouse (RM4k), Children (RM2-8k each)', icon: Users },
                      { title: 'Medical', items: 'Insurance (RM3k), Expenses (RM8k)', icon: FileText },
                      { title: 'Education', items: 'Self (RM7k), Children (RM8k)', icon: BookOpen },
                      { title: 'Insurance & EPF', items: 'Life + EPF (RM7k combined)', icon: ShieldCheck },
                      { title: 'Lifestyle', items: 'Books, electronics (RM2.5k), Sports (RM1k)', icon: Sliders },
                    ].map((cat) => (
                      <FeatureCard key={cat.title} title={cat.title} description={cat.items} icon={cat.icon} />
                    ))}
                  </div>
                </Section>

                {/* Relief Caps */}
                <Section id="relief-caps">
                  <SectionTitle>Caps & Limits</SectionTitle>
                  <SectionDesc>
                    Some reliefs have individual caps, while others share a combined cap.
                  </SectionDesc>

                  <div className="my-6 rounded-2xl border border-[#E8D5C4] overflow-hidden">
                    {[
                      { group: 'Lifestyle General', cap: 'RM2,500', items: 'Books, Electronics, Internet' },
                      { group: 'Sports & Recreation', cap: 'RM1,000', items: 'Gym, equipment, activities' },
                      { group: 'EPF & Life Insurance', cap: 'RM7,000', items: 'EPF + life insurance combined' },
                      { group: 'PRS & Annuity', cap: 'RM3,000', items: 'Private retirement schemes' },
                    ].map((item, i) => (
                      <div key={item.group} className={`flex items-center justify-between p-4 ${i !== 0 ? 'border-t border-[#E8D5C4]' : ''} bg-[#FFFCF9] hover:bg-[#FDF5F0] transition-colors`}>
                        <div>
                          <p className="font-medium text-[#4A2C2A] text-sm">{item.group}</p>
                          <p className="text-xs text-[#6B5B5B]">{item.items}</p>
                        </div>
                        <p className="font-mono text-sm font-medium text-[#722F37]">{item.cap}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Quick Setup */}
                <Section id="quick-setup">
                  <SectionTitle>Quick Setup</SectionTitle>
                  <SectionDesc>
                    Don't know which reliefs apply? Quick Setup asks simple questions to pre-fill common reliefs.
                  </SectionDesc>

                  <div className="my-6 p-6 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                    <p className="font-medium text-[#4A2C2A] mb-4">Questions asked:</p>
                    <ul className="space-y-3">
                      {[
                        'Are you married with spouse having no income?',
                        'Do you have children?',
                        'Do you pay for medical insurance?',
                        'Do you contribute to EPF voluntarily?',
                        'Did you pay for parents\' medical expenses?',
                      ].map((q, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#6B5B5B]">
                          <CheckCircle weight="fill" className="h-5 w-5 text-[#722F37] mt-0.5 flex-shrink-0" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Section>

                {/* Personal Tax */}
                <Section id="personal-tax">
                  <SectionTitle>Personal Tax Brackets</SectionTitle>
                  <SectionDesc>
                    Malaysia uses <Highlight>progressive tax brackets</Highlight> for personal income (YA 2024/2025).
                  </SectionDesc>

                  <TaxTable
                    data={[
                      { range: 'RM0 – RM5,000', rate: '0%', notes: 'Tax-free' },
                      { range: 'RM5,001 – RM20,000', rate: '1%' },
                      { range: 'RM20,001 – RM35,000', rate: '3%' },
                      { range: 'RM35,001 – RM50,000', rate: '6%' },
                      { range: 'RM50,001 – RM70,000', rate: '11%' },
                      { range: 'RM70,001 – RM100,000', rate: '19%' },
                      { range: 'RM100,001 – RM250,000', rate: '25%' },
                      { range: 'RM250,001 – RM400,000', rate: '26%' },
                      { range: 'RM400,001 – RM600,000', rate: '28%' },
                      { range: 'RM600,001+', rate: '30%', notes: 'Maximum' },
                    ]}
                  />
                </Section>

                {/* Corporate Tax */}
                <Section id="corporate-tax">
                  <SectionTitle>Corporate Tax (SME)</SectionTitle>
                  <SectionDesc>
                    Resident companies with revenue under RM50M and no ≥20% foreign ownership qualify for SME rates.
                  </SectionDesc>

                  <TaxTable
                    data={[
                      { range: 'RM0 – RM150,000', rate: '15%', notes: 'SME rate' },
                      { range: 'RM150,001 – RM600,000', rate: '17%', notes: 'SME rate' },
                      { range: 'RM600,001+', rate: '24%', notes: 'Standard' },
                    ]}
                  />

                  <WarningBox>
                    <strong>Non-SME companies</strong> (foreign ownership ≥20% or revenue ≥RM50M) pay <strong>24% flat rate</strong> on all profit.
                  </WarningBox>
                </Section>

                {/* EPF & SOCSO */}
                <Section id="epf-socso">
                  <SectionTitle>EPF & SOCSO</SectionTitle>
                  <SectionDesc>
                    When you pay yourself a salary through Sdn Bhd, EPF and SOCSO contributions are mandatory.
                  </SectionDesc>

                  <div className="my-6 space-y-6">
                    <div>
                      <p className="font-medium text-[#4A2C2A] mb-3">EPF (Employees Provident Fund)</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                          <p className="text-xs text-[#6B5B5B] mb-1">Employer</p>
                          <p className="font-semibold text-[#4A2C2A]">13% <span className="font-normal text-[#6B5B5B] text-sm">(≤RM5k/month)</span></p>
                          <p className="font-semibold text-[#4A2C2A]">12% <span className="font-normal text-[#6B5B5B] text-sm">(&gt;RM5k/month)</span></p>
                        </div>
                        <div className="p-4 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                          <p className="text-xs text-[#6B5B5B] mb-1">Employee</p>
                          <p className="font-semibold text-[#4A2C2A]">11% <span className="font-normal text-[#6B5B5B] text-sm">(deducted from salary)</span></p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-[#4A2C2A] mb-3">SOCSO (Social Security)</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                          <p className="text-xs text-[#6B5B5B] mb-1">Employer</p>
                          <p className="font-semibold text-[#4A2C2A]">~1.75%</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                          <p className="text-xs text-[#6B5B5B] mb-1">Employee</p>
                          <p className="font-semibold text-[#4A2C2A]">~0.5%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>

                {/* Zakat */}
                <Section id="zakat">
                  <SectionTitle>Zakat Treatment</SectionTitle>
                  <SectionDesc>
                    Zakat is treated differently depending on your business structure.
                  </SectionDesc>

                  <div className="my-6 grid sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FDF5F0] to-[#F5E6D8] border border-[#E8D5C4]">
                      <p className="font-serif font-semibold text-[#4A2C2A] mb-2">Enterprise</p>
                      <p className="text-sm text-[#6B5B5B] mb-3">
                        Zakat is a <Highlight>100% tax rebate</Highlight>. It directly reduces your tax payable.
                      </p>
                      <p className="text-xs text-[#6B5B5B]">
                        RM5,000 tax - RM2,500 zakat = RM2,500 final tax
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#722F37]/5 to-[#722F37]/10 border border-[#722F37]/20">
                      <p className="font-serif font-semibold text-[#4A2C2A] mb-2">Sdn Bhd</p>
                      <p className="text-sm text-[#6B5B5B] mb-3">
                        Zakat is a <Highlight>tax deduction</Highlight> (max 2.5%). Reduces taxable profit, not tax directly.
                      </p>
                      <p className="text-xs text-[#6B5B5B]">
                        Saves ~15-24% of zakat amount
                      </p>
                    </div>
                  </div>
                </Section>

                {/* Tax Calendar */}
                <Section id="tax-calendar">
                  <SectionTitle>Tax Calendar</SectionTitle>
                  <SectionDesc>
                    Never miss a deadline. Key Malaysian tax dates to remember:
                  </SectionDesc>

                  <div className="my-6 rounded-2xl border border-[#E8D5C4] overflow-hidden">
                    {[
                      { form: 'Form BE', date: 'April 30', desc: 'Individuals without business income' },
                      { form: 'Form B', date: 'June 30', desc: 'Individuals with business income' },
                      { form: 'Form E', date: 'March 31', desc: 'Employer annual return' },
                      { form: 'Form C', date: '7 months after FY', desc: 'Company annual return' },
                      { form: 'CP204', date: '30 days before FY', desc: 'Company tax estimate' },
                    ].map((item, i) => (
                      <div key={item.form} className={`flex items-center justify-between p-4 ${i !== 0 ? 'border-t border-[#E8D5C4]' : ''} bg-[#FFFCF9]`}>
                        <div>
                          <p className="font-medium text-[#4A2C2A]">{item.form}</p>
                          <p className="text-xs text-[#6B5B5B]">{item.desc}</p>
                        </div>
                        <p className="text-sm font-medium text-[#722F37]">{item.date}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <LinkCard
                      to="/calendar"
                      title="View Full Calendar"
                      description="See all deadlines with filtering by entity type"
                      icon={CalendarCheck}
                    />
                  </div>
                </Section>

                {/* E-Invoicing */}
                <Section id="e-invoicing">
                  <SectionTitle>E-Invoicing</SectionTitle>
                  <SectionDesc>
                    Malaysia is implementing mandatory e-invoicing in phases based on company revenue.
                  </SectionDesc>

                  <div className="my-6 rounded-2xl border border-[#E8D5C4] overflow-hidden">
                    {[
                      { phase: 'Phase 1', revenue: '> RM100M', date: 'Aug 2024', status: 'Completed', color: 'text-[#6B5B5B]' },
                      { phase: 'Phase 2', revenue: 'RM25M - RM100M', date: 'Jan 2025', status: 'Active', color: 'text-[#2D7A4F]' },
                      { phase: 'Phase 3', revenue: 'RM5M - RM25M', date: 'Jul 2025', status: 'Upcoming', color: 'text-[#E5A84B]' },
                      { phase: 'Phase 4', revenue: 'RM1M - RM5M', date: 'Jan 2026', status: 'Upcoming', color: 'text-[#E5A84B]' },
                      { phase: 'Exempt', revenue: '< RM1M', date: '-', status: 'No Deadline', color: 'text-[#5B8A72]' },
                    ].map((item, i) => (
                      <div key={item.phase} className={`flex items-center justify-between p-4 ${i !== 0 ? 'border-t border-[#E8D5C4]' : ''} bg-[#FFFCF9]`}>
                        <div>
                          <p className="font-medium text-[#4A2C2A]">{item.phase}</p>
                          <p className="text-xs text-[#6B5B5B]">Revenue {item.revenue}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[#4A2C2A]">{item.date}</p>
                          <p className={`text-xs ${item.color}`}>{item.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <LinkCard
                      to="/e-invoicing"
                      title="E-Invoicing Hub"
                      description="Compliance checklist, industry guides, software directory"
                      icon={Receipt}
                    />
                  </div>
                </Section>

                {/* Results */}
                <Section id="results">
                  <SectionTitle>Understanding Results</SectionTitle>
                  <SectionDesc>
                    The results page shows three key metrics for each structure.
                  </SectionDesc>

                  <StepList
                    steps={[
                      { title: 'Net Cash', desc: 'Money in your pocket after all taxes, EPF, and compliance costs.' },
                      { title: 'Effective Tax Rate', desc: 'Total tax ÷ total income. Always lower than your marginal rate.' },
                      { title: 'Tax Savings', desc: 'Difference between structures. Positive = recommended structure saves money.' },
                    ]}
                  />

                  <p className="text-sm text-[#6B5B5B]">
                    The <Highlight>waterfall breakdown</Highlight> shows how your profit flows. The <Highlight>crossover chart</Highlight> shows at what profit level each structure wins.
                  </p>
                </Section>

                {/* Saving */}
                <Section id="saving">
                  <SectionTitle>Saving Calculations</SectionTitle>
                  <SectionDesc>
                    Sign in to save your calculations to the cloud.
                  </SectionDesc>

                  <div className="my-6 grid sm:grid-cols-2 gap-3">
                    <FeatureCard title="Cloud Sync" description="Access from any device, anytime" icon={CloudArrowUp} />
                    <FeatureCard title="Calculation History" description="Review past scenarios" icon={FileText} />
                    <FeatureCard title="Quick Resume" description="Pick up where you left off" icon={Rocket} />
                    <FeatureCard title="Secure Storage" description="Encrypted with Convex" icon={ShieldCheck} />
                  </div>
                </Section>

                {/* Sharing */}
                <Section id="sharing">
                  <SectionTitle>Sharing & Export</SectionTitle>
                  <SectionDesc>
                    Share your calculations with others or export for records.
                  </SectionDesc>

                  <div className="my-6 space-y-4">
                    <div className="p-5 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                      <p className="font-medium text-[#4A2C2A] mb-1">Shareable Link</p>
                      <p className="text-sm text-[#6B5B5B]">
                        Generate a URL with your inputs encoded. Recipients can open it without signing in.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl border border-[#E8D5C4] bg-[#FFFCF9]">
                      <p className="font-medium text-[#4A2C2A] mb-1">PDF Export</p>
                      <p className="text-sm text-[#6B5B5B]">
                        Download a professional report. Perfect for sharing with your accountant.
                      </p>
                    </div>
                  </div>
                </Section>

                {/* Limitations */}
                <Section id="limitations">
                  <SectionTitle>Limitations</SectionTitle>
                  <SectionDesc>
                    This calculator is for <Highlight>educational purposes</Highlight>.
                  </SectionDesc>

                  <div className="my-6">
                    <p className="font-medium text-[#4A2C2A] mb-3">What's NOT included:</p>
                    <ul className="space-y-2">
                      {[
                        'Capital allowances and business losses',
                        'Tax incentives and special deductions',
                        'Complex holding structures',
                        'Foreign income and withholding tax',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#6B5B5B]">
                          <Info weight="fill" className="h-4 w-4 text-[#6B5B5B] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <WarningBox>
                    <strong>Always consult a tax professional</strong> for complex situations. This tool helps you understand concepts, not replace professional advice.
                  </WarningBox>

                  <p className="text-sm text-[#6B5B5B] mt-6">
                    OpenTaxation is <Highlight>open source</Highlight>. View our methodology on{' '}
                    <a
                      href="https://github.com/hazlijohar95/opentaxation.my"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#722F37] hover:underline"
                    >
                      GitHub
                    </a>.
                  </p>
                </Section>

                {/* CTA */}
                <div className="mt-16 p-8 sm:p-9 rounded-3xl bg-gradient-to-br from-brand-muted-ivory via-white to-brand-muted-rose/30 border border-brand-border-ivory shadow-soft space-y-3">
                  <h3 className="font-serif text-2xl font-normal text-brand-espresso tracking-tight">
                    Ready to compare?
                  </h3>
                  <p className="text-brand-espresso/70 max-w-xl">
                    See which structure saves you more money with a clean, transparent breakdown.
                  </p>
                  <Link
                    to="/calculator"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-espresso font-medium uppercase tracking-[0.08em] hover:bg-brand-gold/90 shadow-sm hover:shadow-soft transition-all"
                  >
                    Open Calculator
                    <ArrowRight weight="bold" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="hidden xl:block w-48 flex-shrink-0 py-10 pr-6">
              <div className="sticky top-24">
                <p className="text-[11px] font-semibold text-[#6B5B5B] uppercase tracking-wider mb-3">
                  On this page
                </p>
                {currentCategory && (
                  <ul className="space-y-2">
                    {currentCategory.items.map(({ id, label }) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          className={`block text-sm transition-colors ${
                            activeSection === id
                              ? 'text-[#722F37] font-medium border-l-2 border-[#722F37] pl-3 -ml-[2px]'
                              : 'text-[#6B5B5B] hover:text-[#4A2C2A]'
                          }`}
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
