# ✅ BE 기능 구현 Task 리스트
## 주린이 ISA ETF 포트폴리오 관리 웹뷰 서비스

> **사용법:** Claude에게 작업 요청 시 이 파일 + `03_BE.md`를 함께 첨부하세요.
> 완료된 항목은 `- [x]`로 체크하세요.

---

## ⚠️ 작업 시 Claude에게 항상 전달할 것

```
이 프로젝트의 BE 규칙:
1. 별도 백엔드 서버 없음 — Next.js BFF + Supabase BaaS + Vercel 서버리스만 사용
2. Route Handler에서 userId 클라이언트 수신 절대 금지 → JWT 세션에서 추출
3. Server Component 내부에서 /api/* HTTP 재호출 금지 → lib/ 직접 import
4. 모든 Supabase 쿼리에 user_id 조건 필수 포함 (RLS + 코드 이중 보호)
5. API 오류 시 반드시 Mock 폴백 반환 (시연 중단 방지)
6. Free 티어 AI 호출 제한은 increment_ai_call DB Function RPC로만 처리 (Race Condition 방지)
7. SUPABASE_SERVICE_ROLE_KEY는 서버 전용, 절대 코드에 하드코딩 금지
8. 환경 변수는 .env.local에만, 절대 코드에 하드코딩 금지
9. 뉴스 크롤링 금지 — RSS 파싱만 허용
10. AI 비용 로깅은 fire-and-forget (.then()) — 응답 지연 방지
11. Supabase Free 플랜 — 7일 비활성 시 일시정지, DB 백업 없음 → keep-alive + schema.sql 필수
```
---

## PHASE 0 — Supabase 프로젝트 세팅

### 0-1. Supabase 프로젝트 생성
- [x] Supabase 대시보드(supabase.com)에서 새 프로젝트 생성
- [x] 프로젝트 이름: `isa-etf-portfolio`
- [x] 리전: `Northeast Asia (Seoul)` 선택
- [x] DB 비밀번호 안전하게 보관

### 0-2. 환경 변수 수집
- [x] Supabase 대시보드 > Settings > API에서 값 복사
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` ← 서버 전용, 절대 클라이언트 노출 금지
- [x] `.env.local` 파일에 전체 환경 변수 작성

```bash
# .env.local 최종 구성
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

ANTHROPIC_API_KEY=sk-ant-xxx...   # claude-haiku-4-5 AI 브리핑 생성
# OPENAI_API_KEY 불필요 — OpenAI 의존성 제거됨

HANKYUNG_RSS_URL=https://www.hankyung.com/feed/economy

# 선택: 데모 모드 (비로그인 접근 허용 — 테스트 후 반드시 제거)
# DEMO_MODE=true
```

- [x] `.env.local`이 `.gitignore`에 포함되어 있는지 확인
- [x] Vercel 대시보드 > Environment Variables에 동일 값 등록

---

## PHASE 1 — Supabase 스키마 구성

> Supabase 대시보드 > SQL Editor에서 순서대로 실행 - docs/schema.sql

### 기본 테이블 생성
- [x] `etf_holdings` ETF 보유 종목 테이블 생성
- [x] `transactions` 거래 내역 테이블 생성
- [x] `user_settings` 사용자 설정 테이블 생성
- [x] 테이블 5개 전체 생성 확인 (Supabase 대시보드 > Table Editor)

### 추가 컬럼 (검토 반영 — 누락 컬럼)
- [x] `etf_holdings`에 `is_profit` Generated Column 추가

### 루틴 스티커 (포도알)
- [x] `routine_stickers` 테이블 생성 (포도알)
- [x] `routine_stickers` RLS 활성화 + 정책\

### RLS (Row Level Security) 활성화
- [x] 테이블 RLS 활성화
  - `etf_holdings`
  - `transactions`
  - `user_settings`
  - `routine_stickers`(2개)
  - `sticker_board_rewards`
  - `term_cards`
- [x] 각 테이블 본인 데이터 접근 정책 생성 - RLS 정책 (본인 데이터만 접근)
- [x] Supabase 대시보드 > Authentication > Policies에서 정책 생성 확인

### [TODO-추후개발] DB Function 생성 — AI 호출 Race Condition 방지 (P0)
- [] `increment_ai_call` 함수 생성

---

## PHASE 2 — Supabase 클라이언트 구성

> ⚠️ 단일 클라이언트 금지 — 브라우저/서버/admin 3종 분리

### 2-1. 패키지 설치 확인
- [x] `@supabase/supabase-js` 설치 확인
- [x] `@supabase/ssr` 설치 확인 (`npm install @supabase/ssr`)

### 2-2. `lib/supabase.ts` 작성 — 3종 클라이언트 분리
- [x] 브라우저용 `createClient()` 작성 (Client Component 전용)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [x] 서버용 `createServerSupabaseClient()` 작성 (Server Component / Route Handler)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
}
```

