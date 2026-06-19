# ✅ FE 기능 구현 Task 리스트
## 주린이 ISA ETF 포트폴리오 관리 웹뷰 서비스

> **사용법:** Claude에게 작업 요청 시 이 파일 + `02_FE.md`를 함께 첨부하세요.
> 완료된 항목은 `- [x]`로 체크하세요.
>
> **업데이트 내역 (02_FE.md 검토 반영)**
> - PHASE 0: 패키지 설치 명령 수정 (recharts 제거), 추가 폴더·파일 항목 삽입
> - PHASE 0: 인증(로그인) 관련 세팅 항목 추가
> - PHASE 5: `calcDividendProjection` 기본값 수정, NaN 가드, Server Action 패턴 적용
> - PHASE 5: `BuyRecordButton` 낙관적 업데이트 항목 추가
> - PHASE 7: Supabase 클라이언트 분리 방식으로 수정, `onSave` → Server Action 전환
> - PHASE 8: ErrorBoundary / Toast 컴포넌트 구현 항목 추가
> - PHASE 8: 추가 Storybook stories 항목 삽입
> - PHASE 10 (신규): 인증 플로우 구현 Phase 추가

---

## PHASE 0 — 프로젝트 초기 세팅

### 0-1. 프로젝트 생성
- [ ] `npx create-next-app@latest isa-etf-portfolio --typescript --app --src-dir`
- [ ] Tailwind 설치 여부 → **No** 선택
- [ ] GitHub 레포 생성 + 첫 커밋 (`git init`, `main` 브랜치)
- [ ] Vercel 연결 (GitHub 레포 import)

### 0-2. 패키지 설치
- [ ] `npm install react-window @supabase/supabase-js @supabase/ssr rss-parser`
  - ⚠️ `recharts` 설치 금지 — ETFPieChart는 SVG 직접 구현
  - ⚠️ `@supabase/ssr` 추가 — 서버/클라이언트 클라이언트 분리에 필수
- [ ] `npm install --save-dev @storybook/nextjs storybook @types/react-window`
- [ ] Storybook 초기화 (`npx storybook@latest init`)
- [ ] `npm run storybook` 정상 실행 확인

### 0-3. 폴더 구조 생성
- [ ] `app/dashboard/_components/` 폴더 생성
- [ ] `app/portfolio/_components/` 폴더 생성
- [ ] `app/settings/` 폴더 생성
- [ ] `app/login/` 폴더 생성 ← **신규** (소셜 로그인 페이지)
- [ ] `app/actions/` 폴더 생성 ← **신규** (Server Actions)
- [ ] `components/` 폴더 생성 (공통 컴포넌트)
- [ ] `components/ErrorBoundary/` 폴더 생성 ← **신규**
- [ ] `components/Toast/` 폴더 생성 ← **신규**
- [ ] `lib/mock/` 폴더 생성
- [ ] `types/` 폴더 생성
- [ ] `styles/` 폴더 생성
- [ ] `stories/` 폴더 생성

### 0-4. 환경 변수
- [ ] `.env.local` 파일 생성
- [ ] `.env.local` → `.gitignore`에 포함 확인
- [ ] `ANTHROPIC_API_KEY` 입력
- [ ] `OPENAI_API_KEY` 입력
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 입력
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 입력
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 입력 ← **신규** (서버 전용, NEXT_PUBLIC_ 없음)
- [ ] `HANKYUNG_RSS_URL` 입력

### 0-5. 인증 미들웨어 세팅 ← **신규 섹션 (P0)**
- [ ] `middleware.ts` 루트 레벨에 생성
- [ ] `/dashboard`, `/portfolio`, `/settings` — 비로그인 시 `/login` 리다이렉트
- [ ] `export const config = { matcher: [...] }` 경로 설정
- [ ] `app/login/page.tsx` 생성 (Supabase 소셜 로그인 UI)
- [ ] `app/error.tsx` 생성 (전역 에러 페이지)
- [ ] `app/not-found.tsx` 생성 (404 페이지)

---

## PHASE 1 — 디자인 토큰 & 전역 스타일

