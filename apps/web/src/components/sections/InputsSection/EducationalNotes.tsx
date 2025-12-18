import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lightbulb, CaretDown, X } from 'phosphor-react';

const NOTES = [
  {
    id: 'salary',
    titleKey: 'inputs.notes.salary.title',
    contentKey: 'inputs.notes.salary.content',
  },
  {
    id: 'sdnbhd-salary',
    titleKey: 'inputs.notes.sdnbhdSalary.title',
    contentKey: 'inputs.notes.sdnbhdSalary.content',
  },
  {
    id: 'epf',
    titleKey: 'inputs.notes.epf.title',
    contentKey: 'inputs.notes.epf.content',
  },
  {
    id: 'compliance',
    titleKey: 'inputs.notes.compliance.title',
    contentKey: 'inputs.notes.compliance.content',
  },
  {
    id: 'dividend-tax',
    titleKey: 'inputs.notes.dividendTax.title',
    contentKey: 'inputs.notes.dividendTax.content',
  },
];

export default function EducationalNotes() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Collapsed state - minimal pill button */}
      {!isExpanded && (
        <motion.button
          type="button"
          onClick={() => setIsExpanded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-muted/50 hover:bg-muted/70 border border-border/30 transition-colors group"
        >
          <Lightbulb weight="duotone" className="h-4 w-4 text-amber-500" />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {t('inputs.notes.title')}
          </span>
          <CaretDown weight="bold" className="h-3.5 w-3.5 text-muted-foreground" />
        </motion.button>
      )}

      {/* Expanded state - compact list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Lightbulb weight="duotone" className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">{t('inputs.notes.title')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    setSelectedNote(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X weight="bold" className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Notes list */}
              <div className="divide-y divide-border/30">
                {NOTES.map((note) => (
                  <div key={note.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedNote(selectedNote === note.id ? null : note.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-sm text-foreground">{t(note.titleKey)}</span>
                      <motion.div
                        animate={{ rotate: selectedNote === note.id ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <CaretDown weight="bold" className="h-3.5 w-3.5 text-muted-foreground" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {selectedNote === note.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1">
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                              {t(note.contentKey)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
