import QuickBooks from "node-quickbooks";
import OAuthClient from "intuit-oauth";
import * as logger from "../../utils/Logger/index.js";
 
export const configOptions = {
  scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
  realmId: process.env.QUICKBOOKS_REALM_ID,
  validWindow:3600, //1hour 
  expireOffset:120, // 5 mins
}

const qbConfigJson = {
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    environment: process.env.QUICKBOOKS_ENVIRONMENT,
    redirectUri: process.env.QUICKBOOKS_CALLBACK_URL, //endpoint to s
    logging: false,
};

export const oauthClient = new OAuthClient(qbConfigJson);  

/**
 * Retrieve QuickBooks controller using node-quickbooks
 * Create Quickooks connection
 * Returns object containing function for interacting with 
 *   quickbooks api, (getBill, createVendor, etc...)
 */
export const makeQBApi = async() => { //always constructed when needed to ensure valid token
  try {
    const { clientId, clientSecret } = oauthClient;
    const token = await oauthClient.getToken();
    return await new QuickBooks(
      qbConfigJson.clientId, // consumerKey
      qbConfigJson.clientSecret, // consumerSecret
      token.access_token, // oauthToken,
      false, // no token secret for oAuth 2.0
      token.realmId, // realmId
      process.env.QUICKBOOKS_ENVIRONMENT !== "production", //if true, sandbox mode
      false, // enable debugging?
      // endpoint: process.env.QUICKBOOKS_ENVIRONMENT==="sandbox"
      //   ? 'https://sandbox-quickbooks.api.intuit.com/v3/company/' 
      //   : 'https://quickbooks.api.intuit.com/v3/company/',
      null, // set minorversion, or null for the latest version
      "2.0", //oAuth version
      token.refresh_token // refreshToken
    );
  } catch (err) {
    console.log('')
    logger.debug("Quickbooks Api error:", `${err}`);
    throw new Error(err);
  }
}