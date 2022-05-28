import { Client } from "discord.js";
import { schedule } from "node-cron";
import { Reddit } from "../reddit";

export function scheduleRedditSubmissions(client: Client) {
  const cronExpression = "0 20 * * *";
  const reddit = new Reddit(client);
  schedule(
    cronExpression,
    async () => await reddit.sendSubmissionsToChannels()
  );
}
