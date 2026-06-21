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
- [x] `npx create-next-app@latest isa-etf-portfolio --typescript --app --src-dir`
- [x] Tailwind 설치 여부 → **No** 선택
- [x] GitHub 레포 생성 + 첫 커밋 (`git init`, `main` 브랜치)
- [x] Vercel 연결 (GitHub 레포 import)

### 0-2. 패키지 설치
- [x] `npm install react-window @supabase/supabase-js @supabase/ssr rss-parser`
  - ⚠️ `recharts` 설치 금지 — ETFPieChart는 SVG 직접 구현
  - ⚠️ `@supabase/ssr` 추가 — 서버/클라이언트 클라이언트 분리에 필수
- [x] `npm install @anthropic-ai/sdk` — AI 브리핑 생성 (OpenAI 대체)
- [x] `npm install --save-dev @storybook/nextjs storybook @types/react-window`
- [x] Storybook 초기화 (`npx storybook@latest init`)
- [x] `npm run storybook` 정상 실행 확인

### 0-3. 폴더 구조 생성
- [x] `app/dashboard/_components/` 폴더 생성
- [x] `app/portfolio/_components/` 폴더 생성
- [x] `app/settings/` 폴더 생성
- [x] `app/login/` 폴더 생성 ← **신규** (소셜 로그인 페이지)
- [x] `app/actions/` 폴더 생성 ← **신규** (Server Actions)
- [x] `components/` 폴더 생성 (공통 컴포넌트)
- [x] `components/ErrorBoundary/` 폴더 생성 ← **신규**
- [x] `components/Toast/` 폴더 생성 ← **신규**
- [x] `lib/mock/` 폴더 생성
- [x] `types/` 폴더 생성
- [x] `styles/` 폴더 생성
- [x] `stories/` 폴더 생성

### 0-4. 환경 변수
- [x] `.env.local` 파일 생성
- [ ] `.env.local` → `.gitignore`에 포함 확인
- [ ] `ANTHROPIC_API_KEY` 입력 (claude-haiku-4-5 브리핑 생성용)
  - ⚠️ `OPENAI_API_KEY` 불필요 — OpenAI 의존성 제거됨
- [x] `NEXT_PUBLIC_SUPABASE_URL` 입력
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 입력
- [x] `SUPABASE_SERVICE_ROLE_KEY` 입력 ← **신규** (서버 전용, NEXT_PUBLIC_ 없음) — 템플릿 생성, 실제 값 필요
- [x] `HANKYUNG_RSS_URL` 입력 — 기본값 설정 완료

### 0-5. 인증 미들웨어 세팅 ← **신규 섹션 (P0)**
- [x] `middleware.ts` 루트 레벨에 생성
- [x] `/dashboard`, `/portfolio`, `/settings` — 비로그인 시 `/login` 리다이렉트
- [x] `export const config = { matcher: [...] }` 경로 설정
- [x] `app/login/page.tsx` 생성 (Supabase 소셜 로그인 UI)
- [x] `app/error.tsx` 생성 (전역 에러 페이지)
- [x] `app/not-found.tsx` 생성 (404 페이지)

---

## PHASE 1 — 디자인 토큰 & 전역 스타일

### 1-1. Figma 작업 (코드 작업 전 선행)
- [ ] Figma Color Variables 정의 (tokens.css와 1:1 매핑)
- [ ] Figma Typography Variables 정의
- [ ] Figma Spacing Variables 정의
- [ ] 대시보드 메인 화면 와이어프레임
- [ ] 포트폴리오 화면 와이어프레임

### 1-2. `styles/tokens.css` 작성
- [x] `--color-stock-up: #E53E3E` (상승 — 빨강)
- [x] `--color-stock-down: #2B6CB0` (하락 — 파랑)
- [x] `--color-bg-primary / secondary / goal` 정의
- [x] `--color-text-primary / secondary` 정의
- [x] `--color-border / border-goal` 정의
- [x] `--color-chart-1 ~ 5` (파이차트 슬라이스 색상) 정의
- [x] `--spacing-touch-min: 44px` 정의
- [x] `--radius-card: 12px / --radius-button: 8px` 정의
- [x] `--font-size-label / body / title / large` 정의
- [x] `--font-weight-regular / medium / bold` 정의

