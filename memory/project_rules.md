---
name: project-rules
description: ISA ETF 프로젝트 절대 금지사항 및 필수 준수 규칙 13개
metadata:
  type: project
---

이 프로젝트에서 반드시 지켜야 할 규칙들. 위반 시 재작업 필요.

1. **Tailwind 사용 금지** — CSS Module(.module.scss) + CSS Variables(tokens.scss)만 사용
2. **한국 금융 컬러 컨벤션** — 상승(+) = 빨강(--color-stock-up: #E53E3E), 하락(-) = 파랑(--color-stock-down: #2B6CB0). 절대 혼용 금지
3. **라이브러리로 ETFPieChart/GoalGauge/DividendTimeline 구현 금지** — SVG/CSS animation 직접 구현 (recharts 설치 금지)
4. **user-select: none 전역 적용 금지** — 금융 텍스트 복사 차단 문제. .news-content, .etf-ticker-code 등은 user-select: text 필수
5. **animate-pulse 경고/금융 배너 사용 금지** — 사용자 불안 유발
6. **Server Component에서 내부 /api/* HTTP 재호출 금지** — lib/ 함수 직접 import할 것
7. **react-window는 TransactionHistory에만 적용** — 뉴스(5-20개)에는 사용 금지
8. **모든 textarea에 maxLength={100} 필수**
9. **터치 영역 min-height: var(--spacing-touch-min) 44px 필수** — 절대 줄이지 말 것
10. **모든 컴포넌트에 Storybook stories 최소 3가지 상태 작성** — GitHub Pages 배포 예정
11. **Route Handler에서 userId 클라이언트 수신 금지** — JWT 세션에서 서버측 추출 필수 (보안 취약점)
12. **Server Component → Client Component로 함수 prop 전달 금지** — Server Action 사용
13. **recharts 설치 금지**

**CSS Variables 이름 임의 변경 금지** — Figma Variables와 1:1 매핑됨

**Why:** 보안(11번), 한국 UX 컨벤션(2번), 포트폴리오 어필 포인트(3번 SVG직접구현, GoalGauge CSS animation), 성능(7번)

**How to apply:** 코드 작성 전 이 규칙 체크. 특히 컬러 사용 시 2번, API 작성 시 11번, 상태 전달 시 12번 주의.
