const cron = require("node-cron");

export const exampleCronJob = cron.schedule(
  "* * * * *",
  () => {
    console.log("Running a job every minute Asia/Ho_Chi_Minh");
  },
  {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
  }
);
