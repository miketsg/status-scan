import { MongoClient, Db, Collection } from "mongodb";

import { config } from "./config";

export interface WebsiteState {
  url: string;
  hash: string;
  lastChecked: Date;
}

export interface ChangeEvent {
  url: string;
  timestamp: Date;
  previousHash: string;
  newHash: string;
  loadingTime: number;
  status: number;
}

let db: Db;

export let websiteStatesCollection: Collection<WebsiteState>;
export let changeEventsCollection: Collection<ChangeEvent>;

export async function connectToDatabase(): Promise<void> {
  try {
    const client = new MongoClient(config.mongodbUri);
    await client.connect();
    db = client.db(config.mongodbDb);
    websiteStatesCollection = db.collection<WebsiteState>("websiteStates");
    changeEventsCollection = db.collection<ChangeEvent>("changeEvents");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}