### 1-1. Figma 작업 (코드 작업 전 선행)
- [ ] Figma Color Variables 정의 (tokens.css와 1:1 매핑)
- [ ] Figma Typography Variables 정의
- [ ] Figma Spacing Variables 정의
- [ ] 대시보드 메인 화면 와이어프레임
- [ ] 포트폴리오 화면 와이어프레임

### 1-2. `styles/tokens.css` 작성
- [ ] `--color-stock-up: #E53E3E` (상승 — 빨강)
- [ ] `--color-stock-down: #2B6CB0` (하락 — 파랑)
- [ ] `--color-bg-primary / secondary / goal` 정의
- [ ] `--color-text-primary / secondary` 정의
- [ ] `--color-border / border-goal` 정의
- [ ] `--color-chart-1 ~ 5` (파이차트 슬라이스 색상) 정의
- [ ] `--spacing-touch-min: 44px` 정의
- [ ] `--radius-card: 12px / --radius-button: 8px` 정의
- [ ] `--font-size-label / body / title / large` 정의
- [ ] `--font-weight-regular / medium / bold` 정의

### 1-3. `styles/globals.css` 작성
- [ ] `@import './tokens.css'` 연결
- [ ] `* { box-sizing: border-box; margin: 0; padding: 0; }` 리셋
- [ ] `body` — `touch-action: manipulation` (핀치줌 방지)
- [ ] `body` — `-webkit-tap-highlight-color: transparent` (iOS 잔상 제거)
- [ ] `body` — `max-width: 430px; margin: 0 auto` (모바일 웹뷰 기준)
- [ ] `body` — `font-family: -apple-system, Pretendard, sans-serif`
- [ ] `.news-content, .etf-ticker-code, .dividend-value, .price-value` → `user-select: text`
- [ ] `.bottom-sheet-handle, .app-nav-bar, .tab-bar` → `user-select: none`

---

## PHASE 2 — TypeScript 타입 & Mock 데이터

### 2-1. `types/etf.ts` 작성
- [ ] `ETFHolding` 타입 정의
- [ ] `Transaction` 타입 정의
- [ ] `DividendProjection` 타입 (`year: 3 | 5 | 10 | 20`)
- [ ] `NewsItem` 타입 정의
- [ ] `UserTier` 타입 (`'free' | 'pro'`)

### 2-2. `lib/mock/etf.ts` 작성
- [ ] Mock ETF 종목 5개 작성
  - TIGER 미국배당다우존스
  - TIGER 미국S&P500
  - KODEX 200
  - TIGER 나스닥100
  - TIGER 미국MSCI리츠
- [ ] 각 종목별 `avgPrice`, `currentPrice`, `quantity`, `annualDividendPerShare` 값 설정
- [ ] `isProfit` 계산 포함

### 2-3. `lib/mock/transactions.ts` 작성
- [ ] Mock 거래 내역 최소 50개 작성 (날짜 역순)
- [ ] 종목별 분산 배치

### 2-4. `lib/mock/news.ts` 작성
- [ ] Mock 뉴스 5개 작성
- [ ] `[Mock]` 접두사 포함 (실제 데이터와 구분)

### 2-5. `lib/mock/briefing.ts` 작성
- [ ] Mock AI 브리핑 텍스트 작성
- [ ] 면책 문구 포함 (`※ 본 내용은 정보 제공용...`)

---

## PHASE 3 — 공통 컴포넌트 (원자 단위)

> 각 컴포넌트마다 `.tsx` + `.module.css` + `.stories.tsx` 세트로 작성

### 3-1. `components/Button/`
- [ ] `Button.tsx` — Props: `variant('primary'|'secondary'|'ghost')`, `size('sm'|'md'|'lg')`, `isLoading`, `disabled`, `ariaLabel`
- [ ] `Button.module.css` — `min-height: var(--spacing-touch-min)` 필수
- [ ] `Button.stories.tsx` — Primary / Secondary / Ghost / Loading / Disabled 상태

### 3-2. `components/Badge/`
- [ ] `Badge.tsx` — Props: `label`, `variant('up'|'down'|'neutral')`
- [ ] `Badge.module.css` — 상승=빨강, 하락=파랑 토큰 적용
- [ ] `Badge.stories.tsx` — Up / Down / Neutral 상태

