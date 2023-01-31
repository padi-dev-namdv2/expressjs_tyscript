import { exampleCronJob } from "./exampleCronJob";
import { testCronJob } from "./testCronJob";

export const cronJob = () => {
    console.log("Chạy cron job");
    exampleCronJob.start();
    testCronJob.start();
}
