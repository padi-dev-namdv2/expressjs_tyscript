import { exampleCronJob } from "./exampleCronJob";

export const cronJob = () => {
    console.log("Chạy cron job");
    exampleCronJob.start();
}