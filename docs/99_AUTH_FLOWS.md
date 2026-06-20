# 🔐 인증 플로우 정리
## Supabase Google OAuth 설정 및 로그인 흐름

---

## 1. Google Cloud Console — OAuth 앱 생성

1. [console.cloud.google.com](https://console.cloud.google.com) 접속
2. **APIs & Services(API 및 서비스) → Credentials(사용자 인증 정보) → + CREATE CREDENTIALS(사용자 인증 정보 만들기) → OAuth client ID**
3. Application type: **Web application**
4. **Authorized redirect URIs** 추가:
   ```
   https://{supabase-project-ref}.supabase.co/auth/v1/callback
   ```
5. **Client ID** / **Client Secret** 복사

---

## 2. Supabase — Google Provider 활성화

1. Supabase 대시보드 → **Authentication → Providers → Google**
2. **Enable Sign in with Google** 토글 ON
3. Google Cloud Console에서 복사한 값 입력:
   - `Client ID`
   - `Client Secret`
4. **Save**

---

## 3. Supabase — Redirect URL 등록

**Authentication → URL Configuration**
- `vercel-domain` : 배포된 웹사이트의 주소(URL)가 바로 Vercel 도메인, vercel 대시보드에서 확인(https://isa-etf-portfolio.vercel.app/)

| 항목 | 값 |
|---|---|
| Site URL | `https://{vercel-domain}` |
| Redirect URLs | `http://localhost:3000/auth/callback` |
| Redirect URLs | `https://{vercel-domain}/auth/callback` |

---

## 4. 로그인 플로우 (코드 기준)

```
사용자 클릭
    │
    ▼
app/login/page.tsx
  supabase.auth.signInWithOAuth({ provider: 'google' })
    │
    ▼
Google 동의 화면
    │
    ▼
https://{supabase}.supabase.co/auth/v1/callback  ← Supabase가 처리
    │
    ▼
app/auth/callback/route.ts
  1. supabase.auth.exchangeCodeForSession(code)  ← 세션 발급
  2. user_settings upsert (최초 로그인 시 row 생성)   ← 신규 유저 초기화
  3. NextResponse.redirect('/dashboard')
    │
    ▼
proxy.ts (구 middleware.ts)
  getUser() → 세션 유효하면 통과
    │
    ▼
/dashboard 접근 허용
```

---

## 5. 세션 보호 (proxy.ts)

`/dashboard`, `/portfolio`, `/settings` 경로는 비로그인 시 `/login`으로 리다이렉트.

```typescript
// proxy.ts
const isProtected = ['/dashboard', '/portfolio', '/settings'].some((p) =>
  request.nextUrl.pathname.startsWith(p),
)
if (isProtected && !user) {
  return NextResponse.redirect(new URL('/login', request.url))
}
```

> Next.js 16부터 `middleware.ts` → `proxy.ts`, 함수명 `middleware` → `proxy`로 변경.

---

## 6. 최초 로그인 시 user_settings 초기화

```typescript
// app/auth/callback/route.ts
if (session?.user) {
  await supabase
    .from('user_settings')
    .upsert({ user_id: session.user.id }, { onConflict: 'user_id', ignoreDuplicates: true })
}
```

- 재로그인 시 기존 row 유지 (`ignoreDuplicates: true`)
- 최초 로그인 시 `user_tier: 'free'`, `ai_call_count: 0` 기본값으로 생성

---

## 7. 로그아웃

```typescript
// app/settings/page.tsx
const supabase = createClient()
await supabase.auth.signOut()
router.push('/login')
```

---

## ✅ 동작 확인 체크리스트

- [x] Google 로그인 성공 → `/dashboard` 리다이렉트
- [x] `Authentication → Users`에 유저 등록 확인
- [x] `user_settings` 테이블에 row 자동 생성 확인
- [x] 비로그인 상태 `/dashboard` 직접 접근 → `/login` 리다이렉트 확인
- [ ] 로그아웃 후 세션 삭제 확인
- [ ] 프로덕션(Vercel) 환경에서 동일 플로우 확인
