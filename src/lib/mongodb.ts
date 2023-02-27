import { Db, MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.DB_NAME

if (MONGODB_URI == null) {
  throw new Error('Define the MONGODB_URI environmental variable')
}

if (!MONGODB_DB == null) {
  throw new Error('Define the MONGODB_DB environmental variable')
}

let cachedClient: MongoClient
let cachedDb: Db

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    }
  }

  const client = new MongoClient(MONGODB_URI!)
  await client.connect()
  const db = client.db(MONGODB_DB)

  cachedClient = client
  cachedDb = db

  return {
    client: cachedClient,
    db: cachedDb,
  }
}
