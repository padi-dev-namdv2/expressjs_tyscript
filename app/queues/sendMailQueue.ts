import Bull = require('bull');
import emailProcess from '../processes/emailProcess';
import { redisConfig } from '../../config/redisConfig';
// const Queue = require('bull');
// const { ExpressAdapter, createBullBoard, BullAdapter, BullMQAdapter } = require('@bull-board/express');

const emailQueue = new Bull('email', {
    redis: process.env.REDIS_URL
});

emailQueue.process(emailProcess);

export const sendNewEmail = (data: any) => {
    emailQueue.add(data, {
        attempts: 1,
        delay: 50000
    });
};
