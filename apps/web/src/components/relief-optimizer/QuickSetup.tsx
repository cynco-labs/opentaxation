import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightning, Check, CaretLeft, User, Users, Heart, FirstAid, Vault } from 'phosphor-react';
import type { ReliefClaimValues, ReliefClaimEntry } from '@tax-engine/core';

interface QuickSetupProps {
  onComplete: (claims: ReliefClaimValues) => void;
  onSkip: () => void;
}

interface QuickSetupQuestion {
  id: string;
  icon: React.ElementType;
  question: string;
  reliefId: string;
  defaultAmount: number;
  hasAmountInput?: boolean;
  hasQuantityInput?: boolean;
  maxAmount?: number;
  maxQuantity?: number;
  amountLabel?: string;
  quantityLabel?: string;
}

const QUICK_QUESTIONS: QuickSetupQuestion[] = [
  {
    id: 'spouse',
    icon: User,
    question: 'Do you have a spouse with no income?',
    reliefId: 'spouse',
    defaultAmount: 4000,
  },
  {
    id: 'children',
    icon: Users,
    question: 'Do you have children under 18?',
    reliefId: 'child_under18',
    defaultAmount: 2000,
    hasQuantityInput: true,
    maxQuantity: 10,
    quantityLabel: 'How many?',
  },
  {
    id: 'medical_insurance',
    icon: Heart,
    question: 'Pay for medical/education insurance?',
    reliefId: 'education_medical_insurance',
    defaultAmount: 3000,
    hasAmountInput: true,
    maxAmount: 3000,
    amountLabel: 'Annual premium (max RM3,000)',
  },
  {
    id: 'parents_medical',
    icon: FirstAid,
    question: "Parents' medical expenses?",
    reliefId: 'parents_medical',
    defaultAmount: 5000,
    hasAmountInput: true,
    maxAmount: 8000,
    amountLabel: 'Amount (max RM8,000)',
  },
  {
    id: 'epf',
    icon: Vault,
    question: 'Voluntary EPF contribution?',
    reliefId: 'epf',
    defaultAmount: 4000,
    hasAmountInput: true,
    maxAmount: 4000,
    amountLabel: 'Annual amount (max RM4,000)',
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function QuickSetup({ onComplete, onSkip }: QuickSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { enabled: boolean; amount?: number; quantity?: number }>>({});
  const [pendingAdvance, setPendingAdvance] = useState(false);

  const currentQuestion = QUICK_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === QUICK_QUESTIONS.length - 1;
  const hasAdditionalInput = currentQuestion?.hasAmountInput || currentQuestion?.hasQuantityInput;
  const currentAnswer = answers[currentQuestion?.id];

  const finishSetup = useCallback(() => {
    const claims: ReliefClaimValues = {};
    for (const question of QUICK_QUESTIONS) {
      const answer = answers[question.id];
      if (answer?.enabled) {
        const entry: ReliefClaimEntry = {
          amount: answer.amount ?? question.defaultAmount,
        };
        if (answer.quantity && answer.quantity > 1) {
          entry.quantity = answer.quantity;
        }
        claims[question.reliefId] = entry;
      }
    }
    onComplete(claims);
  }, [answers, onComplete]);

  // Auto-advance after selection (with slight delay for visual feedback)
  useEffect(() => {
    if (pendingAdvance) {
      const timer = setTimeout(() => {
        if (isLastQuestion) {
          finishSetup();
        } else {
          setCurrentStep(prev => prev + 1);
        }
        setPendingAdvance(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pendingAdvance, isLastQuestion, finishSetup]);

  const handleYes = useCallback(() => {
    const newAnswer = {
      enabled: true,
      amount: currentQuestion.defaultAmount,
      quantity: 1
    };
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: newAnswer }));

    // Auto-advance only if no additional input needed
    if (!hasAdditionalInput) {
      setPendingAdvance(true);
    }
  }, [currentQuestion, hasAdditionalInput]);

  const handleNo = useCallback(() => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: { enabled: false } }));
    setPendingAdvance(true);
  }, [currentQuestion]);

  const handleQuantityChange = useCallback((delta: number) => {
    const current = currentAnswer?.quantity || 1;
    const newQty = Math.max(1, Math.min(currentQuestion.maxQuantity || 10, current + delta));
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], enabled: true, quantity: newQty }
    }));
  }, [currentQuestion, currentAnswer]);

  const handleAmountChange = useCallback((value: number) => {
    const clamped = Math.min(currentQuestion.maxAmount || Infinity, Math.max(0, value));
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], enabled: true, amount: clamped }
    }));
  }, [currentQuestion]);

  const handleContinue = useCallback(() => {
    if (isLastQuestion) {
      finishSetup();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [isLastQuestion, finishSetup]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Lightning weight="fill" className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Quick Setup</span>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {QUICK_QUESTIONS.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              idx < currentStep
                ? 'bg-primary'
                : idx === currentStep
                ? 'bg-primary w-6'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-4"
        >
          {/* Question */}
          <div className="text-center space-y-3 py-2">
            <div className="inline-flex p-3 rounded-2xl bg-muted/50">
              <currentQuestion.icon weight="duotone" className="h-7 w-7 text-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground px-4">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Yes/No Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleYes}
              className={`py-4 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${
                currentAnswer?.enabled === true
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={handleNo}
              className={`py-4 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${
                currentAnswer?.enabled === false
                  ? 'bg-foreground/10 text-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              No
            </button>
          </div>

          {/* Additional inputs (only show if Yes selected and question requires it) */}
          <AnimatePresence>
            {currentAnswer?.enabled && hasAdditionalInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-1 space-y-4">
                  {currentQuestion.hasQuantityInput && (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xl font-medium transition-colors active:scale-95"
                      >
                        −
                      </button>
                      <div className="text-center min-w-[80px]">
                        <span className="text-3xl font-bold text-foreground tabular-nums">
                          {currentAnswer.quantity || 1}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          = RM{formatCurrency(currentQuestion.defaultAmount * (currentAnswer.quantity || 1))}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xl font-medium transition-colors active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  )}

                  {currentQuestion.hasAmountInput && (
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2 text-center">
                        {currentQuestion.amountLabel}
                      </label>
                      <div className="relative max-w-[200px] mx-auto">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                          RM
                        </span>
                        <input
                          type="number"
                          value={currentAnswer.amount || currentQuestion.defaultAmount}
                          onChange={(e) => handleAmountChange(Number(e.target.value) || 0)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border-0 text-foreground text-center text-lg font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/50"
                          max={currentQuestion.maxAmount}
                          min={0}
                        />
                      </div>
                    </div>
                  )}

                  {/* Continue button for questions with additional input */}
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Check weight="bold" className="h-4 w-4" />
                    {isLastQuestion ? 'Done' : 'Continue'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Back button (only show if not first step) */}
      {currentStep > 0 && (
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <CaretLeft weight="bold" className="h-3.5 w-3.5" />
          Back
        </button>
      )}
    </div>
  );
}
