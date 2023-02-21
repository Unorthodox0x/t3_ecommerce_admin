import getQuickbooks from "./Endpoints/getQuickbooks.js";
import postQuickbooks from "./Endpoints/postQuickbooks.js";
import deleteQuickbooks from "./Endpoints/deleteQuickbooks.js";
import makeHttpError from "../../utils/Errors/http-error.js";

// this function takes a request from express, and decides what route to call,
// based on information present in requeset
export default function makeQuickbooksEndpointHandler({
  qbAuthClient,
  quickbookList,
  UserList
}) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      case "GET":
        return getQuickbooks({
          httpRequest,
          qbAuthClient,
          quickbookList,
        });
      case "POST":
        return postQuickbooks({
          httpRequest,
          quickbookList,
          UserList
        });
      case "DELETE":
        return deleteQuickbooks({
          httpRequest,
          qbAuthClient
        })
      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };
}
