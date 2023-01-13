import Bull = require('bull');
import emailProcess from '../processes/emailProcess';
import { redisConfig } from '../../config/redisConfig';
const Queue = require('bull');
const { ExpressAdapter, createBullBoard, BullAdapter, BullMQAdapter } = require('@bull-board/express');
const someQueue = new Queue('someQueueName'); // if you have a special connection to redis.
const someOtherQueue = new Queue('someOtherQueueName');
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
const { addQueue, removeQueue, setQueues } = createBullBoard({
  queues: [new BullAdapter(someQueue), new BullAdapter(someOtherQueue)],
  serverAdapter: serverAdapter,
});
const emailQueue = new Bull('email', {
    redis: process.env.REDIS_URL
});

setQueues([
    new BullAdapter(emailQueue)
]);

emailQueue.process(emailProcess);

export const sendNewEmail = (data: any) => {
    emailQueue.add(data, {
        attempts: 1,
        delay: 50000
    });
};