- [x] admin용 `createAdminClient()` 작성 (service_role, RLS 우회 필요 시)

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

- [x] 기존 `export const supabase = createClient(...)` 단일 export 제거

### 2-3. Supabase 쿼리 함수 작성
- [x] `getETFHoldings(userId)` — Server Component / page에서 직접 인라인 쿼리로 구현
- [x] `addETFHolding(userId, holding)` — `app/actions/etf.ts` `addETFHoldingAction`으로 구현
- [x] `addTransaction(userId, transaction)` — `app/actions/transaction.ts` `addTransactionAction`으로 구현 (avg_price 재계산 포함)
- [x] `saveGoalMessage(userId, message)` — `app/actions/goal.ts` `saveGoalAction`으로 구현
- [x] `getUserSettings(userId)` — dashboard/page.tsx에서 직접 인라인 쿼리로 구현
- [x] `initUserSettings(userId)` — `app/auth/callback/route.ts`에서 upsert로 구현

---

## PHASE 3 — Supabase Auth 설정
### 3-1. Auth Provider 설정
- [x] Supabase 대시보드 > Authentication > Providers
- [x] Google OAuth 또는 Kakao OAuth 활성화 (택1)
- [x] Client ID / Secret 입력
- [x] Redirect URL 확인: `https://{프로젝트}.supabase.co/auth/v1/callback`

### 3-2. Auth Callback Route 작성
- [x] `app/auth/callback/route.ts` 생성 — `exchangeCodeForSession` + `user_settings` upsert + `/dashboard` 리다이렉트

- [x] Supabase 대시보드 > Authentication > URL Configuration에 Redirect URL 등록
  - 로컬: `http://localhost:3000/auth/callback`
  - 프로덕션: `https://{vercel-domain}/auth/callback`

### 3-3. 인증 미들웨어 연동 확인
- [x] `proxy.ts`(구 `middleware.ts`)에서 Supabase 세션 기반 보호 경로 확인 — Next.js 16 컨벤션으로 파일명/함수명 변경 완료
- [x] 비로그인 시 `/login` 리다이렉트 동작 확인 (실기기 테스트 필요)
- [x] 로그인 후 `/dashboard` 리다이렉트 동작 확인 (실기기 테스트 필요)

---

## PHASE 4 — RSS 뉴스 BFF
### 4-1. `lib/news.ts` 작성
- [x] `rss-parser` import
- [x] Parser 인스턴스 — timeout, User-Agent, Accept 헤더 설정

```typescript
const parser = new Parser({
  timeout: 5000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; ETF-Portfolio-Bot/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
  customFields: { item: ['description'] },
})
```

- [x] `MOCK_FALLBACK_NEWS` 배열 정의 (`[Mock]` 접두사 포함)
- [x] `fetchNews()` 함수 작성 — try/catch + Mock 폴백 반환
- [x] 반환 타입 `{ data: NewsItem[], isMock: boolean }` 명시

### 4-2. `app/api/news/route.ts` 작성
- [x] GET handler 작성
- [x] `fetchNews()` 직접 import (HTTP 재호출 금지)
- [x] `NextResponse.json(result)` 반환
- [ ] 에러 시 500 응답 처리 확인

### 4-3. 뉴스 BFF 동작 확인
- [x] `npm run dev` 후 `GET /api/news` 응답 확인
- [x] 한경 RSS 정상 파싱 확인 (`isMock: false`)
- [x] RSS URL 의도적 오류 → Mock 폴백 동작 확인 (`isMock: true`)

---

