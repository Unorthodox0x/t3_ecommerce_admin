import {  QuickbooksClient } from "node-quickbooks";
import { generateToken, qbConfigJson } from "@/server/intuit-auth";
// import * as logger from "../../utils/Logger/index.js";

/**
 * Retrieve QuickBooks controller using node-quickbooks
 * Create Quickooks connection
 * Returns object containing function for interacting with 
 *   quickbooks api, (getBill, createVendor, etc...)
 */
const token = await generateToken();

export const configOptions: QuickbooksClient.QuickbooksClientConfig = {
  consumerKey: qbConfigJson.clientId,
  consumerSecret: qbConfigJson.clientSecret,
  token: token.access_Token,
  tokenSecret: "", //no token secret for oAuth 2.0
  realmId: token.realmId,
  useSandbox: false,
  debug: false,
  endpoint: process.env.QUICKBOOKS_ENVIRONMENT === "sandbox"
    ? 'https://sandbox-quickbooks.api.intuit.com/v3/company/'
    : 'https://quickbooks.api.intuit.com/v3/company/',
  testEmail: "",  // Use this email address for testing send*Pdf functions
  minorVersion: "",
  oAuthVersion: "2.0",
  refreshToken: token.refresh_Token // refreshToken
}

export const createClient = async():Promise<QuickbooksClient> => { //always constructed when needed to ensure valid token
  try {
    return new QuickbooksClient(configOptions);
  } catch (err) {
    // logger.debug("Quickbooks Api error:", `${err}`);
    throw new Error(err?.message);
  }
}