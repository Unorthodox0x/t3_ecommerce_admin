import { execFunction } from "../helpers/queueHelper.js";
import { services } from "../../services/index.js"

/**
 * All notifications use this one execFunction
 * @param data {{object}}
 * @param done
 * @return {Promise<void>}
 */
export async function newNotification(data, done) {
    await execFunction(services.Notifications.NotificationList.insertNotification, data, done);
}

/**
 * @param data {{
 *      queueId: string,
 *      reset_token: string,
 *      userEmail: string
 * }}
 * @param done
 * @return {Promise<void>}
 */
export async function passwordResetRequest(data, done) {
    await execFunction(services.Mail.MailList.RequestPasswordReset, data, done);
}

/**
 * @param data {{
 *      queueId: string,
 *      userEmail: string,
 *      ArtistLabelName: string
 * }}
 * @param done
 * @return {Promise<void>}
 */
export async function confirmPasswordReset(data, done) {
    await execFunction(services.Mail.MailList.ConfirmPasswordReset, data, done);
}

/**
 * @param data
 * @param done
 * @return {Promise<void>}
 */
export async function requestEmailChange(data, done) {
    await execFunction(services.Mail.MailList.RequestEmailChange, data, done);
}

/**
 * @param data {{
 *      queueId: string,
 *      applicantName: string,
 *      applicantEmail: string,
 *      applicantPassword: string,
 * }}
 * @param done
 * @return {Promise<void>}
 */
export async function betaApproved(data, done) {
    await execFunction(services.Mail.MailList.BetaApproved, data, done);
}

/**
 * @param data {{
 *     queueId: string,
 *     applicantName: string,
 *     applicantEmail: string
 * }}
 * @param done
 * @return {Promise<void>}
 */
export async function betaAppReceived(data, done) {
    await execFunction(services.Mail.MailList.BetaAppReceived, data, done);
}

/**
 * @param data {{
 *      queueId: string,
 *      ArtistLabelName: string,
 *      userEmail: string,
 *      releaseTitle: string,
 *      createdAt: Date,
 *      digitalReleaseDate: Date
 * }}
 * @param done
 * @return {Promise<void>}
 */
export async function releaseSuccess(data, done) {
    await execFunction(services.Mail.MailList.ReleaseSuccess, data, done);
}

/**
 * @param data {{
 *      queueId: string,
 *      ArtistLabelName: string,
 *      releaseTitle: string,
 *      userEmail: string
 * }}
 * @param done
 * @return {Promise<void>}
 */
export async function releaseFailed(data, done) {
    await execFunction(services.Mail.MailList.ReleaseFailed, data, done);
}

/**
 * @param data {{
 *      queueId: string,
 *      ArtistLabelName: string,
 *      releaseTitle: string,
 *      userEmail: string
 * }}
 * @param done
 * @return {Promise<void>}
 */
export async function releaseEditsApproved(data, done) {
    await execFunction(services.Mail.MailList.ReleaseEditsApproved, data, done);
}