### 3-3. `components/Card/`
- [ ] `Card.tsx` — Props: `children`, `padding?`, `onClick?`
- [ ] `Card.module.css` — `border-radius: var(--radius-card)`
- [ ] `Card.stories.tsx` — Default / Clickable 상태

### 3-4. `components/ETFTag/`
- [ ] `ETFTag.tsx` — 종목명 + 등락 Badge 조합
- [ ] `ETFTag.module.css`
- [ ] `ETFTag.stories.tsx` — Profit / Loss 상태

### 3-5. `components/PriceText/`
- [ ] `PriceText.tsx` — Props: `value`, `isProfit`, `showSign?`
- [ ] `PriceText.module.css` — `.up { color: var(--color-stock-up) }` / `.down { color: var(--color-stock-down) }`
- [ ] `PriceText.stories.tsx` — Profit / Loss / NoSign 상태
- [ ] ⚠️ 상승=빨강, 하락=파랑 반드시 확인

### 3-6. `components/SkeletonUI/`
- [ ] `SkeletonUI.tsx` — Props: `width?`, `height?`, `borderRadius?`
- [ ] `SkeletonUI.module.css` — `animate-pulse` 스타일 (로딩 전용, 경고 배너 사용 금지)
- [ ] `SkeletonUI.stories.tsx` — Text / Card / Circle 형태

### 3-7. `components/ErrorBoundary/` ← **신규 (P1)**
- [ ] `ErrorBoundary.tsx` — class component 기반 (`componentDidCatch`)
- [ ] Props: `fallback: ReactNode`, `children`
- [ ] `ErrorBoundary.module.css`
- [ ] 사용 위치: `AIBriefing`, `NewsFeed` 감싸기
- [ ] `ErrorBoundary.stories.tsx` — Normal / Error 상태

### 3-8. `components/Toast/` ← **신규 (P1)**
- [ ] `Toast.tsx` — Props: `message`, `type('success'|'error')`, `duration?`
- [ ] `Toast.module.css` — 하단 고정, `min-height: var(--spacing-touch-min)`
- [ ] 자동 소멸 타이머 (`setTimeout`, 기본 2000ms)
- [ ] `Toast.stories.tsx` — Success / Error 상태
- [ ] 사용 위치: `BuyRecordButton` 완료/실패, `MyGoalBanner` 저장 완료

---

## PHASE 4 — 앱 레이아웃 뼈대

### 4-1. 바텀 탭 네비게이션
- [ ] `components/BottomNav/BottomNav.tsx` 작성
- [ ] 탭 항목: 홈(대시보드) / 포트폴리오 / 설정
- [ ] `min-height: var(--spacing-touch-min)` 각 탭 버튼에 적용
- [ ] `user-select: none` 적용 (`.tab-bar`)
- [ ] `aria-label` 각 탭 버튼에 적용
- [ ] `env(safe-area-inset-bottom)` SafeArea 대응

### 4-2. 페이지 라우팅 연결
- [ ] `app/dashboard/page.tsx` 생성 (빈 Server Component)
- [ ] `app/portfolio/page.tsx` 생성
- [ ] `app/settings/page.tsx` 생성
- [ ] 각 페이지에 `<main>` 시맨틱 태그 적용
- [ ] 바텀 탭 클릭 시 라우팅 동작 확인

---

## PHASE 5 — 핵심 기능 컴포넌트

### 5-1. `lib/dividend-calculator.ts` 작성
- [ ] `calcDividendProjection(holdings, yearsToProject, dailyPurchase, monthlyPurchaseShares)` 함수
  - ⚠️ `dailyPurchase` 기본값 **`false`** — 기존 `true`에서 변경 (과대 산정 방지)
  - ⚠️ `monthlyPurchaseShares: number = 0` 파라미터 추가 (사용자 입력 기반 계산)
