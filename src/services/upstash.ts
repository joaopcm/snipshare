import { Redis } from '@upstash/redis'

const REDIS_URL = process.env.REDIS_URL
const REDIS_TOKEN = process.env.REDIS_TOKEN

if (!REDIS_URL) {
  throw new Error('Define the REDIS_URL environment variable')
}

if (!REDIS_TOKEN) {
  throw new Error('Define the REDIS_TOKEN environment variable')
}

export const CACHE_DURATION = 60 * 60 * 24 * 7 // 7 days

let cachedDb: Redis

export async function connectToCacheDatabase() {
  if (cachedDb) {
    return cachedDb
  }

  const client = new Redis({
    url: REDIS_URL!,
    token: REDIS_TOKEN!,
  })

  cachedDb = client

  return client
}