### 1-3. `styles/globals.css` 작성
- [x] `@import './tokens.css'` 연결
- [x] `* { box-sizing: border-box; margin: 0; padding: 0; }` 리셋
- [x] `body` — `touch-action: manipulation` (핀치줌 방지)
- [x] `body` — `-webkit-tap-highlight-color: transparent` (iOS 잔상 제거)
- [x] `body` — `max-width: 430px; margin: 0 auto` (모바일 웹뷰 기준)
- [x] `body` — `font-family: -apple-system, Pretendard, sans-serif`
- [x] `.news-content, .etf-ticker-code, .dividend-value, .price-value` → `user-select: text`
- [x] `.bottom-sheet-handle, .app-nav-bar, .tab-bar` → `user-select: none`

---

## PHASE 2 — TypeScript 타입 & Mock 데이터

### 2-1. `types/etf.ts` 작성
- [x] `ETFHolding` 타입 정의
- [x] `Transaction` 타입 정의
- [x] `DividendProjection` 타입 (`year: 3 | 5 | 10 | 20`)
- [x] `NewsItem` 타입 정의
- [x] `UserTier` 타입 (`'free' | 'pro'`)

### 2-2. `lib/mock/etf.ts` 작성
- [x] Mock ETF 종목 5개 작성
  - TIGER 미국배당다우존스
  - TIGER 미국S&P500
  - KODEX 200
  - TIGER 나스닥100
  - TIGER 미국MSCI리츠
- [x] 각 종목별 `avgPrice`, `currentPrice`, `quantity`, `annualDividendPerShare` 값 설정
- [x] `isProfit` 계산 포함

### 2-3. `lib/mock/transactions.ts` 작성
- [x] Mock 거래 내역 최소 50개 작성 (날짜 역순)
- [x] 종목별 분산 배치

### 2-4. `lib/mock/news.ts` 작성
- [x] Mock 뉴스 5개 작성
- [x] `[Mock]` 접두사 포함 (실제 데이터와 구분)

### 2-5. `lib/mock/briefing.ts` 작성
- [x] Mock AI 브리핑 텍스트 작성
- [x] 면책 문구 포함 (`※ 본 내용은 정보 제공용...`)

---

## PHASE 3 — 공통 컴포넌트 (원자 단위)
> 각 컴포넌트마다 `.tsx` + `.module.css` + `.stories.tsx` 세트로 작성

### 3-1. `components/Button/`
- [x] `Button.tsx` — Props: `variant('primary'|'secondary'|'ghost')`, `size('sm'|'md'|'lg')`, `isLoading`, `disabled`, `ariaLabel`
- [x] `Button.module.css` — `min-height: var(--spacing-touch-min)` 필수
- [x] `Button.stories.tsx` — Primary / Secondary / Ghost / Loading / Disabled 상태

### 3-2. `components/Badge/`
- [x] `Badge.tsx` — Props: `label`, `variant('up'|'down'|'neutral')`
- [x] `Badge.module.css` — 상승=빨강, 하락=파랑 토큰 적용
- [x] `Badge.stories.tsx` — Up / Down / Neutral 상태

### 3-3. `components/Card/`
- [x] `Card.tsx` — Props: `children`, `padding?`, `onClick?`
- [x] `Card.module.css` — `border-radius: var(--radius-card)`
- [x] `Card.stories.tsx` — Default / Clickable 상태

### 3-4. `components/ETFTag/`
- [x] `ETFTag.tsx` — 종목명 + 등락 Badge 조합
- [x] `ETFTag.module.css`
- [x] `ETFTag.stories.tsx` — Profit / Loss 상태

### 3-5. `components/PriceText/`
- [x] `PriceText.tsx` — Props: `value`, `isProfit`, `showSign?`
- [x] `PriceText.module.css` — `.up { color: var(--color-stock-up) }` / `.down { color: var(--color-stock-down) }`
- [x] `PriceText.stories.tsx` — Profit / Loss / NoSign 상태
- [x] ⚠️ 상승=빨강, 하락=파랑 반드시 확인

### 3-6. `components/SkeletonUI/`
- [x] `SkeletonUI.tsx` — Props: `width?`, `height?`, `borderRadius?`
- [x] `SkeletonUI.module.css` — shimmer 애니메이션 (animate-pulse 금지)
- [x] `SkeletonUI.stories.tsx` — Text / Card / Circle 형태