- [ ] 배당 성장률 복리 계산: `Math.pow(1 + rate, years)`
- [ ] `calcAllProjections(holdings)` — [3, 5, 10, 20]년 한 번에 계산
- [ ] `conservative` 모드(현재 보유만) vs `dailyPurchase` 모드 분기 로직
- [ ] 단위 테스트: Mock ETF 1종목으로 계산 결과 콘솔 확인
- [ ] `DividendTimeline` 렌더 시 계산 가정값 문구 노출 연동 준비
  - 예) "연 5% 성장률 · 현재 보유 기준 시뮬레이션"

### 5-2. `GoalGauge` (CSS animation 직접 구현 ⭐ 핵심)
- [ ] `app/dashboard/_components/GoalGauge.tsx` — `'use client'`
- [ ] `requestAnimationFrame` + `useState(0)` 마운트 애니메이션 구현
- [ ] `useEffect` cleanup — `cancelAnimationFrame` 처리
- [ ] `GoalGauge.module.css` — `transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1)`
- [ ] `.fill` 초기값 `width: 0%` → percentage로 전환
- [ ] `role="progressbar"` + `aria-valuenow/min/max` 접근성
- [ ] `stories/GoalGauge.stories.tsx` — Empty(0%) / InProgress(38%) / Complete(100%)

### 5-3. `DividendTimeline` (CSS grid 직접 구현)
- [ ] `app/dashboard/_components/DividendTimeline.tsx`
- [ ] `const YEARS = [3, 5, 10, 20] as const` 타입 안전하게 선언
- [ ] `DividendTimeline.module.css` — `grid-template-columns: repeat(4, 1fr)`
- [ ] 월 배당금 `Math.round(p.monthlyDividend / 10000)`만원 표시
- [ ] 카드 하단 계산 가정값 문구 표시 ← **신규**
  - 예) `"연 5% 성장률 · 현재 보유 기준 시뮬레이션"`
- [ ] `stories/DividendTimeline.stories.tsx` — 금액 있음 / 금액 없음(0원) 상태

### 5-4. `TodayImpact` (오늘 1주 매수 시 +N원)
- [ ] `app/dashboard/_components/TodayImpact.tsx`
- [ ] 현재 projections vs 1주 추가 시 projections 차이값 계산
- [ ] 3/5/10/20년 각각 `+N원 ↑` 표시
- [ ] `PriceText` 컴포넌트 활용 (빨강 색상)
- [ ] `stories/TodayImpact.stories.tsx`

### 5-5. `ETFPieChart` (SVG 직접 구현 ⭐ 면접 어필)
- [ ] `app/portfolio/_components/ETFPieChart.tsx` — `'use client'`
- [ ] ⚠️ **빈 상태 얼리 리턴 처리** ← **신규 (P1 NaN 가드)**
  ```tsx
  if (holdings.length === 0) return <EmptyPortfolio />
  const total = holdings.reduce(...)
  if (total === 0) return null
  ```
- [ ] `polarToCartesian` 헬퍼 함수 구현
- [ ] `describeArc` SVG path 생성 함수 구현
- [ ] `--color-chart-1 ~ 5` CSS Variables 슬라이스 색상 적용
- [ ] 클릭 시 `activeIndex` 상태 — 해당 슬라이스 외 `opacity: 0.4`
- [ ] 클릭된 슬라이스 종목명 + 비중% 상세 표시
- [ ] `aria-label` 각 슬라이스에 적용 (`${ticker} ${비중}%`)
- [ ] `ETFPieChart.module.css` 작성
- [ ] `stories/ETFPieChart.stories.tsx` — **Empty** / 1종목(100%) / 3종목 / 5종목 ← Empty 상태 추가

### 5-6. `TransactionHistory` (react-window)
- [ ] `app/portfolio/_components/TransactionHistory.tsx`
- [ ] `FixedSizeList` — `height={400}`, `itemSize={60}`
- [ ] 날짜 / 종목명 / 매수가 / 손익 표시
- [ ] `PriceText` 컴포넌트 활용 (조건부 색상)
- [ ] 0건 빈 상태 UI 처리 ← **신규**
- [ ] `stories/TransactionHistory.stories.tsx` — 빈 상태 / 50개 / 2500개 상태

