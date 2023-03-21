import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'

import { connectToDatabase } from '@/services/mongodb'
import { CACHE_DURATION, connectToCacheDatabase } from '@/services/upstash'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end()
    }

    const id = req.query.id as string

    if (!id) {
      return res.status(400).json({
        message: 'Missing id',
      })
    }

    const cache = await connectToCacheDatabase()
    const cachedNote = await cache.get(`note-${id}`)

    if (cachedNote) {
      return res.status(200).json(cachedNote)
    }

    const db = await connectToDatabase()

    const note = await db
      .collection('notes')
      .find({ _id: new ObjectId(id) })
      .toArray()

    if (!note[0]) {
      return res.status(404).json({
        message: 'Note not found',
      })
    }

    await cache.set(`note-${id}`, JSON.stringify(note[0]), {
      ex: CACHE_DURATION,
    })

    return res.status(200).json(note[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}
