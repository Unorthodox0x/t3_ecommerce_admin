import makeHttpError from "../../../utils/Errors/http-error.js";
import * as logger from "../../../utils/Logger/index.js";
import {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError,
} from "../../../utils/Errors/errors.js";

/** Get Requests for Quickbooks Data
 *
 * @Flow
 *  Extract varialbles && path from httpRequest
 *
 * Error Handling
 *    Validation of variables
 *    Reject missing vars
 *
 * List of all api endpoints and actions taken on release dataset
 *
 * Post processing of CSV data requests
 *
 * @returns object {response} result of operation on dataset or csv data
 **/
async function getQuickbooks({ httpRequest, qbAuthClient, quickbookList }) {
  const { url, path } = httpRequest || {};
  try {    
    const result =
      path === "/auth_url"
        ? await qbAuthClient.getAuthUrl()
        : path === "/callback" // Qb Authentification callback
        ?  await qbAuthClient.setTokenFromCallback({ url }) //sends to any url that his here? secure?
        : path === "/token_info"
        ? await qbAuthClient.tokenInfo()
        : null;

    if(result && path==="/callback"){
      return {
        headers: {
          Location: process.env.QUICKBOOKS_REDIRECT_URL,
        },
        statusCode: 301,
        data: {},
      };
    }else {
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        data: JSON.stringify(result),
      };
    }
  } catch (e) {
    console.log('e',e)
    return makeHttpError({
      errorMessage: e.message,
      statusCode:
        e instanceof UniqueConstraintError
          ? 409
          : e instanceof InvalidPropertyError ||
            e instanceof RequiredParameterError
          ? 400
          : 500,
    });
  }
}

export default getQuickbooks;