### 5-7. `MyGoalBanner` (Client Component)
- [ ] `app/dashboard/_components/MyGoalBanner.tsx` — `'use client'`
- [ ] Empty / Display / Editing 3가지 상태 `useState`로 분리
- [ ] `textarea` — `autoFocus`, `maxLength={100}`, `word-break: keep-all`, `white-space: pre-wrap`
- [ ] 글자 수 카운터 실시간 표시 (`{draft.length}/100`)
- [ ] `aria-label="투자 다짐 문구 입력"` 접근성
- [ ] 저장 버튼 `min-height: var(--spacing-touch-min)` 적용
- [ ] `MyGoalBanner.module.css` — `--color-bg-goal` 배너 배경색
- [ ] ⚠️ **`onSave` prop 제거 → Server Action으로 교체** ← **신규 (P1)**
  - `app/actions/goal.ts` — `'use server'` 선언, Supabase upsert 로직
  - `MyGoalBanner` 내부에서 `saveGoalAction(text)` 직접 호출
  - 저장 성공 시 `Toast` 컴포넌트로 피드백
- [ ] `stories/MyGoalBanner.stories.tsx` — Empty / Display / Editing 3상태

### 5-8. `ETFAddForm` (ETF 종목 추가 폼)
- [ ] `app/portfolio/_components/ETFAddForm.tsx` — `'use client'`
- [ ] 입력 필드: 종목명, 평단가, 수량, 1주당 연간 배당금
- [ ] TypeScript 유효성 검사 — 숫자 필드 `NaN` 방지
- [ ] 빈 값 제출 방지
- [ ] `localStorage` 임시 저장 (Supabase 연동 전)
- [ ] 저장 완료 시 폼 초기화

### 5-9. `BuyRecordButton` (매수 기록 버튼)
- [ ] `app/dashboard/_components/BuyRecordButton.tsx` — `'use client'`
- [ ] ⚠️ **낙관적 업데이트 적용** ← **신규 (P1)**
  - 클릭 즉시 `onSuccess()` 호출 → GoalGauge 퍼센트 즉각 반영
  - `useTransition` 으로 백그라운드 Supabase INSERT
  - INSERT 실패 시 `onRollback()` 호출 + `Toast` 에러 메시지
- [ ] 로딩 상태 — `Button` 컴포넌트 `isLoading` 활용
- [ ] 완료 시 → `Toast` success "🎉 오늘 1주 완료!" ← Toast로 교체
- [ ] `aria-label="오늘 ETF 1주 매수 기록"` 접근성
- [ ] `stories/BuyRecordButton.stories.tsx` — Idle / Loading / Success / Error ← **신규**

### 5-10. `app/actions/goal.ts` Server Action ← **신규**
- [ ] `'use server'` 선언
- [ ] `saveGoalAction(message: string)` 함수
- [ ] 서버에서 Supabase 세션 기반 userId 추출 (클라이언트 수신 금지)
- [ ] `user_settings` upsert 처리

### 5-11. `app/actions/transaction.ts` Server Action ← **신규**
- [ ] `'use server'` 선언
- [ ] `addTransactionAction(etfId: string)` 함수
- [ ] 서버에서 세션 기반 userId 추출
- [ ] `transactions` INSERT + `etf_holdings` avg_price 재계산 UPDATE

---

## PHASE 6 — 대시보드 화면 조립

### 6-1. `app/dashboard/page.tsx` 조립
- [ ] Server Component로 작성
- [ ] `MyGoalBanner` 최상단 배치
- [ ] `DividendTimeline` 배치
- [ ] `GoalGauge` 배치 — 목표 달성률 % 계산 후 전달
- [ ] `TodayImpact` 배치
- [ ] `BuyRecordButton` 배치
- [ ] `NewsFeed` 배치 (Phase 7에서 구현, 임시 Skeleton 대체)
- [ ] `AIBriefing` 배치 (Phase 7에서 구현, 임시 Skeleton 대체)
- [ ] `ErrorBoundary`로 `AIBriefing`, `NewsFeed` 감싸기 ← **신규**
- [ ] `<main>` 시맨틱 태그 + 전체 스크롤 UX 확인
- [ ] ETF 0종목 온보딩 상태 분기 처리 ← **신규**
  - 첫 방문 시 "첫 ETF 종목 추가하기 →" CTA 카드 노출

