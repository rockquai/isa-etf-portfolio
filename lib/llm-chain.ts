import Anthropic from '@anthropic-ai/sdk'
import type { ETFHolding, NewsItem } from '@/types/etf'
import { MOCK_BRIEFING } from '@/lib/mock/briefing'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateETFBriefing(
  newsItems: Pick<NewsItem, 'title'>[],
  holdings: Pick<ETFHolding, 'ticker' | 'avgPrice' | 'currentPrice'>[],
): Promise<{ result: string; tier: string }> {
  try {
    const newsTitles = newsItems
      .slice(0, 10)
      .map((n, i) => `${i + 1}. ${n.title}`)
      .join('\n')

    const holdingContext = holdings
      .map(
        (h) =>
          `${h.ticker}: 평단가 ${h.avgPrice.toLocaleString()}원 / 현재가 ${h.currentPrice.toLocaleString()}원`,
      )
      .join('\n')

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: `당신은 ETF 장기 투자 도우미입니다. 아래 정보를 바탕으로 오늘 아침 투자 브리핑을 작성해주세요.

[보유 ETF 현황]
${holdingContext || '보유 종목 없음'}

[오늘의 주요 뉴스]
${newsTitles || '뉴스 없음'}

작성 규칙:
- 뉴스 중 ETF/주식 투자에 관련된 핵심 내용을 1~2문장으로 요약
- 보유 종목 현황을 간단히 언급 (수익/손실 여부)
- 오늘의 투자 포인트 1가지 제시
- 전체 3~5문장으로 간결하게
- 주린이도 이해할 수 있는 쉬운 언어
- 마지막에 면책 문구 포함: "※ 본 내용은 정보 제공용이며 투자 판단은 본인 책임입니다."`,
        },
      ],
    })

    const result = (message.content[0] as Anthropic.TextBlock).text
    return { result, tier: 'ai' }
  } catch (error) {
    console.error('LLM chain failed, using mock fallback:', error)
    return { result: MOCK_BRIEFING, tier: 'fallback' }
  }
}
