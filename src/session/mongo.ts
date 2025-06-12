import { MongoClient, Db, Collection } from 'mongodb';
import { randomUUID } from 'crypto';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocer-auth-wizard';
const dbName = 'grocer-auth-wizard';
const collectionName = 'sessions';

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }
  return db!;
}

export async function saveSession(session: any): Promise<string> {
  const db = await connect();
  const collection: Collection = db.collection(collectionName);
  const session_id = randomUUID();
  await collection.insertOne({ _id: session_id, ...session });
  return session_id;
}

export async function getSession(session_id: string): Promise<any | null> {
  const db = await connect();
  const collection: Collection = db.collection(collectionName);
  return collection.findOne({ _id: session_id } as Record<string, any>);
} 