### 6-2. `app/portfolio/page.tsx` 조립
- [ ] `ETFPieChart` 배치 (0종목 Empty 상태 포함)
- [ ] 보유 종목 카드 리스트 배치 (`ETFTag` + `PriceText` 조합)
- [ ] `TransactionHistory` 배치
- [ ] `ETFAddForm` 배치 (하단 고정 or 별도 페이지)

### 6-3. Mock 데이터 연결 확인
- [ ] `lib/mock/etf.ts` → 대시보드 계산 로직 연결
- [ ] `lib/mock/transactions.ts` → `TransactionHistory` 연결
- [ ] 전체 화면 스크롤 흐름 점검 (모바일 실기기)

---

## PHASE 7 — API 연동 컴포넌트

### 7-1. `lib/news.ts` 작성
- [ ] `rss-parser` import
- [ ] `timeout: 5000` 옵션 추가 ← **신규 (P2 안전장치)**
- [ ] User-Agent 헤더 설정 ← **신규**
- [ ] `HANKYUNG_RSS_URL` 상수 정의
- [ ] `MOCK_FALLBACK_NEWS` 배열 정의 (`[Mock]` 접두사)
- [ ] `fetchNews()` — try/catch + Mock 폴백 반환
- [ ] 반환 타입: `{ data: NewsItem[], isMock: boolean }`

### 7-2. `app/api/news/route.ts` 작성
- [ ] `fetchNews()` import 후 GET handler 작성
- [ ] `NextResponse.json(result)` 반환

### 7-3. `NewsFeed` 컴포넌트
- [ ] `app/dashboard/_components/NewsFeed.tsx` — Server Component
- [ ] `fetchNews()` 직접 import (HTTP 재호출 금지)
- [ ] `isMock` 상태 — 정적 배너 UI 표시 (`animate-pulse` 금지)
- [ ] `NewsCard` 서브 컴포넌트 — 제목, 날짜, 링크
- [ ] `<article>` 시맨틱 태그 + `aria-label` 적용
- [ ] `.news-content` 클래스 — `user-select: text` 확인
- [ ] `stories/NewsFeed.stories.tsx` — WithData / MockFallback / Loading 상태

### 7-4. `lib/llm-chain.ts` 작성
- [ ] `summarizeNews(newsText)` — gpt-4o-mini 호출
- [ ] `generateBriefing(summary, holdings)` — Claude Sonnet 호출
- [ ] `MOCK_BRIEFING` 상수 — 면책 문구 포함
- [ ] `generateETFBriefing(newsItems, holdings, userTier)` 메인 함수
  - [ ] `userTier === 'free'` → Mock 반환
  - [ ] `userTier === 'pro'` → 실제 체이닝 호출
- [ ] AI 비용 로깅 — `ai_usage_logs` INSERT (fire-and-forget) ← **신규 (P2)**

### 7-5. `app/api/ai-briefing/route.ts` 작성
- [ ] ⚠️ **`userId` 클라이언트 수신 금지 → JWT 기반 추출로 변경** ← **신규 (P0)**
  ```typescript
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id
  ```
- [ ] Free 티어 월 제한 — `increment_ai_call` DB Function RPC 호출 ← **신규 (P0 Race Condition 대응)**
- [ ] `generateETFBriefing` 호출
- [ ] `maxDuration = 60` route segment config 추가 (Vercel 타임아웃 대응) ← **신규 (P2)**

### 7-6. `AIBriefing` 컴포넌트
- [ ] `app/dashboard/_components/AIBriefing.tsx` — `'use client'`
- [ ] Loading 상태 — 진행 단계 표시 ("뉴스 분석 중..." → "브리핑 생성 중...") ← **신규**
- [ ] Success 상태 — 브리핑 텍스트 + 면책 문구
- [ ] Error 상태 — "AI 브리핑을 불러오지 못했습니다" 메시지
- [ ] `stories/AIBriefing.stories.tsx` — Loading / Success / Error 3상태

