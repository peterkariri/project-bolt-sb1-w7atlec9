import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          subscription_plan: 'free' | 'premium';
          subscription_expires_at: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          subscription_plan?: 'free' | 'premium';
          subscription_expires_at?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          subscription_plan?: 'free' | 'premium';
          subscription_expires_at?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      predictions: {
        Row: {
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
        };
        Insert: {
          id?: string;
          match_id?: string | null;
          league: string;
          home_team: string;
          away_team: string;
          prediction_type?: 'single' | 'multi' | 'jackpot';
          prediction: string;
          confidence_score?: number | null;
          odds?: any;
          is_premium?: boolean;
          match_date: string;
          result?: 'pending' | 'won' | 'lost';
          reasoning?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string | null;
          league?: string;
          home_team?: string;
          away_team?: string;
          prediction_type?: 'single' | 'multi' | 'jackpot';
          prediction?: string;
          confidence_score?: number | null;
          odds?: any;
          is_premium?: boolean;
          match_date?: string;
          result?: 'pending' | 'won' | 'lost';
          reasoning?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};