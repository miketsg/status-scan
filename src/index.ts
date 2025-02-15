import { connectToDatabase } from "./db";
import { startMonitoring } from "./monitor";

async function main(): Promise<void> {
  await connectToDatabase();
  startMonitoring();
}

main();