### 7-7. `lib/supabase.ts` — 클라이언트/서버 분리 ← **전면 수정 (P1)**
- [ ] `createClient()` — 브라우저용 (`@supabase/ssr` `createBrowserClient`)
- [ ] `createServerSupabaseClient()` — 서버용 (`createServerClient` + cookies)
- [ ] `createAdminClient()` — Route Handler 전용 (`service_role` 키)
- [ ] 기존 단일 `supabase` export 제거

### 7-8. Supabase 연동
- [ ] Supabase 프로젝트 생성
- [ ] SQL Editor에서 스키마 실행 (`03_BE.md` 참고)
- [ ] `increment_ai_call` DB Function 실행 ← **신규 (Race Condition 대응)**
- [ ] `user_settings`에 `goal_monthly_amount`, `daily_purchase_enabled` 컬럼 추가 ← **신규**
- [ ] `ETFAddForm` → `localStorage`에서 Supabase로 마이그레이션
- [ ] `BuyRecordButton` → `addTransactionAction` Server Action 연동 (avg_price 재계산 포함)
- [ ] `MyGoalBanner` → `saveGoalAction` Server Action 연동

---

## PHASE 8 — 완성도 & 접근성

### 8-1. 접근성 전체 점검
- [ ] 모든 인터랙티브 요소 `aria-label` 확인
- [ ] 모든 이미지/아이콘 `alt` 또는 `aria-hidden="true"` 확인
- [ ] 키보드 Tab 탐색 순서 논리적 구성 확인
- [ ] 색상 명도 대비 WCAG AA 기준 확인 (텍스트 4.5:1 이상)
- [ ] 터치 영역 44px 미달 항목 수정
- [ ] 포커스 스타일 visible 처리 (outline 제거된 곳 복구)
- [ ] `<article>`, `<section>`, `<nav>`, `<main>` 시맨틱 태그 점검

### 8-2. 모바일 웹뷰 디테일 점검
- [ ] iOS Safari 실기기 테스트
- [ ] Android Chrome 실기기 테스트
- [ ] `env(safe-area-inset-bottom)` 바텀 SafeArea 대응 확인
- [ ] 가로 스크롤 발생 여부 확인 (`overflow-x: hidden`)
- [ ] `TransactionHistory` Windowing 스크롤 버벅임 확인

### 8-3. 에러 / 엣지케이스 처리
- [ ] ETF 0종목 빈 상태 — Empty State UI (`ETFPieChart`, `DividendTimeline`)
- [ ] `ETFPieChart` — `holdings.length === 0` 또는 `total === 0` NaN 가드 확인 ← **신규**
- [ ] AI 브리핑 API 실패 시 `ErrorBoundary` fallback UI 확인 ← **신규**
- [ ] RSS 뉴스 실패 시 Mock 폴백 배너 노출 확인
- [ ] `TransactionHistory` 거래 내역 0건 빈 상태 UI
- [ ] `MyGoalBanner` 목표 문구 없음 빈 상태 UI

### 8-4. Storybook 추가 stories 점검 ← **신규 섹션**
- [ ] `ETFPieChart.stories.tsx` — Empty 상태 추가 확인
- [ ] `BuyRecordButton.stories.tsx` — Idle / Loading / Success / Error 4상태 확인
- [ ] `ErrorBoundary.stories.tsx` — Normal / Error 상태 확인
- [ ] `Toast.stories.tsx` — Success / Error 상태 확인

---

## PHASE 9 — Storybook 배포 & README

### 9-1. Storybook 최종 정리
- [ ] 전체 stories 파일 누락 여부 확인
- [ ] 각 컴포넌트 최소 3가지 상태 작성 확인
- [ ] Storybook 빌드 에러 없음 확인 (`npm run build-storybook`)
- [ ] GitHub Pages 배포 설정 (`.github/workflows/storybook.yml`)
- [ ] 배포 URL 정상 접속 확인

