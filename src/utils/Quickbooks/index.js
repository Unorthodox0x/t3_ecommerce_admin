import makeQuickbookList from "./quickbook-list.js";
import { makeQBApi, configOptions, oauthClient } from "./config.js";
import makeAuthClient from "./qb-auth-client.js";
import makeQuickbooksEndpointHandler from "./endpoint-handler.js";
import QuickbooksToken from "../../models/quickbooksTokenModels.js";
import UserQuickbook from "../../models/userQuickbookModel.js";
import {UserList} from "../Users/index.js"
import Transaction from "../../models/transactionsModel.js"

const qbAuthClient = makeAuthClient({configOptions, oauthClient});
initQuickBooks({ qbAuthClient });

const quickbookList = makeQuickbookList({ qbAuthClient, UserQuickbook, Transaction });
const handleQuickbooksRequest = makeQuickbooksEndpointHandler({
  qbAuthClient,
  quickbookList,
  UserList,
});

/**
 *  Run one time, in this file. 
 *   scheduleRefresh initializes a continual internal loop
 */
export async function initQuickBooks({ qbAuthClient }) {
  try{
      console.log('Quickbooks init start...')
      await qbAuthClient.attemptRestoreToken();
      qbAuthClient.scheduleRefreshToken();  
      console.log('Quickbooks init finish...')
  }catch(error){
    console.log('Quickbooks Initialization error:', error)
    throw new Error(error)
  }
};

export {
  quickbookList,
  handleQuickbooksRequest
};



