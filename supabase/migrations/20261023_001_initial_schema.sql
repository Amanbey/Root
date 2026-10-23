-- ==============================================================================
-- ROOT – AGRICULTURAL ADVISORY PLATFORM
-- Initial Database Migration (PostgreSQL + pgvector + RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE agro_ecological_zone AS ENUM ('Dega', 'Weyna Dega', 'Kolla', 'Bereha');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE advice_urgency AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_status AS ENUM ('queued', 'analyzing', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. FARMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  full_name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Oromia',
  zone_name TEXT,
  woreda TEXT,
  agro_ecological_zone agro_ecological_zone NOT NULL DEFAULT 'Weyna Dega',
  main_crops TEXT[] NOT NULL DEFAULT ARRAY['Teff', 'Wheat'],
  preferred_language TEXT NOT NULL DEFAULT 'en',
  farm_size_hectares NUMERIC(6, 2) DEFAULT 1.5,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for region and zone queries
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_region ON public.farmer_profiles(region);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_agro_zone ON public.farmer_profiles(agro_ecological_zone);

-- 4. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.farmer_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  symptoms_description TEXT NOT NULL,
  photo_url TEXT,
  region TEXT,
  agro_zone agro_ecological_zone,
  status question_status NOT NULL DEFAULT 'queued',
  is_offline_submission BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_user_id ON public.questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_crop_type ON public.questions(crop_type);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);

-- 5. MULTI-AGENT RUNS TABLE
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  model_used TEXT NOT NULL DEFAULT 'llama3.1:8b',
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed'
  execution_summary TEXT,
  total_duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_question_id ON public.agent_runs(question_id);

-- 6. AGENT TIMELINE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.agent_timeline_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_run_id UUID NOT NULL REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  agent_role TEXT NOT NULL, -- 'orchestrator', 'diagnostic', 'local_context', 'knowledge', 'advisor', 'critic'
  step_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed', -- 'running', 'completed', 'failed'
  input_preview TEXT,
  output_payload JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_agent_timeline_run_id ON public.agent_timeline_logs(agent_run_id);

-- 7. ADVICE CARDS TABLE
CREATE TABLE IF NOT EXISTS public.advice_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  agent_run_id UUID REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  diagnosis_name TEXT NOT NULL,
  scientific_name TEXT,
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  urgency advice_urgency NOT NULL DEFAULT 'medium',
  primary_crop TEXT NOT NULL,
  visual_indicators TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  probable_causes TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  immediate_actions TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  organic_remedies TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  chemical_remedies TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  preventive_measures TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  local_context_notes TEXT,
  recommended_season_action TEXT,
  helpful_votes INTEGER NOT NULL DEFAULT 0,
  unhelpful_votes INTEGER NOT NULL DEFAULT 0,
  agent_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advice_cards_question_id ON public.advice_cards(question_id);
CREATE INDEX IF NOT EXISTS idx_advice_cards_crop ON public.advice_cards(primary_crop);

-- 8. COMMUNITY KNOWLEDGE BASE TABLE (WITH PGVECTOR)
CREATE TABLE IF NOT EXISTS public.community_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_advice_card_id UUID REFERENCES public.advice_cards(id) ON DELETE SET NULL,
  crop_type TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  proven_solution TEXT NOT NULL,
  region TEXT NOT NULL,
  agro_zone agro_ecological_zone NOT NULL DEFAULT 'Weyna Dega',
  verified_by_farmers_count INTEGER NOT NULL DEFAULT 1,
  embedding vector(768), -- Llama 3.1 / Qwen2.5 / nomic-embed vector dimension
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_knowledge_crop ON public.community_knowledge(crop_type);
CREATE INDEX IF NOT EXISTS idx_community_knowledge_region ON public.community_knowledge(region);

-- Vector index for cosine distance similarity
CREATE INDEX IF NOT EXISTS idx_community_knowledge_embedding 
  ON public.community_knowledge 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 9. ADVICE FEEDBACK TABLE (COMMUNITY VOTING)
CREATE TABLE IF NOT EXISTS public.advice_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advice_card_id UUID NOT NULL REFERENCES public.advice_cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.farmer_profiles(id) ON DELETE SET NULL,
  vote TEXT NOT NULL CHECK (vote IN ('helpful', 'unhelpful')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_advice_card_user_vote UNIQUE (advice_card_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_advice_feedback_card ON public.advice_feedback(advice_card_id);

-- 10. VECTOR SIMILARITY SEARCH FUNCTION
CREATE OR REPLACE FUNCTION match_community_knowledge(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.70,
  match_count INT DEFAULT 5,
  filter_crop TEXT DEFAULT NULL,
  filter_region TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  crop_type TEXT,
  problem_title TEXT,
  symptoms TEXT,
  proven_solution TEXT,
  region TEXT,
  agro_zone agro_ecological_zone,
  verified_by_farmers_count INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ck.id,
    ck.crop_type,
    ck.problem_title,
    ck.symptoms,
    ck.proven_solution,
    ck.region,
    ck.agro_zone,
    ck.verified_by_farmers_count,
    1 - (ck.embedding <=> query_embedding) AS similarity
  FROM public.community_knowledge ck
  WHERE
    (filter_crop IS NULL OR ck.crop_type ILIKE filter_crop)
    AND (filter_region IS NULL OR ck.region ILIKE filter_region)
    AND (1 - (ck.embedding <=> query_embedding)) > match_threshold
  ORDER BY ck.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 11. AUTOMATED TRIGGERS

-- Trigger: auto-provision farmer_profiles on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.farmer_profiles (
    id,
    email,
    phone,
    full_name,
    region,
    agro_ecological_zone,
    preferred_language
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'region', 'Oromia'),
    COALESCE((NEW.raw_user_meta_data->>'agro_zone')::agro_ecological_zone, 'Weyna Dega'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: update advice card vote counts upon feedback insertion/update
CREATE OR REPLACE FUNCTION public.handle_advice_vote_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.advice_cards
  SET
    helpful_votes = (
      SELECT COUNT(*) FROM public.advice_feedback
      WHERE advice_card_id = NEW.advice_card_id AND vote = 'helpful'
    ),
    unhelpful_votes = (
      SELECT COUNT(*) FROM public.advice_feedback
      WHERE advice_card_id = NEW.advice_card_id AND vote = 'unhelpful'
    )
  WHERE id = NEW.advice_card_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_advice_feedback_inserted ON public.advice_feedback;
CREATE TRIGGER on_advice_feedback_inserted
  AFTER INSERT OR UPDATE ON public.advice_feedback
  FOR EACH ROW EXECUTE FUNCTION public.handle_advice_vote_change();

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_timeline_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advice_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advice_feedback ENABLE ROW LEVEL SECURITY;

-- Farmer Profiles: Anyone authenticated can read profiles; users can update their own
CREATE POLICY "Public profile view" ON public.farmer_profiles
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Users update own profile" ON public.farmer_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON public.farmer_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Questions: Users can read their own or public; authenticated users can insert
CREATE POLICY "Read questions" ON public.questions
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Insert questions" ON public.questions
  FOR INSERT TO authenticated, anon WITH CHECK (true);

CREATE POLICY "Update own questions" ON public.questions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Agent Runs & Timeline: Readable by everyone; inserted by system/user
CREATE POLICY "Read agent runs" ON public.agent_runs
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Insert agent runs" ON public.agent_runs
  FOR INSERT TO authenticated, anon WITH CHECK (true);

CREATE POLICY "Read agent timeline logs" ON public.agent_timeline_logs
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Insert agent timeline logs" ON public.agent_timeline_logs
  FOR INSERT TO authenticated, anon WITH CHECK (true);

-- Advice Cards: Publicly readable; inserters can write
CREATE POLICY "Read advice cards" ON public.advice_cards
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Insert advice cards" ON public.advice_cards
  FOR INSERT TO authenticated, anon WITH CHECK (true);

-- Community Knowledge: Publicly readable; insertable by authenticated users
CREATE POLICY "Read community knowledge" ON public.community_knowledge
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Insert community knowledge" ON public.community_knowledge
  FOR INSERT TO authenticated WITH CHECK (true);

-- Advice Feedback: Read all feedback; insert or update own vote
CREATE POLICY "Read advice feedback" ON public.advice_feedback
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Insert advice feedback" ON public.advice_feedback
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Update own advice feedback" ON public.advice_feedback
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 13. STORAGE BUCKET CONFIGURATION (Crop diagnosis photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-photos', 'crop-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for crop photos
CREATE POLICY "Public read crop photos" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'crop-photos');

CREATE POLICY "Authenticated users upload crop photos" ON storage.objects
  FOR INSERT TO authenticated, anon WITH CHECK (bucket_id = 'crop-photos');
