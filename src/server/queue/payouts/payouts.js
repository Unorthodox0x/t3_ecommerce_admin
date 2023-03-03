import { services } from "../../services/index.js"
import { execFunction } from "../helpers/queueHelper.js";

/** Quickbooks */
/**
 * @param data {{object}}
 * @param done
 * @return {Promise<void>}
 */
export async function createBill(data, done) {
    await execFunction(services.Quickbooks.quickbookList.createBill, data, done);
}

/**
 * @param data {{object}}
 * @param done
 * @return {Promise<void>}
 */
export async function updateBill(data, done) {
    await execFunction(services.Quickbooks.quickbookList.updateBill, data, done);
}

/**
 * @param data {{object}}
 * @param done
 * @return {Promise<void>}
 */
export async function updateVendor(data, done) {
    await execFunction(services.Quickbooks.quickbookList.updateVendor, data, done);
}

/** Transactions */
/**
 * @param data {{object}}
 * @param done
 * @return {Promise<void>}
 */
export async function createTransaction(data, done) {
    await execFunction(services.Transactions.TransactionList.insertTransaction, data, done);
}

/**
 * @param data {{object}}
 * @param done
 * @return {Promise<void>}
 */
export async function updateTransaction(data, done) {
    await execFunction(services.Transactions.TransactionList.updateTransaction, data, done);
}