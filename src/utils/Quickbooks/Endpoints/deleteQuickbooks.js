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
async function deleteQuickbooks({ httpRequest, qbAuthClient }) {
  const { path, user } = httpRequest || {};

  //TODO: MOVE QB VENDOR CREATION
  //QUEUE JOB AT THE END OF userList.create FUCTION
  try {
    switch(path){
      case "token/delete":
        return await qbAuthClient.deleteToken()
        break;
      default:
        throw new Error('Invalid Request')
    }

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

export default deleteQuickbooks;