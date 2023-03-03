export const QueueProcesses = {
    mail: {
        betaApprovedEmail: 'BETA_APPROVED_EMAIL',
        betaApplicationReceived: 'BETA_APPLICATION_RECEIVED_EMAIL',
        passwordResetRequest: 'REQUEST_PASSWORD_RESET_EMAIL',
        passwordResetConfirm: 'CONFIRM_PASSWORD_RESET_EMAIL',
        emailChangeRequest: 'CHANGE_EMAIL_REQUEST',
        releaseScheduled: 'RELEASE_SCHEDULED_EMAIL',
        releaseFailed: 'RELEASE_FAILED_EMAIL',
        releaseEditApproved: 'RELEASE_EDITS_APPROVED_EMAIL',
    },
    quickbook: {
        createBill: 'CREATE_BILL',
        updateBill: 'UPDATE_BILL',
    },
}

/**
 * @param processName {string}
 * @return {string}
 */
QueueProcesses.getProcessesType = function (processName) {
    return Object.keys(this).find((processType) => {
        const processValues = Object.values(QueueProcesses[processType]);

        return processValues.find((exactName) => exactName === processName);
    });
}

/**
 * @param processType {object}
 * @param processName {string}
 * @return {boolean}
 */
export function hasValue(processType, processName) {
    return Object.values(processType).includes(processName);
}