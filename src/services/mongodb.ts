import { Db, MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.DB_NAME

if (MONGODB_URI == null) {
  throw new Error('Define the MONGODB_URI environmental variable')
}

if (MONGODB_DB == null) {
  throw new Error('Define the MONGODB_DB environmental variable')
}

let cachedDb: Db

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb
  }

  const client = new MongoClient(MONGODB_URI!)
  await client.connect()
  const db = client.db(MONGODB_DB)

  cachedDb = db

  return db
}