### 3-7. `components/ErrorBoundary/` ← **신규 (P1)**
- [x] `ErrorBoundary.tsx` — class component 기반 (`componentDidCatch`)
- [x] Props: `fallback: ReactNode`, `children`
- [x] `ErrorBoundary.module.css`
- [x] 사용 위치: `AIBriefing`, `NewsFeed` 감싸기
- [x] `ErrorBoundary.stories.tsx` — Normal / Error 상태

### 3-8. `components/Toast/` ← **신규 (P1)**
- [x] `Toast.tsx` — ToastContainer + ToastContext
- [x] `Toast.module.css` — 하단 고정, `min-height: var(--spacing-touch-min)`
- [x] 자동 소멸 타이머 (2500ms)
- [x] `Toast.stories.tsx` — Success / Error 상태
- [x] 사용 위치: `BuyRecordButton` 완료/실패, `MyGoalBanner` 저장 완료

---

## PHASE 4 — 앱 레이아웃 뼈대
### 4-1. 바텀 탭 네비게이션
- [x] `components/BottomNav/BottomNav.tsx` 작성
- [x] 탭 항목: 홈(대시보드) / 포트폴리오 / 설정
- [x] `min-height: var(--spacing-touch-min)` 각 탭 버튼에 적용
- [x] `user-select: none` 적용 (`.tab-bar`)
- [x] `aria-label` 각 탭 버튼에 적용
- [x] `env(safe-area-inset-bottom)` SafeArea 대응

### 4-2. 페이지 라우팅 연결
- [x] `app/dashboard/page.tsx` 생성
- [x] `app/portfolio/page.tsx` 생성
- [x] `app/settings/page.tsx` 생성
- [x] 각 페이지에 `<main>` 시맨틱 태그 적용
- [ ] 바텀 탭 클릭 시 라우팅 동작 확인 (실기기 테스트 필요)

---

## PHASE 5 — 핵심 기능 컴포넌트
### 5-1. `lib/dividend-calculator.ts` 작성
- [x] `calcDividendProjection(holdings, yearsToProject, dailyPurchase, monthlyPurchaseShares)` 함수
  - ⚠️ `dailyPurchase` 기본값 **`false`** — 기존 `true`에서 변경 (과대 산정 방지)
  - ⚠️ `monthlyPurchaseShares: number = 0` 파라미터 추가 (사용자 입력 기반 계산)
- [x] 배당 성장률 복리 계산: `Math.pow(1 + rate, years)`
- [x] `calcAllProjections(holdings)` — [3, 5, 10, 20]년 한 번에 계산
- [x] `conservative` 모드(현재 보유만) vs `dailyPurchase` 모드 분기 로직
- [x] `getProjectionLabel()` 가정값 문구 함수

### 5-2. `GoalGauge` (CSS animation 직접 구현 ⭐ 핵심)
- [x] `app/dashboard/_components/GoalGauge.tsx` — `'use client'`
- [x] `requestAnimationFrame` + `useState(0)` 마운트 애니메이션 구현
- [x] `useEffect` cleanup — `cancelAnimationFrame` 처리
- [x] `GoalGauge.module.css` — `transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1)`
- [x] `.fill` 초기값 `width: 0%` → percentage로 전환
- [x] `role="progressbar"` + `aria-valuenow/min/max` 접근성
- [x] `GoalGauge.stories.tsx` — Empty(0%) / HalfWay(50%) / NearGoal(87%) / Achieved(100%)

### 5-3. `DividendTimeline` (CSS grid 직접 구현)
- [x] `app/dashboard/_components/DividendTimeline.tsx`
- [x] `const YEARS = [3, 5, 10, 20] as const` 타입 안전하게 선언
- [x] `DividendTimeline.module.css` — `grid-template-columns: repeat(4, 1fr)`
- [x] 월 배당금 `Math.round(p.monthlyDividend / 10000)`만원 표시
- [x] 카드 하단 계산 가정값 문구 표시
- [x] `DividendTimeline.stories.tsx` — Default / Empty 상태

### 5-4. `TodayImpact` (오늘 1주 매수 시 +N원)
- [x] `app/dashboard/_components/TodayImpact.tsx`
- [x] 현재 projections vs 1주 추가 시 projections 차이값 계산
- [x] 3/5/10/20년 각각 `+N원 ↑` 표시
- [x] `TodayImpact.stories.tsx`

