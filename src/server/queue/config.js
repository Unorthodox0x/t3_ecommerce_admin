export const RedisHost = process.env.REDIS_HOST;
export const RedisPort = process.env.REDIS_PORT;
export const RedisUrl = process.env.NODE_ENV === "production" ? process.env.REDIS_URL: "";

export const connectionConfig = 
    process.env.NODE_ENV === "production" ? {
        redis: {
            socket: {
                tls: true,
                rejectUnauthorized: false
            },
        }
    } : { 
        redis: {
            host: 'localhost',
            port: 6379,
        }  
    };

//names of the queue workers
export const orderJob = 'payoutsJob';
export const mailJob = 'mailJob';
export const queueForFailedQueues = 'failedQueuesJob';

export const optionsConfig = {
    attempts: 2, // number of retries for each job
    backoff: {
        type: "exponential", //each retry interval will take more time
        delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
};