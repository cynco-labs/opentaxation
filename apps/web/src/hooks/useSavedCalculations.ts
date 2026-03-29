import { useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useAuth } from '@/contexts/AuthContext';

export function useSavedCalculations() {
  const { user, isAuthenticated } = useAuth();

  const calculations = useQuery(
    api.savedCalculations.list,
    isAuthenticated ? {} : "skip",
  );

  const saveMutation = useMutation(api.savedCalculations.save);
  const deleteMutation = useMutation(api.savedCalculations.remove);
  const updateMutation = useMutation(api.savedCalculations.update);

  const saveCalculation = useCallback(
    async (name: string, inputs: any, results: any) => {
      const id = await saveMutation({ name, inputs, results });
      return { id, name, inputs, results };
    },
    [saveMutation],
  );

  const deleteCalculation = useCallback(
    async (id: string) => {
      await deleteMutation({ id: id as any });
    },
    [deleteMutation],
  );

  const updateCalculation = useCallback(
    async (id: string, updates: { name?: string; inputs?: any; results?: any }) => {
      await updateMutation({ id: id as any, ...updates });
    },
    [updateMutation],
  );

  return {
    calculations: calculations ?? null,
    isLoading: calculations === undefined,
    error: null,
    isConfigured: true,
    isAuthenticated,
    saveCalculation,
    deleteCalculation,
    getCalculation: async () => null, // Use Convex queries directly if needed
    updateCalculation,
    refetch: () => {}, // Convex auto-updates reactively
  };
}