### 9-2. README 작성
- [ ] 프로젝트 소개 + 스크린샷 (모바일 화면 캡처)
- [ ] 앱 지향점 4가지 (마일스톤/동기부여/소비방지/습관형성)
- [ ] 기술 스택 표
- [ ] LLM 비용 절감 계산 테이블 (약 80% 절감 근거)
- [ ] 로컬 실행 방법 (`npm install` / `.env.local` 설정 / `npm run dev`)
- [ ] Storybook 링크
- [ ] Vercel 배포 링크

### 9-3. 이력서 제출 준비
- [ ] Vercel 배포 URL 최종 동작 확인
- [ ] Storybook GitHub Pages URL 확인
- [ ] 유튜브 3분 데모 영상 촬영 + 업로드
- [ ] 이력서 프로젝트 항목에 GitHub + Vercel + Storybook + 유튜브 링크 4종 첨부

---

## PHASE 10 — 인증 플로우 ← **신규 Phase**

> 02_FE.md 검토에서 발견된 인증 미들웨어 누락 대응
> PHASE 0-5와 병행 또는 PHASE 7 완료 후 진행

### 10-1. 로그인 페이지
- [ ] `app/login/page.tsx` — Supabase 소셜 로그인 UI (Google / Kakao 중 택1)
- [ ] 로그인 버튼 `min-height: var(--spacing-touch-min)` 적용
- [ ] 로그인 성공 시 `/dashboard` 리다이렉트
- [ ] 로그인 페이지는 인증 미들웨어 제외 경로로 설정

### 10-2. 세션 관리
- [ ] `app/layout.tsx` — Supabase `auth.onAuthStateChange` 리스너 등록
- [ ] 세션 만료 시 `/login` 자동 리다이렉트
- [ ] 설정 페이지에서 로그아웃 버튼 구현

### 10-3. 인증 상태 기반 UI 분기
- [ ] `app/settings/page.tsx` — 로그인 유저 정보(이메일, 가입일) 표시
- [ ] `user_settings` 초기화 — 최초 로그인 시 `user_settings` row 자동 생성
  - Supabase Auth Webhook 또는 첫 API 호출 시 upsert 처리

---

## 📊 전체 진행 현황

| Phase | 내용 | 상태 |
|---|---|---|
| 0 | 프로젝트 초기 세팅 | ⬜ 미시작 |
| 1 | 디자인 토큰 & 전역 스타일 | ⬜ 미시작 |
| 2 | TypeScript 타입 & Mock 데이터 | ⬜ 미시작 |
| 3 | 공통 컴포넌트 (원자 단위) | ⬜ 미시작 |
| 4 | 앱 레이아웃 뼈대 | ⬜ 미시작 |
| 5 | 핵심 기능 컴포넌트 | ⬜ 미시작 |
| 6 | 대시보드 화면 조립 | ⬜ 미시작 |
| 7 | API 연동 컴포넌트 | ⬜ 미시작 |
| 8 | 완성도 & 접근성 | ⬜ 미시작 |
| 9 | Storybook 배포 & README | ⬜ 미시작 |
| 10 | 인증 플로우 | ⬜ 미시작 |

> 진행 중: ⏳ / 완료: ✅ / 미시작: ⬜

---

## ⚠️ 작업 시 Claude에게 항상 전달할 것

```
이 프로젝트의 규칙:
1. Tailwind 사용 금지 — CSS Module + CSS Variables만 사용
2. 상승(+) = 빨강(--color-stock-up), 하락(-) = 파랑(--color-stock-down)
3. ETFPieChart / GoalGauge / DividendTimeline — 라이브러리 금지, 직접 구현
4. user-select: none 전역 적용 금지
5. animate-pulse 경고 배너 사용 금지
6. Server Component에서 내부 /api/* HTTP 재호출 금지 → lib/ 직접 import
7. react-window는 TransactionHistory에만 적용
8. 모든 textarea에 maxLength={100} 필수
9. 터치 영역 min-height: var(--spacing-touch-min) 44px 필수
10. 모든 컴포넌트에 Storybook stories 최소 3가지 상태 작성
11. Route Handler에서 userId 클라이언트 수신 금지 → JWT 세션에서 추출 ← 추가
12. Server Component → Client Component로 함수 prop 전달 금지 → Server Action 사용 ← 추가
13. recharts 설치 금지 ← 추가
```
