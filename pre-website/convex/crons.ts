import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "cleanup expired unconfirmed waitlist entries",
  { minutes: 15 },
  internal.waitlist.cleanupExpired
);

export default crons;
