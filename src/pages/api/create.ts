import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '@/services/mongodb'
import { CACHE_DURATION, connectToCacheDatabase } from '@/services/upstash'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end()
    }

    const db = await connectToDatabase()
    const cache = await connectToCacheDatabase()

    const newNote = await db.collection('notes').insertOne(req.body)

    await cache.set(`note-${newNote.insertedId}`, JSON.stringify(req.body), {
      ex: CACHE_DURATION,
    })

    return res.status(200).json({
      id: newNote.insertedId,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}
