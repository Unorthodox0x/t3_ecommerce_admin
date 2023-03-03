import Queue from '../../models/queueModel.js';
import { QueueStatuses } from "./queueStatuses.js";
import {runFailedJobs, runScheduledJobs} from "../producer.js"
import { QueueProcesses } from "../queue-processes.js";
const FailedJobTime = Number(process.env.FAILED_JOB_INTERVAL_TIME) || 5;
const ScheduledJobTime = Number(process.env.SCHEDULED_JOB_INTERVAL_TIME) || 3;


export async function initQueueWorkers() {
    setInterval(()=> {
      runFailedJobs();
    }, FailedJobTime*1000);

    setInterval(()=> {
      runScheduledJobs();
    }, ScheduledJobTime*1000);
}

export async function execFunction(callFunction, params, done){
    const {queueId, ...data} = params;
    try {
        console.log('==================execFunction======================')
        console.log("callFunction", callFunction);
        console.log("params", params);
        await callFunction(data);
        await deleteQueueData(queueId);
        done();
    } catch (error){
        logger.error(`Queue job failed`, `${error.message}`)
        await updateQueueData(queueId, QueueStatuses.failed, error.message);
        done(new Error(error.message));
    }
}

/**
 * @param id {string}
 * @return {Promise<QueueModel>}
 */
export async function findQueueData(id) {
    return await Queue.findById(id)
        .exec()
        .catch((mongoError) => {
            new MongoError(mongoError)
        });
}

/**
 * @return {Promise<QueueModel[]>}
 */
export async function findQueueOnfidoMonitoringQueues(status = [QueueStatuses.inProgress, QueueStatuses.failed]) {
    return await Queue.find({
        status: { $in : status },
        function: QueueProcesses.onfido.usersMonitoring
    })
      .exec()
      .catch((mongoError) => {
          new MongoError(mongoError)
      });
}

/**
 * @return {Promise<QueueModel[]>}
 */
export async function findFailedQueuesData(count = 10) {
    return await Queue.find({
        function:{ $nin: [ QueueProcesses.convertor.ImageResize, QueueProcesses.convertor.AudioConverter ] },
        status: QueueStatuses.failed
    })
        .limit(count)
        .exec()
        .catch((mongoError) => {
            new MongoError(mongoError)
        });
}

/**
 * finds queue jobs that run on this server (file conversion)
 *   updates the status of these jobs to "inProgress", when pulled
 *    to prevent future passes from repeating these jobs
 * @return {Promise<QueueModel[]>}
 */
export async function findScheduledQueuesData(count = 10) {
    return await Queue.find({
        function: { $nin: [ QueueProcesses.convertor.ImageResize, QueueProcesses.convertor.AudioConverter ] },
        status: QueueStatuses.waiting,
    })
        .limit(count)
        .exec()
        .catch((mongoError) => {
            new MongoError(mongoError)
        });
}

/**
 *
 * @param functionName {string}
 * @param data {Object}
 * @param status {string}
 * @return {Promise<string>}
 */
export async function saveQueueData(functionName, data, status = QueueStatuses.waiting) {
    const id = mongoose.Types.ObjectId();

    await Queue
        .create({
            _id: id,
            function: functionName,
            data: data,
            status: status
        })
        .catch((mongoError) => {
            throw new MongoError(mongoError);
        });

    return id;
}

/**
 * @param id {string}
 * @param status {string}
 * @param message {string}
 * @return {Promise<void>}
 */
export async function updateQueueData(id, status, message = '') {
    await Queue.findByIdAndUpdate({_id: id}, {status: status, message: message});
}

/**
 * Called immediately after "waiting" jobs are pulled from queue collection
 * Uses bulkWrite to update all job status faster to decrease the likelyhood
 * of a request pulling a job from DB that is already in progress.
 * @params activeQueueJobs {array}
 * @return {Promise<void>}
 */
export async function updateQueuesActive(activeQueueJobs){
    try{
        const updateJobOperations = activeQueueJobs.map((job) => {
            return {
            updateOne: {
                filter: { 
                   _id: job._id
                },
                update: { $set: {
                    status: QueueStatuses.inProgress,
                } },
              },
            };
        });
        
        await Queue.bulkWrite(updateJobOperations);
    }catch (error){
        logger.info('Jobs Failed update to active')
    }
}


/**
 * @param id {string}
 * @return {Promise<void>}
 */
export async function deleteQueueData(id) {
    await Queue.deleteOne({_id: id});
}