## PHASE 5 — LLM 파이프라인
### 5-1. `lib/llm-chain.ts` 작성 ✅ 완료
- [x] ~~`summarizeNews(newsText)` — gpt-4o-mini 1단계~~ → **제거됨**
- [x] ~~`generateBriefing(summary, holdings)` — Claude Sonnet 2단계~~ → **제거됨**
- [x] `generateETFBriefing(newsItems, holdings)` — claude-haiku-4-5 단일 호출
  - [x] @anthropic-ai/sdk 공식 SDK 사용
  - [x] 성공: `{result: briefing, tier: 'ai'}`
  - [x] 실패(API 오류/no key): `{result: MOCK_BRIEFING, tier: 'fallback'}`
- [x] `MOCK_BRIEFING` 상수 정의 (면책 문구 포함)
- [x] **userTier 인자 제거** — 전원 동일 로직 (tier 구분은 route.ts의 카운트 제한으로만 처리)

### 5-2. AI 비용 로깅 (미구현) 🟢 P2
- [ ] `ai_usage_logs` INSERT 로직 미적용 (현재 route.ts에 없음)
- [ ] 개선 방법: `response.usage` 수집 → fire-and-forget INSERT
- [ ] 비용 계산: `(inputTokens × $1 + outputTokens × $5) / 1,000,000`

**우선순위 낮음:** 월 5회 제한으로 인해 실제 비용 추적 긴급하지 않음

### 5-3. LLM 호출 동작 확인
- [x] 전원 실제 호출 (API 키 있을 때)
- [x] API 오류 → Mock 폴백 + tier: 'fallback' 반환
- [x] tier 응답값에 따라 UI에서 "샘플 브리핑" 배지 표시

---

## PHASE 6 — Route Handler 구현
### 6-1. `app/api/ai-briefing/route.ts` 작성 (P0 보안 필수)
- [x] `export const maxDuration = 60` route segment config 추가 (Vercel 타임아웃 대응)
- [x] ⚠️ **userId JWT 추출** — `supabase.auth.getUser()`로 서버에서 추출 완료
- [ ] ⚠️ Free 티어 제한 — `increment_ai_call` RPC 호출로 교체 필요 ← **현재 비원자적 SELECT→UPDATE 방식 사용 중 (Race Condition P0 미해결)**

```typescript
  // 수정 필요: 현재 비원자적 → RPC로 교체
  const { data: rpcData } = await supabase.rpc('increment_ai_call', {
    p_user_id: userId,
    p_limit: 5,
  })
  if (!rpcData?.[0]?.allowed) {
    return NextResponse.json({ error: 'FREE_LIMIT_EXCEEDED' }, { status: 429 })
  }
```

- [x] `generateETFBriefing` 호출 및 응답 반환
- [ ] 에러 시 500 응답 + Mock 폴백 반환 확인

### 6-2. `app/api/portfolio/route.ts` 작성 (P0 보안 필수)

- [x] ⚠️ **GET** — JWT에서 userId 추출 완료
- [x] **POST** — ETF 종목 추가 (`addETFHolding`)
- [x] **DELETE** — ETF 종목 삭제 (user_id 조건 포함)

### 6-3. Server Action 작성

- [x] `app/actions/goal.ts` — `saveGoalAction` 구현 완료
- [x] `app/actions/transaction.ts` — `addTransactionAction` 구현 완료 (avg_price 재계산 포함)
- [x] `app/actions/etf.ts` — `addETFHoldingAction` 구현 완료 ← **신규 추가**

---

## PHASE 7 — 통합 테스트

### 7-1. 인증 플로우 확인
- [x] 소셜 로그인 성공 → `/dashboard` 리다이렉트
- [x] 비로그인 상태 `/dashboard` 직접 접근 → `/login` 리다이렉트
- [x] 로그인 후 `user_settings` row 자동 생성 확인 (Supabase Table Editor)
- [ ] 로그아웃 후 세션 삭제 확인

### 7-2. ETF CRUD 확인
- [ ] ETF 종목 추가 → `etf_holdings` 테이블 row 생성 확인
- [ ] 매수 기록 → `transactions` row 생성 + `etf_holdings.avg_price` 재계산 확인
- [ ] 다른 userId로 데이터 접근 시도 → RLS에 의해 차단 확인

### 7-3. AI 브리핑 확인
- [x] 전원 실제 호출 (API 키 있을 때)
- [x] 월 5회 초과 → 429 응답 확인
- [x] 실패(API 키 없음 등) → tier: 'fallback' + Mock 폴백 반환 확인
- [ ] UI에서 tier: 'fallback' 응답 시 "샘플 브리핑" 배지 + 안내 툴팁 표시 확인
- [ ] `ai_usage_logs` 테이블 미구현 (향후 작업)

