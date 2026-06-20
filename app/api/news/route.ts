import { NextResponse } from 'next/server'
import { fetchNews } from '@/lib/news'

export async function GET() {
  const result = await fetchNews()
  return NextResponse.json(result)
}
