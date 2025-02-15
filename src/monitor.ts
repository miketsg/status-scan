import axios, { AxiosResponse } from "axios";

import { config } from "./config";
import {
  websiteStatesCollection,
  changeEventsCollection,
  WebsiteState,
  ChangeEvent,
} from "./db";
import { computeHash } from "./utils";
import { sendNotifications } from "./notifications";

export async function checkWebsite(url: string): Promise<void> {
  console.log(`\n[${new Date().toISOString()}] Checking ${url}...`);
  const startTime = Date.now();
  try {
    const response: AxiosResponse<string> = await axios.get<string>(url);
    const loadingTime = Date.now() - startTime;
    const status = response.status;
    const htmlContent = response.data;

    // Compute hash of the content
    const hash = computeHash(htmlContent);

    // Retrieve previous state from MongoDB
    const previousState: WebsiteState | null =
      await websiteStatesCollection.findOne({ url });

    if (!previousState) {
      // First check - store initial state
      const initialState: WebsiteState = {
        url,
        hash,
        lastChecked: new Date(),
      };
      await websiteStatesCollection.insertOne(initialState);
      console.log(`Initial state stored for ${url}`);
    } else if (previousState.hash !== hash) {
      console.log(`Change detected on ${url}`);
      const changeEvent: ChangeEvent = {
        url,
        timestamp: new Date(),
        previousHash: previousState.hash,
        newHash: hash,
        loadingTime,
        status,
      };
      await changeEventsCollection.insertOne(changeEvent);

      // Update stored state with new hash and timestamp
      await websiteStatesCollection.updateOne(
        { url },
        { $set: { hash, lastChecked: new Date() } }
      );

      // Send notifications
      await sendNotifications(url, changeEvent);
    } else {
      // No change - update the lastChecked time
      await websiteStatesCollection.updateOne(
        { url },
        { $set: { lastChecked: new Date() } }
      );
      console.log(
        `No change on ${url} (Status: ${status}, Time: ${loadingTime}ms)`
      );
    }
  } catch (error: any) {
    console.error(`Error checking ${url}:`, error.message);
  }
}

export function startMonitoring(): void {
  // Immediate check for each URL
  config.urls.forEach((url) => {
    checkWebsite(url);
  });
  // Schedule recurring checks
  setInterval(() => {
    config.urls.forEach((url) => {
      checkWebsite(url);
    });
  }, config.scheduleInterval);
}
