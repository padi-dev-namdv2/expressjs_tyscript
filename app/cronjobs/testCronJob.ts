const cron = require("node-cron");

export const testCronJob = cron.schedule(
  "* * * * *",
  () => {
    console.log("Running a test Job test");
  },
  {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
  }
);
