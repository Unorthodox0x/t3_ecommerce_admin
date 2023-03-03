import { hasValue, QueueProcesses } from "./queue-processes.js";
import {
    RedisUrl,
    connectionConfig,
    optionsConfig,
    payoutsJob,
    mailJob,
    queueForFailedQueues,
    onfidoMonitoringJob
} from "./config.js";
import { findFailedQueuesData, findScheduledQueuesData, saveQueueData, updateQueueData, updateQueuesActive } from "./helpers/queueHelper.js";
import { QueueStatuses } from "./helpers/queueStatuses.js";
import * as logger from "../utils/Logger/index.js";
import Queue from "bull"
import {
    newNotification,
    betaAppReceived,
    betaApproved,
    confirmPasswordReset,
    passwordResetRequest,
    releaseEditsApproved,
    releaseFailed,
    releaseSuccess,
    requestEmailChange,
} from "./mail/mail.js";
import {
    linkPlaidAccount,
    circleAccountStatusUpdated,
    createBill,
    createTransaction,
    updateAccount,
    updateBalance,
    updateBill,
    updateTransaction,
    updateVendor, onfidoUsersManualMonitoring, validateUserOnfidoStatus
} from "./payouts/payouts.js";

const payoutsQueue = new Queue(payoutsJob, RedisUrl, connectionConfig);
const onfidoMonitoringQueue = new Queue(onfidoMonitoringJob, RedisUrl, connectionConfig);
const mailQueue = new Queue(mailJob, RedisUrl, connectionConfig);
const failedQueuesWorker = new Queue(queueForFailedQueues, RedisUrl, connectionConfig);

payoutsQueue.on('error', (error) => {
    console.log('payoutsQueue', error);
})
mailQueue.on('error', (error) => {
    console.log('mailQueue', error);
})
failedQueuesWorker.on('error', (error) => {
   console.log('failedQueue', error);
})

/**
 * @param functionName {string}
 * @return {any}
 */
function getQueueWorkerName(functionName) {
    switch (true) {
        case hasValue(QueueProcesses.mail, functionName):
        case hasValue(QueueProcesses.notifications, functionName):
            return mailQueue;
        case hasValue(QueueProcesses.plaid, functionName):
        case hasValue(QueueProcesses.circle, functionName):
        case hasValue(QueueProcesses.quickbook, functionName):
        // case hasValue(QueueProcesses.borderless, functionName):
        case hasValue(QueueProcesses.transactions, functionName):
        case hasValue(QueueProcesses.userFinancialAccount, functionName):
            return payoutsQueue;
        case hasValue(QueueProcesses.onfido, functionName):
            return onfidoMonitoringQueue;
        default:
            return failedQueuesWorker;
    }
}

/**
 * @property {QueueModel} queueData
 * @return {Promise<void>}
 */
export const runFailedJobs = async () => {
    let queueId; //needed to revert info about last queueModel in case of error
    const queuesData = await findFailedQueuesData();
    
    try {
        await updateQueuesActive(queuesData);
        queuesData.map(queueData => {
            queueId = queueData._id;           
            const worker = getQueueWorkerName(queueData.function);
            worker.add(queueData.function, {...queueData.data, queueId}, optionsConfig)
        });
    } catch (error) {
        console.error(error.message)
        await updateQueueData(queueId, QueueStatuses.failed, error.message);
    }
};

/**
 * @property {QueueModel} queueData
 * @return {Promise<void>}
 */
export const runScheduledJobs = async () => {
    let queueId; //needed to revert info about last queueModel in case of error
    const queuesData = await findScheduledQueuesData();
    try {
        await updateQueuesActive(queuesData);
        queuesData.map(queueData => {
            queueId = queueData._id;
            console.log('queueData', queueData);
            const worker = getQueueWorkerName(queueData.function);
            worker.add(queueData.function, {...queueData.data, queueId}, optionsConfig)
        });
    } catch (error) {
        console.error(error.message)
        await updateQueueData(queueId, QueueStatuses.failed, error.message);
    }
};

/**
 * @param options {string}
 * @param data {Object}
 */
export const createJob = async (options, data, retryCount = 0) => {
    try{

        return await saveQueueData(options, data);
    }catch(createErr){
        retryCount +=1
        if(retryCount<5){
            return await createJob(options, data, retryCount)
        }else {
            throw new Error(createErr)
        }
    }
};

/** Quickbooks */
payoutsQueue.process(QueueProcesses.quickbook.createBill, (job, done) => createBill(job.data, done));
payoutsQueue.process(QueueProcesses.quickbook.updateBill, (job, done) => updateBill(job.data, done));
payoutsQueue.process(QueueProcesses.quickbook.updateVendor, (job, done) => updateVendor(job.data, done));
/** Transactions */
payoutsQueue.process(QueueProcesses.transactions.createTransaction, (job, done) => createTransaction(job.data, done));
payoutsQueue.process(QueueProcesses.transactions.updateTransaction, (job, done) => updateTransaction(job.data, done));

/** UserFinancialAccount */
payoutsQueue.process(QueueProcesses.userFinancialAccount.updateAccount, (job, done) => updateAccount(job.data, done));
payoutsQueue.process(QueueProcesses.userFinancialAccount.updateBalance, (job, done) => updateBalance(job.data, done));

/** Circle */
payoutsQueue.process(QueueProcesses.circle.linkPlaidAccount, (job, done) => linkPlaidAccount(job.data, done));

/** Plaid */
payoutsQueue.process(QueueProcesses.plaid.circleAccountStatusUpdated, (job, done) => circleAccountStatusUpdated(job.data, done));

/** Borderless */
// payoutsQueue.process(QueueProcesses.borderless.borderlessMassPayout, (job, done) => circleAccountStatusUpdated(job.data, done));

/** Onfido */
onfidoMonitoringQueue.process(QueueProcesses.onfido.usersMonitoring, (job, done) => validateUserOnfidoStatus(job.data, done));
onfidoMonitoringQueue.process(QueueProcesses.onfido.usersMonitoringStart, (job, done) => onfidoUsersManualMonitoring(job.data, done));


/** Notifications */
mailQueue.process(QueueProcesses.notifications.newNotification, (job, done) => newNotification(job.data, done));
/** Mail */
mailQueue.process(QueueProcesses.mail.passwordResetRequest, (job, done) => passwordResetRequest(job.data, done))
mailQueue.process(QueueProcesses.mail.passwordResetConfirm, (job, done) => confirmPasswordReset(job.data, done))
mailQueue.process(QueueProcesses.mail.emailChangeRequest, (job, done) => requestEmailChange(job.data, done));
mailQueue.process(QueueProcesses.mail.betaEmailApproved, (job, done) => betaApproved(job.data, done))
mailQueue.process(QueueProcesses.mail.betaApplicationReceived, (job, done) => betaAppReceived(job.data, done))
mailQueue.process(QueueProcesses.mail.releaseScheduled, (job, done) => releaseSuccess(job.data, done))
mailQueue.process(QueueProcesses.mail.releaseFailed, (job, done) => releaseFailed(job.data, done))
mailQueue.process(QueueProcesses.mail.releaseEditApproved, (job, done) => releaseEditsApproved(job.data, done))