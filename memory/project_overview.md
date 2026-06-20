---
name: project-overview
description: ISA ETF 포트폴리오 관리 웹뷰 프로젝트 개요, 기술스택, 현재 진행 상태
metadata:
  type: project
---

주린이(초보 투자자) 대상 ISA ETF 포트폴리오 관리 웹뷰 서비스.
매일 아침 뉴스 → AI 브리핑 → ETF 1주 매수 루틴 앱.

**기술 스택:**
- Next.js 14 App Router (Server Component 적극 활용)
- TypeScript strict mode
- SCSS Module + CSS Variables (Tailwind 미사용)
- SVG 직접 구현 (파이차트)
- react-window (TransactionHistory 가상화)
- Storybook (GitHub Pages 배포)
- Supabase (PostgreSQL + Auth)
- Vercel 서버리스 배포

**현재 파일 현황 (2026-06-20 기준):**
- Phase 0-3 대부분 완료
- 생성된 파일: app/dashboard/_components/ 전체, app/portfolio/_components/ 전체, app/login/, app/error.tsx, app/not-found.tsx, middleware.ts, lib/(news, supabase, llm-chain, dividend-calculator, mock/), styles/, types/etf.ts, components/Button/
- 미완료: 환경변수(.env.local), Phase 4-10 작업들

**아키텍처 원칙:**
- 별도 BE 서버 없음 — Next.js BFF + Supabase BaaS + Vercel
- Server Component에서 /api/* HTTP 재호출 금지 → lib/ 직접 import
- LLM 2단계 체이닝: gpt-4o-mini(뉴스요약) → Claude Sonnet(ETF브리핑), 약 80% 비용 절감

**How to apply:** 작업 요청 시 docs/04_FE_TASKS.md의 체크리스트 기준으로 진행. [[project-rules]] 항상 준수.
