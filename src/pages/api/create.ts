import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '@/lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end()
    }

    const { db } = await connectToDatabase()

    const newNote = await db.collection('notes').insertOne(JSON.parse(req.body))

    return res.status(200).json({
      id: newNote.insertedId,
    })
  } catch (error) {
    return res.json({
      message: 'Something went wrong',
    })
  }
}