### 5-5. `ETFPieChart` (SVG 직접 구현)
- [x] `app/portfolio/_components/ETFPieChart.tsx` — `'use client'`
- [x] ⚠️ **빈 상태 얼리 리턴 + NaN 가드** — `holdings.length === 0` / `total === 0`
- [x] `polarToCartesian` 헬퍼 함수 구현
- [x] `describeArc` SVG path 생성 함수 구현
- [x] `--color-chart-1 ~ 5` CSS Variables 슬라이스 색상 적용
- [x] 클릭 시 `activeIndex` 상태 — 해당 슬라이스 외 `opacity: 0.4`
- [x] 클릭된 슬라이스 종목명 + 비중% 상세 표시
- [x] `aria-label` 각 슬라이스에 적용
- [x] `ETFPieChart.stories.tsx` — Empty / SingleHolding / Default(5종목)

### 5-6. `TransactionHistory` (react-window v2)
- [x] `app/portfolio/_components/TransactionHistory.tsx`
- [x] react-window v2 `List` + `rowComponent` API (FixedSizeList 아님)
- [x] 날짜 / 종목명 / 매수가 / 손익 표시
- [x] 0건 빈 상태 UI 처리
- [x] `TransactionHistory.stories.tsx` — 빈 상태 / 거래내역 있음

### 5-7. `MyGoalBanner` (Client Component)
- [x] `app/dashboard/_components/MyGoalBanner.tsx` — `'use client'`
- [x] Empty / Display / Editing 3가지 상태 `useState`로 분리
- [x] `textarea` — `autoFocus`, `maxLength={100}`, `word-break: keep-all`, `white-space: pre-wrap`
- [x] 글자 수 카운터 실시간 표시 (`{draft.length}/100`)
- [x] `aria-label="투자 다짐 문구 입력"` 접근성
- [x] 저장 버튼 `min-height: var(--spacing-touch-min)` 적용
- [x] `MyGoalBanner.module.css` — `--color-bg-goal` 배너 배경색
- [x] Server Action `saveGoalAction` 직접 호출, Toast 피드백
- [x] `MyGoalBanner.stories.tsx` — Empty / WithGoal 상태

### 5-8. `ETFAddForm` (ETF 종목 추가 폼)
- [x] `app/portfolio/_components/ETFAddForm.tsx` — `'use client'`
- [x] 입력 필드: 종목명, 평단가, 수량, 1주당 연간 배당금
- [x] TypeScript 유효성 검사 — 숫자 필드 `NaN` 방지
- [x] 빈 값 제출 방지
- [ ] `localStorage` 임시 저장 (현재 인메모리 상태, Supabase 연동 후 교체)
- [x] 저장 완료 시 폼 초기화

### 5-9. `BuyRecordButton` (매수 기록 버튼)
- [x] `app/dashboard/_components/BuyRecordButton.tsx` — `'use client'`
- [x] ⚠️ **낙관적 업데이트 적용** — `onSuccess()` 즉시 호출, 실패 시 `onRollback()`
- [x] `useTransition` 으로 백그라운드 Server Action 호출
- [x] 로딩 상태 — `Button` 컴포넌트 `isLoading` 활용
- [x] Toast success / error 피드백
- [x] `aria-label="오늘 ETF 1주 매수 기록"` 접근성
- [x] `BuyRecordButton.stories.tsx`

### 5-10. `app/actions/goal.ts` Server Action ← **신규**
- [x] `'use server'` 선언
- [x] `saveGoalAction(message: string)` 함수
- [x] 서버에서 Supabase `getUser()` 기반 인증
- [x] `user_settings` upsert + `revalidatePath('/dashboard')`

### 5-11. `app/actions/transaction.ts` Server Action ← **신규**
- [x] `'use server'` 선언
- [x] `addTransactionAction(etfId: string)` 함수
- [x] 서버에서 `getUser()` 기반 인증
- [x] `transactions` INSERT + `etf_holdings` avg_price 재계산 UPDATE

---

## PHASE 6 — 대시보드 화면 조립

