import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function getNoteById(id: string) {
  if (!id) {
    return null
  }

  const { db } = await connectToDatabase()

  const note = await db
    .collection('notes')
    .find({ _id: new ObjectId(id) })
    .toArray()

  if (!note[0]) {
    return null
  }

  const { _id, ...result } = note[0]

  return result
}
