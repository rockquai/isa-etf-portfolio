-- ============================================================
-- 1. 테이블 생성
-- ============================================================

-- ETF 보유 종목
CREATE TABLE etf_holdings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker      TEXT NOT NULL,              -- 'TIGER 미국배당다우존스'
  avg_price   NUMERIC(10,2) NOT NULL,     -- 평단가 (원)
  current_price NUMERIC(10,2),            -- 현재가 (Mock or 입력값)
  quantity    INTEGER NOT NULL DEFAULT 1,
  annual_dividend_per_share NUMERIC(10,2) DEFAULT 0,
  dividend_growth_rate NUMERIC(4,3) DEFAULT 0.050,  -- 5%
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 거래 내역
CREATE TABLE transactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  etf_id      UUID REFERENCES etf_holdings(id) ON DELETE CASCADE,
  price       NUMERIC(10,2) NOT NULL,     -- 매수가
  quantity    INTEGER NOT NULL DEFAULT 1,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 설정
CREATE TABLE user_settings (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  goal_message TEXT DEFAULT NULL,          -- 나만의 투자 다짐 문구 (최대 100자)
  user_tier    TEXT DEFAULT 'free' CHECK (user_tier IN ('free', 'pro')),
  ai_call_count INTEGER DEFAULT 0,         -- 이번 달 AI 호출 횟수
  ai_call_reset_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- AI 호출 로그 (비용 추적용)
CREATE TABLE ai_usage_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model       TEXT NOT NULL,               -- 'gpt-4o-mini' | 'claude-sonnet'
  input_tokens  INTEGER,
  output_tokens INTEGER,
  cost_usd    NUMERIC(10,6),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. 추가 컬럼 (검토 반영)
-- ============================================================

-- etf_holdings: 평단가 대비 현재가 손익 자동 계산 컬럼
ALTER TABLE etf_holdings
  ADD COLUMN is_profit BOOLEAN GENERATED ALWAYS AS (current_price >= avg_price) STORED;

-- transactions: 매수 시점 손익 여부
ALTER TABLE transactions
  ADD COLUMN is_profit BOOLEAN;

-- user_settings: 월 목표 배당금 + 매일 1주 가정 토글
ALTER TABLE user_settings
  ADD COLUMN goal_monthly_amount INTEGER DEFAULT 500000,   -- 월 목표 배당금 (원)
  ADD COLUMN daily_purchase_enabled BOOLEAN DEFAULT FALSE; -- 매일 1주 매수 가정 토글

-- ============================================================
-- 3. RLS 활성화
-- ============================================================

ALTER TABLE etf_holdings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. RLS 정책 (본인 데이터만 접근)
-- ============================================================

CREATE POLICY "users can manage own etf_holdings"
  ON etf_holdings FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "users can manage own transactions"
  ON transactions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "users can manage own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "users can manage own ai_usage_logs"
  ON ai_usage_logs FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 5. DB Function: AI 호출 횟수 원자적 증가
--    Race Condition 방지 — SELECT→비교→UPDATE 분리 대신 행 잠금 사용
-- ============================================================

CREATE OR REPLACE FUNCTION increment_ai_call(p_user_id UUID, p_limit INT)
RETURNS TABLE(allowed BOOLEAN, new_count INT) AS $$
DECLARE
  v_count    INT;
  v_tier     TEXT;
  v_reset_at TIMESTAMPTZ;
BEGIN
  SELECT ai_call_count, user_tier, ai_call_reset_at
  INTO v_count, v_tier, v_reset_at
  FROM user_settings
  WHERE user_id = p_user_id
  FOR UPDATE;  -- 행 잠금으로 동시 요청 차단

  -- 월 초기화
  IF v_reset_at < date_trunc('month', NOW()) THEN
    v_count := 0;
    UPDATE user_settings
    SET ai_call_count = 0, ai_call_reset_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  IF v_tier = 'pro' OR v_count < p_limit THEN
    UPDATE user_settings
    SET ai_call_count = v_count + 1
    WHERE user_id = p_user_id;
    RETURN QUERY SELECT TRUE, v_count + 1;
  ELSE
    RETURN QUERY SELECT FALSE, v_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
