import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Prediction {
  id: string;
  match_id: string | null;
  league: string;
  home_team: string;
  away_team: string;
  prediction_type: 'single' | 'multi' | 'jackpot';
  prediction: string;
  confidence_score: number | null;
  odds: any;
  is_premium: boolean;
  match_date: string;
  result: 'pending' | 'won' | 'lost';
  reasoning: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const usePredictions = (type?: string, limit?: number) => {
  const { user, profile } = useAuth();
  
  return useQuery({
    queryKey: ['predictions', type, limit],
    queryFn: async () => {
      let query = supabase
        .from('predictions')
        .select('*')
        .order('match_date', { ascending: true });

      if (type) {
        query = query.eq('prediction_type', type);
      }

      if (limit) {
        query = query.limit(limit);
      }

      // Filter based on user subscription
      if (!user) {
        query = query.eq('is_premium', false);
      } else if (profile?.subscription_plan !== 'premium') {
        query = query.eq('is_premium', false);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Prediction[];
    },
  });
};

export const useTodaysPredictions = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return useQuery({
    queryKey: ['predictions', 'today'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .gte('match_date', today.toISOString())
        .lt('match_date', tomorrow.toISOString())
        .order('match_date', { ascending: true });
      
      if (error) throw error;
      return data as Prediction[];
    },
  });
};

export const useCreatePrediction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPrediction: Omit<Prediction, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('predictions')
        .insert(newPrediction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });
};

export const useUpdatePrediction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Prediction> }) => {
      const { data, error } = await supabase
        .from('predictions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });
};