### 7-4. RSS 뉴스 확인
- [ ] `/api/news` 정상 응답 확인
- [ ] `isMock: false` 실제 뉴스 파싱 확인
- [ ] RSS 오류 시 `isMock: true` Mock 폴백 확인

### 7-5. 보안 확인 (P0)
- [ ] `/api/ai-briefing` body에 임의 userId 포함 → 무시되고 JWT userId 사용 확인
- [ ] `/api/portfolio` 쿼리 파라미터로 userId 변조 → 차단 확인
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 클라이언트 번들에 미포함 확인
  - 브라우저 DevTools > Network > JS 파일에서 키 검색

---

## PHASE 8 — Vercel 배포

### 8-1. Vercel 환경 변수 등록
- [x] Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
- [ ] 6개 환경 변수 전부 등록 확인

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY     ← Production/Preview only (클라이언트 노출 방지)
ANTHROPIC_API_KEY             ← claude-haiku-4-5 AI 브리핑 (OPENAI_API_KEY 대체)
HANKYUNG_RSS_URL
DEMO_MODE                     ← 선택사항, true 설정 시 비로그인 접근 허용 (테스트용)
```

- [ ] `SUPABASE_SERVICE_ROLE_KEY`는 Production 환경에만 등록 (브라우저 노출 방지)
- [ ] `DEMO_MODE`는 테스트 완료 후 반드시 제거

### 8-2. vercel.json 설정 (Hobby 플랜 타임아웃 대응)
- [ ] `vercel.json` 생성

```json
{
  "functions": {
    "app/api/ai-briefing/route.ts": { "maxDuration": 30 }
  }
}
```

- [ ] Pro 플랜이면 `route.ts` 내 `export const maxDuration = 60`으로 대신 처리

### 8-3. Supabase Auth Redirect URL 프로덕션 등록
- [ ] Supabase > Authentication > URL Configuration
- [ ] Site URL: `https://{vercel-domain}`
- [ ] Redirect URLs에 `https://{vercel-domain}/auth/callback` 추가

### 8-4. 배포 후 검증
- [ ] Vercel 배포 URL에서 로그인 동작 확인
- [ ] 프로덕션 환경 `/api/news` 응답 확인
- [ ] 프로덕션 환경 AI 브리핑 호출 확인
- [ ] Vercel 대시보드 > Functions > Logs에서 에러 없음 확인

---

## PHASE 9 — Supabase Free 플랜 운영 대응

> ⚠️ 사용자가 링크를 클릭했을 때 DB가 꺼져 있거나 데이터가 날아가면 치명적.
> 배포 직후 반드시 완료할 것.

### 9-1. 비활성 일시정지 방지 — GitHub Actions keep-alive

- [x] `.github/workflows/supabase-keep-alive.yml` 파일 생성

```yaml
name: Supabase Keep Alive

on:
  schedule:
    # 매일 오전 9시 17분 KST(UTC 00:17)에 실행합니다.
    # GitHub Actions 혼잡이 잦은 정각을 피해 예약합니다.
    - cron: '17 0 * * *'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  ping:
    runs-on: ubuntu-latest
    timeout-minutes: 2

    steps:
      - name: Query Supabase database
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: |
          curl \
            --fail-with-body \
            --silent \
            --show-error \
            --max-time 30 \
            --get "${SUPABASE_URL}/rest/v1/user_settings" \
            --data-urlencode "select=id" \
            --data-urlencode "limit=1" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"

          echo
          echo "Supabase database query completed"
```

- [ ] GitHub 레포 > Settings > Secrets > Actions에 Secrets 2개 등록
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - ⚠️ `SUPABASE_SERVICE_ROLE_KEY`는 등록하지 말 것 — anon key만으로 충분
- [ ] Actions 탭에서 워크플로우 수동 실행(`workflow_dispatch`) 후 성공 확인
- [ ] Supabase 대시보드 > Reports > API에서 ping 요청 기록 확인

### 9-2. DB 백업 — `docs/schema.sql` 작성 및 커밋

- [x] `docs/schema.sql` 파일 생성 — 테이블 + 추가 컬럼 + RLS + DB Function 전체 포함

### 9-3. ETF 전종목 목록 월간 자동 갱신 — GitHub Actions

