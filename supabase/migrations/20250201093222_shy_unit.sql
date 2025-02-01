/*
  # Initial Finance Dashboard Schema

  1. New Tables
    - users (managed by Supabase Auth)
    - transactions
      - id (uuid, primary key)
      - user_id (references auth.users)
      - amount (decimal)
      - type (enum: income/expense)
      - category (text)
      - description (text)
      - date (timestamp)
    - budgets
      - id (uuid, primary key)
      - user_id (references auth.users)
      - category (text)
      - amount (decimal)
      - month (date)
    - shared_dashboards
      - id (uuid, primary key)
      - owner_id (references auth.users)
      - shared_with_id (references auth.users)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add policies for shared dashboard access
*/

-- Create custom types
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    amount decimal NOT NULL,
    type transaction_type NOT NULL,
    category text NOT NULL,
    description text,
    date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    category text NOT NULL,
    amount decimal NOT NULL,
    month date NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, category, month)
);

-- Create shared_dashboards table
CREATE TABLE IF NOT EXISTS shared_dashboards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid REFERENCES auth.users(id) NOT NULL,
    shared_with_id uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(owner_id, shared_with_id)
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_dashboards ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM shared_dashboards
            WHERE (owner_id = auth.uid() AND shared_with_id = transactions.user_id)
            OR (shared_with_id = auth.uid() AND owner_id = transactions.user_id)
        )
    );

CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view own budgets"
    ON budgets FOR SELECT
    USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM shared_dashboards
            WHERE (owner_id = auth.uid() AND shared_with_id = budgets.user_id)
            OR (shared_with_id = auth.uid() AND owner_id = budgets.user_id)
        )
    );

CREATE POLICY "Users can insert own budgets"
    ON budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
    ON budgets FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
    ON budgets FOR DELETE
    USING (auth.uid() = user_id);

-- Shared dashboards policies
CREATE POLICY "Users can view their shared dashboards"
    ON shared_dashboards FOR SELECT
    USING (auth.uid() = owner_id OR auth.uid() = shared_with_id);

CREATE POLICY "Users can create shared dashboards"
    ON shared_dashboards FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their shared dashboards"
    ON shared_dashboards FOR DELETE
    USING (auth.uid() = owner_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_month ON budgets(month);
CREATE INDEX IF NOT EXISTS idx_shared_dashboards_owner ON shared_dashboards(owner_id);
CREATE INDEX IF NOT EXISTS idx_shared_dashboards_shared_with ON shared_dashboards(shared_with_id);