### 6-1. `app/dashboard/page.tsx` 조립
- [x] Server Component로 작성
- [x] `MyGoalBanner` 최상단 배치
- [x] `DividendTimeline` 배치
- [x] `DashboardInteractive` Client 래퍼 — GoalGauge + BuyRecordButton 낙관적 업데이트 공유
- [x] `TodayImpact` 배치
- [x] `NewsFeed` + `Suspense` / `ErrorBoundary` 감싸기
- [x] `AIBriefing` 배치
- [x] `<main>` 시맨틱 태그
- [ ] ETF 0종목 온보딩 CTA 카드 (현재 Mock 데이터 있으므로 실제 Supabase 연동 후 추가)

### 6-2. `app/portfolio/page.tsx` 조립
- [x] `ETFPieChart` 배치 (0종목 Empty 상태 포함)
- [x] 보유 종목 카드 리스트 배치 (`ETFTag` 조합)
- [x] `TransactionHistory` 배치
- [x] `ETFAddForm` 배치

### 6-3. Mock 데이터 연결 확인
- [x] `lib/mock/etf.ts` → 대시보드 계산 로직 연결
- [x] `lib/mock/transactions.ts` → `TransactionHistory` 연결
- [ ] 전체 화면 스크롤 흐름 점검 (모바일 실기기 필요)

---

## PHASE 7 — API 연동 컴포넌트
### 7-1. `lib/news.ts` 작성
- [x] `rss-parser` import
- [x] `timeout: 5000` 옵션 추가
- [x] User-Agent 헤더 설정
- [x] `HANKYUNG_RSS_URL` env 변수 사용
- [x] Mock 폴백 반환 (`isMock: true`)
- [x] 반환 타입: `{ data: NewsItem[], isMock: boolean }`

### 7-2. `app/api/news/route.ts` 작성
- [x] `fetchNews()` import 후 GET handler 작성
- [x] `NextResponse.json(result)` 반환

### 7-3. `NewsFeed` 컴포넌트
- [x] `app/dashboard/_components/NewsFeed.tsx` — Server Component
- [x] `fetchNews()` 직접 import (HTTP 재호출 금지)
- [x] `isMock` 상태 — 정적 배너 UI 표시
- [x] `<article>` 시맨틱 태그 + `aria-label` 적용
- [x] `.news-content` 클래스 — `user-select: text` 확인

### 7-4. `lib/llm-chain.ts` 작성
- [x] ~~`summarizeNews(newsText)` — gpt-4o-mini 호출~~ → **제거** (OpenAI 의존성 완전 제거)
- [x] ~~`generateBriefing(summary, holdings)` — claude-sonnet-4-6 호출~~ → **제거** (2단계 → 1단계 통합)
- [x] `generateETFBriefing(newsItems, holdings)` 메인 함수 ← **재구성**
  - [x] `@anthropic-ai/sdk` 공식 SDK 사용 (`new Anthropic({ apiKey })`)
  - [x] `claude-haiku-4-5` 단일 호출 — 뉴스 요약 + 브리핑 생성 통합 프롬프트
  - [x] `userTier` 인자 제거 — 무료/프로 구분 없이 모든 사용자 실제 AI 브리핑
  - [x] 실패 시 `MOCK_BRIEFING` 폴백 반환 (`tier: 'fallback'`)

### 7-5. `app/api/ai-briefing/route.ts` 작성
- [x] JWT 기반 `getUser()` 인증 (userId 클라이언트 수신 금지)
- [x] Free 티어 월 5회 제한 (DB 카운트 체크) — 초과 시 429 + `FREE_LIMIT_EXCEEDED` 반환
- [x] `generateETFBriefing(newsItems, holdings)` 호출 — `userTier` 인자 제거됨
- [x] 응답에 `remaining` 필드 추가 (무료 사용자 잔여 횟수, 프로는 `null`)
- [x] `export const maxDuration = 60` 타임아웃 설정

### 7-6. `AIBriefing` 컴포넌트
- [x] `app/dashboard/_components/AIBriefing.tsx` — `'use client'`
- [x] 상태: idle → summarizing → briefing → done / error / **limit_exceeded** ← 신규
- [x] 진행 단계 메시지 표시
- [x] **헤더 타이틀 옆 현재 날짜(년월일) 표기** — `<time>` 시맨틱 태그 ← 신규
- [x] **ⓘ 툴팁 아이콘** — 클릭 시 "월 5회 무료 제공" 이용 안내 노출 ← 신규
  - [x] 영역 밖 클릭 시 자동 닫힘 (`useEffect` + `mousedown` 이벤트)
  - [x] `aria-expanded` 접근성 적용
