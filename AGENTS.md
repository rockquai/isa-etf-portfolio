<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 기본사항
## 답변은 간결하게
- 종결 표현을 간결하게 작성
- 예: `~ 확인됩니다` → `~ 확인`
- 예: `~ 수정하였습니다` → `~ 수정`
- 불필요한 배경 설명과 반복 생략
- 변경한 파일, 핵심 변경 사항, 검증 결과만 보고

## 커밋 작성 요청
- 프롬프트에 `커밋 작성`이 포함되면 추가·수정된 코드에 맞는 커밋 메시지만 작성해 제시
- `git commit`은 직접 실행하지 않기
- 커밋 메시지는 Conventional Commits 형식 사용
- 예: `feat: #1 ETF 매수 기록 기능 추가`

## 코드 수정, 추가, 삭제시 

# ISA ETF Portfolio 작업 지침
## 프로젝트 구성
- Next.js 16 App Router와 React 19 사용
- TypeScript strict 모드 사용
- 스타일은 SCSS Module 사용
- 공용 컴포넌트는 `components/`에 배치
- 페이지 전용 컴포넌트는 해당 경로의 `_components/`에 배치
- 공용 타입은 `types/`, 공용 로직은 `lib/`에 배치
- Supabase 관련 처리는 기존 `lib/supabase.ts`와 인증 흐름을 우선 활용
- 경로 별칭은 `@/*` 사용

## 구현 원칙
- 기존 코드 구조와 명명 규칙을 우선 유지
- Server Component를 기본으로 사용
- 브라우저 API, 상태, 이벤트 처리가 필요할 때만 `"use client"` 사용
- 데이터 변경은 기존 Server Action 패턴을 우선 사용
- API Route 추가 전 Server Action 또는 서버 컴포넌트에서 처리 가능한지 확인
- 공용 컴포넌트를 중복 구현하지 말고 기존 컴포넌트 재사용
- 컴포넌트와 동일한 위치에 SCSS Module 및 Storybook 스토리 배치
- 불필요한 의존성 추가 금지
- 요청 범위 밖의 리팩터링 금지

## UI 작업
- `styles/tokens.scss`의 기존 디자인 토큰 우선 사용
- 색상, 간격, 글꼴 값을 임의로 하드코딩하지 않기
- 모바일 웹뷰 환경을 우선 고려
- 로딩, 빈 데이터, 오류 상태 함께 처리
- 사용자 인터랙션이 있는 공용 UI는 Storybook 스토리 추가 또는 갱신
- 접근 가능한 HTML 요소와 적절한 `aria-*` 속성 사용

## 데이터 및 보안
- 금액 계산에서 부동소수점 오차 주의
- ETF 코드, 날짜, 통화 단위를 명확히 처리
- 서버 전용 환경 변수와 비밀 키를 클라이언트에 노출하지 않기
- 사용자 입력은 서버에서 다시 검증
- 인증 및 사용자별 데이터 조회 시 사용자 소유권 확인
- 실제 외부 API 호출이 필요한 테스트는 임의로 실행하지 않기

## 작업 전 확인
- 코드 작성 전 관련 파일과 기존 구현 먼저 확인
- Next.js 변경 작업 전 `node_modules/next/dist/docs/`의 관련 문서 확인
- 요구사항이 `docs/` 또는 `memory/` 문서와 충돌하면 사용자에게 알리기
- 기존 사용자 변경 사항을 덮어쓰거나 되돌리지 않기

## 검증
변경 범위에 맞게 다음 명령을 실행:
```bash
npm run lint
npx tsc --noEmit
npm run build
```