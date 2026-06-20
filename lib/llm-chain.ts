import type { ETFHolding, NewsItem, UserTier } from '@/types/etf'
import { MOCK_BRIEFING } from '@/lib/mock/briefing'

async function summarizeNews(newsText: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 경제 뉴스 요약 전문가입니다. ETF 투자자에게 관련된 핵심 내용만 3줄 이내로 요약하세요. 반드시 한국어로 답변하세요.',
        },
        { role: 'user', content: newsText },
      ],
      max_tokens: 300,
    }),
  })

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`)
  const data = await response.json()
  return data.choices[0].message.content as string
}

async function generateBriefing(
  newsSummary: string,
  holdings: Pick<ETFHolding, 'ticker' | 'avgPrice' | 'currentPrice'>[],
): Promise<string> {
  const holdingContext = holdings
    .map(
      (h) =>
        `${h.ticker}: 평단가 ${h.avgPrice.toLocaleString()}원 / 현재가 ${h.currentPrice.toLocaleString()}원`,
    )
    .join('\n')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `당신은 ETF 장기 투자 도우미입니다. 아래 정보를 바탕으로 오늘 아침 투자 브리핑을 작성해주세요.

[보유 ETF 현황]
${holdingContext}

[오늘의 경제 뉴스 요약]
${newsSummary}

작성 규칙:
- 3~5문장으로 간결하게
- 주린이도 이해할 수 있는 쉬운 언어
- 반드시 마지막에 면책 문구 포함:
  "※ 본 내용은 정보 제공용이며 투자 판단은 본인 책임입니다."`,
        },
      ],
    }),
  })

  if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`)
  const data = await response.json()
  return data.content[0].text as string
}

export async function generateETFBriefing(
  newsItems: Pick<NewsItem, 'title'>[],
  holdings: Pick<ETFHolding, 'ticker' | 'avgPrice' | 'currentPrice'>[],
  userTier: UserTier,
): Promise<{ result: string; tier: string }> {
  if (userTier === 'free') {
    return { result: MOCK_BRIEFING, tier: 'free' }
  }

  try {
    const newsText = newsItems.map((n) => n.title).join('\n')
    const summary = await summarizeNews(newsText)
    const briefing = await generateBriefing(summary, holdings)
    return { result: briefing, tier: 'pro' }
  } catch (error) {
    console.error('LLM chain failed, using mock fallback:', error)
    return { result: MOCK_BRIEFING, tier: 'fallback' }
  }
}
