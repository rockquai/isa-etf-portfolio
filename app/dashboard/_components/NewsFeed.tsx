import { fetchNews } from '@/lib/news'
import NewsFeedClient from './NewsFeedClient'

export default async function NewsFeed() {
  const { data: allNews, isMock } = await fetchNews()

  return <NewsFeedClient allNews={allNews} isMock={isMock} />
}
