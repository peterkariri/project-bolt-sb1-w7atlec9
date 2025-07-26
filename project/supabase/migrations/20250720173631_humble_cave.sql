/*
  # Supreme Betting Tips Database Schema

  1. New Tables
    - `profiles` - User profile information extending Supabase auth
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `subscription_plan` (text: free, premium)
      - `subscription_expires_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `predictions` - Betting predictions and tips
      - `id` (uuid, primary key)
      - `match_id` (text)
      - `league` (text)
      - `home_team` (text)
      - `away_team` (text)
      - `prediction_type` (text: single, multi, jackpot)
      - `prediction` (text)
      - `confidence_score` (integer)
      - `odds` (jsonb)
      - `is_premium` (boolean)
      - `match_date` (timestamp)
      - `result` (text: pending, won, lost)
      - `reasoning` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `matches` - Match fixtures and data
      - `id` (uuid, primary key)
      - `external_id` (text, unique)
      - `home_team` (text)
      - `away_team` (text)
      - `league` (text)
      - `match_date` (timestamp)
      - `venue` (text)
      - `odds_data` (jsonb)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `subscriptions` - User subscription tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `plan` (text)
      - `status` (text)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `amount` (decimal)
      - `created_at` (timestamp)
    
    - `betting_logs` - User personal betting records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `prediction_id` (uuid, references predictions)
      - `stake_amount` (decimal)
      - `potential_return` (decimal)
      - `actual_return` (decimal)
      - `status` (text: pending, won, lost)
      - `bet_date` (timestamp)
      - `created_at` (timestamp)
    
    - `tip_interactions` - User interactions with tips
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `prediction_id` (uuid, references predictions)
      - `interaction_type` (text: like, comment, share)
      - `comment_text` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Add policies for admins to manage predictions and users
    - Add policies for public access to free predictions
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium')),
  subscription_expires_at timestamptz,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id text,
  league text NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  prediction_type text DEFAULT 'single' CHECK (prediction_type IN ('single', 'multi', 'jackpot')),
  prediction text NOT NULL,
  confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100),
  odds jsonb DEFAULT '{}',
  is_premium boolean DEFAULT false,
  match_date timestamptz NOT NULL,
  result text DEFAULT 'pending' CHECK (result IN ('pending', 'won', 'lost')),
  reasoning text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE,
  home_team text NOT NULL,
  away_team text NOT NULL,
  league text NOT NULL,
  match_date timestamptz NOT NULL,
  venue text,
  odds_data jsonb DEFAULT '{}',
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  amount decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create betting_logs table
CREATE TABLE IF NOT EXISTS betting_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prediction_id uuid REFERENCES predictions(id),
  stake_amount decimal(10,2) NOT NULL,
  potential_return decimal(10,2),
  actual_return decimal(10,2) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost')),
  bet_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create tip_interactions table
CREATE TABLE IF NOT EXISTS tip_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prediction_id uuid REFERENCES predictions(id) ON DELETE CASCADE,
  interaction_type text CHECK (interaction_type IN ('like', 'comment', 'share')),
  comment_text text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE betting_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_interactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Predictions policies
CREATE POLICY "Everyone can read free predictions"
  ON predictions
  FOR SELECT
  TO authenticated
  USING (is_premium = false);

CREATE POLICY "Premium users can read premium predictions"
  ON predictions
  FOR SELECT
  TO authenticated
  USING (
    is_premium = true AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (subscription_plan = 'premium' AND subscription_expires_at > now())
    )
  );

CREATE POLICY "Admins can manage predictions"
  ON predictions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Matches policies
CREATE POLICY "Everyone can read matches"
  ON matches
  FOR SELECT
  TO authenticated;

CREATE POLICY "Admins can manage matches"
  ON matches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Betting logs policies
CREATE POLICY "Users can manage own betting logs"
  ON betting_logs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Tip interactions policies
CREATE POLICY "Users can manage own interactions"
  ON tip_interactions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Everyone can read interactions"
  ON tip_interactions
  FOR SELECT
  TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_predictions_match_date ON predictions(match_date);
CREATE INDEX IF NOT EXISTS idx_predictions_premium ON predictions(is_premium);
CREATE INDEX IF NOT EXISTS idx_predictions_type ON predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_betting_logs_user_id ON betting_logs(user_id);