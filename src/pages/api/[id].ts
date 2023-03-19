import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end()
    }

    const { db } = await connectToDatabase()
    const id = req.query.id as string

    if (!id) {
      return res.status(400).json({
        message: 'Missing id',
      })
    }

    const note = await db
      .collection('notes')
      .find({ _id: new ObjectId(id) })
      .toArray()

    if (!note[0]) {
      return res.status(404).json({
        message: 'Note not found',
      })
    }

    return res.status(200).json(note[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}
