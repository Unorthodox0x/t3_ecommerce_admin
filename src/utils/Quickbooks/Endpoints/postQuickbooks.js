import makeHttpError from "../../../utils/Errors/http-error.js";
import * as logger from "../../../utils/Logger/index.js";
import {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError,
} from "../../../utils/Errors/errors.js";

/** Post Requests for Quickbooks Data
 *
 * @returns object {response} result of operation on dataset or csv data
 **/
async function postQuickbooks({ httpRequest, quickbookList, UserList }) {
  const { path, user } = httpRequest || {};
  const { userId } = user || {};
  const { reqUserId } = httpRequest.queryParams || {};

  //TODO: MOVE QB VENDOR CREATION
  //QUEUE JOB AT THE END OF userList.create FUCTION
  try {
    const newUser = //fetch a single user (on Account creation)
      path === "/create_qb_vendor" && reqUserId !== null
        ? await UserList.getUser({ userId: reqUserId })
        : null 
    const result =
      path === "/create_qb_vendor" &&  newUser !== null
        ? await quickbookList.createQBVendor({ newUser })
        : path === "/create_master_account"
        ? await quickbookList.createMasterAccount() //create UCM master account | required in api requests to create vendors&&bills
      // : path === "/webhooks"  //not yet enabled
      //   ? await quickbookList.handleWebhook({body: httpRequest.body})
      : null;

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      data: JSON.stringify(result),
    };
  } catch (e) {
    console.log(e);
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

export default postQuickbooks;