- [x] **429 응답 처리** — `limit_exceeded` 상태 전환 ← 신규
  - [x] "이번 달 무료 제공 횟수(5회) 초과" 안내 메시지 표시
  - [x] `새로 받기` 버튼 비활성화 (`disabled`)
- [x] `AIBriefing.stories.tsx` — Default / Empty 상태
  - [ ] LimitExceeded 상태 story 추가 권장

### 7-6-1. `MorningBriefingVideo` 날짜 표기 개선
- [x] `pubDate` 포맷에 `year: 'numeric'` 추가 — "6월 21일" → "2026년 6월 21일"

### 7-7. `lib/supabase.ts` — 클라이언트/서버 분리
- [x] `createClient()` — 브라우저용 (`createBrowserClient`)
- [x] `createServerSupabaseClient()` — 서버용 (`await cookies()`)
- [x] `createAdminClient()` — service_role 키 전용

### 7-8. Supabase 연동
- [x] Supabase 프로젝트 생성 및 환경변수 입력
- [x] SQL Editor에서 스키마 실행 (`03_BE.md` 참고)
- [x] `increment_ai_call` DB Function 실행
- [x] `user_settings` 초기화 로직 — `auth/callback/route.ts`에서 최초 로그인 시 upsert
- [x] `ETFAddForm` → Supabase INSERT 연동 — `app/actions/etf.ts` 생성, `portfolio/page.tsx` Server Component 전환
- [x] `BuyRecordButton` → Supabase INSERT 실제 연결 확인 — `addTransactionAction` 연결 완료, `dashboard/page.tsx` 실제 ETF ID 로드
- [x] `MyGoalBanner` → Supabase upsert 실제 연결 확인 — `saveGoalAction` 연결 완료, `dashboard/page.tsx` goal_message 로드

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

---

## PHASE 10 — 인증 플로우 ← **신규 Phase**
> 02_FE.md 검토에서 발견된 인증 미들웨어 누락 대응
> PHASE 0-5와 병행 또는 PHASE 7 완료 후 진행

### 10-1. 로그인 페이지
- [x] `app/login/page.tsx` — Google OAuth (`signInWithOAuth`)
- [x] `app/auth/callback/route.ts` — `exchangeCodeForSession` + `/dashboard` 리다이렉트
- [x] 로그인 버튼 `min-height: var(--spacing-touch-min)` 적용
- [x] 로그인 페이지는 미들웨어 matcher 제외

### 10-2. 세션 관리
- [x] `middleware.ts` — `getUser()` 기반 세션 체크, 보호 라우트 리다이렉트
- [x] 설정 페이지에서 로그아웃 버튼 구현 (`signOut()` + `/login` 리다이렉트)
- [ ] 세션 만료 자동 리다이렉트 (미들웨어가 처리, 실기기 확인 필요)

### 10-3. 인증 상태 기반 UI 분기
- [x] `app/settings/page.tsx` — 플랜 정보, 면책 고지, 로그아웃 UI
- [ ] `user_settings` 초기화 — Supabase 연동 후 최초 로그인 upsert 처리

---

## 📊 전체 진행 현황

| Phase | 내용 | 상태 |
|---|---|---|
| 0 | 프로젝트 초기 세팅 | ⏳ 진행중 (실제 API Key 입력 필요) |
| 1 | 디자인 토큰 & 전역 스타일 | ✅ 완료 |
| 2 | TypeScript 타입 & Mock 데이터 | ✅ 완료 |
| 3 | 공통 컴포넌트 (원자 단위) | ✅ 완료 |
| 4 | 앱 레이아웃 뼈대 | ✅ 완료 |
| 5 | 핵심 기능 컴포넌트 | ✅ 완료 |
| 6 | 대시보드 화면 조립 | ✅ 완료 |
| 7 | API 연동 컴포넌트 | ✅ 완료 |
| 8 | 완성도 & 접근성 | ⬜ 미시작 |
| 9 | Storybook 배포 & README | ⬜ 미시작 |
| 10 | 인증 플로우 | ✅ 완료 |

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
