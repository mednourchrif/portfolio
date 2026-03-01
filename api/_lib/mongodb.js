import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) return { client: cachedClient, db: cachedDb };

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  const client = new MongoClient(uri, {
    tls: true,
    retryWrites: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  await client.connect();

  const db = client.db(process.env.MONGODB_DB || 'portfolio');
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