- [x] `scripts/fetch-etf-list.py` 생성
  - 네이버 금융 API → `lib/static/etf-list.json` 자동 갱신
  - 종목명 키워드 기반 카테고리 자동 분류
- [x] `.github/workflows/update-etf-list.yml` 생성
  - 매월 1일 오전 10시(KST) 자동 실행
  - `workflow_dispatch`로 수동 실행 가능
- [x] 첫 실행 전 로컬 테스트
  ```bash
  pip3 install requests
  python3 scripts/fetch-etf-list.py
  ```
- [x] GitHub Actions 수동 실행(`workflow_dispatch`) 후 성공 확인
  - Actions 탭 → `ETF 전종목 목록 월간 갱신` → `Run workflow`
- [x] 실행 후 `lib/static/etf-list.json` 종목 수 800개 전후 확인

```
docs/
├── schema.sql          ← 완료
├── 01_PLANNING.md
├── 02_FE.md
├── 03_BE.md
├── 04_FE_TASKS.md
└── 05_BE_TASKS.md
```

- [x] `docs/schema.sql` Git 커밋 및 푸시
- [ ] 복구 시나리오 셀프 테스트 — `schema.sql` 실행만으로 5분 안에 재구성 가능한지 확인

### 9-3. Mock 데이터 시연 가능 상태 유지 확인
- [x] `lib/mock/etf.ts` — 5개 종목 Mock 데이터 유지
- [x] `lib/mock/transactions.ts` — 50개 거래 내역 Mock
- [x] `lib/mock/news.ts` — `[Mock]` 접두사 포함 뉴스 5개
- [x] `lib/mock/briefing.ts` — 면책 문구 포함 확인
- [ ] DB 연결 없이 Mock 데이터만으로 대시보드 전체 시연 가능한지 확인
  - `isMock: true` 상태에서 뉴스 피드 정상 노출
  - Free 티어 Mock 브리핑 정상 노출
  - ETF 0종목 Empty State UI 정상 노출

---

## 📊 전체 진행 현황

| Phase | 내용 | 상태 |
|---|---|---|
| 0 | Supabase 프로젝트 세팅 | ✅ 완료 |
| 1 | Supabase 스키마 구성 | ⏳ 진행중 (포도알 테이블 + 컬럼 추가 필요) |
| 2 | Supabase 클라이언트 구성 | ✅ 완료 |
| 3 | Supabase Auth 설정 | ⏳ 진행중 (OAuth Provider 설정 + Redirect URL 등록 필요) |
| 4 | RSS 뉴스 BFF | ✅ 완료 (실기기 테스트 필요) |
| 5 | LLM 파이프라인 | ✅ 완료 (단일 Haiku 4.5, AI 비용 로깅만 P2) |
| 6 | Route Handler 구현 | ⏳ 진행중 (increment_ai_call RPC 교체 필요 — P0) |
| 7 | 통합 테스트 | ⬜ 미시작 |
| 8 | Vercel 배포 | ⏳ 진행중 (환경변수 확인 + vercel.json + Redirect URL 필요) |
| 9 | Free 플랜 운영 대응 | ⏳ 진행중 (GitHub Secrets 등록 + schema.sql 커밋 필요) |

### 🔴 P0 타임존 버그 — 즉시 처리

| 항목 | 상태 | 영향 |
|---|---|---|
| `lib/getKstDate.ts` 작성 | ⬜ 미시작 | 매수 기록 날짜 전날로 저장됨 |
| `app/actions/transaction.ts` 수정 | ⬜ 미시작 | 포도알 루틴 판정 1일씩 밀림 |
| `transactions.date` DEFAULT 수정 | ⬜ 미시작 | DB 레벨에서도 UTC 기준 |

### 🟡 포도알 스티커 (P1 — Phase 2주 내)

| 항목 | 상태 | Phase |
|---|---|---|
| `routine_stickers` 테이블 + RLS | ⬜ 미시작 | 1 |
| `addStickerAction` Server Action | ⬜ 미시작 | FE Phase 5 |
| 자동 부여 로직 (buy_record 등) | ⬜ 미시작 | FE Phase 5-6 |
| `GrapeBoard` 컴포넌트 | ⬜ 미시작 | FE Phase 5 |

> 진행 중: ⏳ / 완료: ✅ / 미시작: ⬜