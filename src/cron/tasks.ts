import { scheduleMarioStrickerCooldown } from "./mario-striker";
import { scheduleRedditSubmissions } from "./reddit";

export const cronTasks = [
  scheduleRedditSubmissions,
  scheduleMarioStrickerCooldown,
];
