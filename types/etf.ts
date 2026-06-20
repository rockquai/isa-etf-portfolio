export type ETFHolding = {
  id: string
  ticker: string
  avgPrice: number
  currentPrice: number
  quantity: number
  annualDividendPerShare: number
  dividendGrowthRate: number
  isProfit: boolean
}

export type Transaction = {
  id: string
  etfId: string
  date: string
  price: number
  quantity: number
  isProfit: boolean
}

export type DividendProjection = {
  year: 3 | 5 | 10 | 20
  monthlyDividend: number
  annualDividend: number
  totalShares: number
}

export type NewsItem = {
  title: string
  link: string
  pubDate: string
}

export type UserTier = 'free' | 'pro'
