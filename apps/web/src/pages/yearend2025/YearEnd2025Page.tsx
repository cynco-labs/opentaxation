import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CHECKPOINTS, STORAGE_KEY } from './zakatReceiptChecklist';
import IntroScreen from './components/IntroScreen';
import ReceiptChecklistScreen from './components/ReceiptChecklistScreen';
import ShareScreen from './components/ShareScreen';

interface YearEndState {
  currentStep: 1 | 2 | 3;
  completedIds: number[];
  activeCheckpointId: number | null;
}

const initialState: YearEndState = {
  currentStep: 1,
  completedIds: [],
  activeCheckpointId: null,
};

export default function YearEnd2025Page() {
  const [state, setState] = useLocalStorage<YearEndState>(
    STORAGE_KEY,
    initialState
  );

  // Migrate old state (when we had 4 steps) to new state (3 steps)
  useEffect(() => {
    const currentStep = state.currentStep as number;
    if (currentStep === 4) {
      setState((prev) => ({ ...prev, currentStep: 3 }));
    }
    if (currentStep > 3) {
      setState(initialState);
    }
  }, [state.currentStep, setState]);

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const step = event.state?.step || 1;
      setState((prev) => ({ ...prev, currentStep: step as 1 | 2 | 3 }));
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize history state
    if (!window.history.state?.step) {
      window.history.replaceState({ step: state.currentStep }, '');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setState]);

  // Push history state when step changes
  useEffect(() => {
    if (window.history.state?.step !== state.currentStep) {
      window.history.pushState({ step: state.currentStep }, '');
    }
  }, [state.currentStep]);

  const handleStart = () => {
    setState((prev) => ({ ...prev, currentStep: 2 }));
  };

  const handleCheckpointClick = (id: number) => {
    setState((prev) => ({ ...prev, activeCheckpointId: id }));
  };

  const handleCheckpointComplete = (id: number) => {
    setState((prev) => ({
      ...prev,
      completedIds: [...new Set([...prev.completedIds, id])],
      activeCheckpointId: null,
    }));
  };

  const handleCloseModal = () => {
    setState((prev) => ({ ...prev, activeCheckpointId: null }));
  };

  const handleContinueToShare = () => {
    setState((prev) => ({ ...prev, currentStep: 3 }));
  };

  const handleBackToChecklist = () => {
    setState((prev) => ({ ...prev, currentStep: 2 }));
  };

  const handleReset = () => {
    setState(initialState);
  };

  const activeCheckpoint = CHECKPOINTS.find(
    (c) => c.id === state.activeCheckpointId
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <AnimatePresence mode="wait">
        {state.currentStep === 1 && (
          <IntroScreen key="intro" onStart={handleStart} />
        )}

        {state.currentStep === 2 && (
          <ReceiptChecklistScreen
            key="checklist"
            completedIds={state.completedIds}
            activeCheckpoint={activeCheckpoint}
            onCheckpointClick={handleCheckpointClick}
            onCheckpointComplete={handleCheckpointComplete}
            onCloseModal={handleCloseModal}
            onContinue={handleContinueToShare}
            onReset={handleReset}
          />
        )}

        {state.currentStep === 3 && (
          <ShareScreen
            key="share"
            completedIds={state.completedIds}
            onBack={handleBackToChecklist}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
