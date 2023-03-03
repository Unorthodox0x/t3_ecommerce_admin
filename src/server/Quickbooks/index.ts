import makeQuickbookList from "./quickbook-list";
import { configOptions } from "@/server/intuit-auth";
import makeAuthClient from "./qbAuthClient.js";
import { oauthClient } from "@/server/intuit-auth";

const qbAuthClient = makeAuthClient(configOptions, oauthClient);
initQuickBooks({ qbAuthClient });

const quickbookList = makeQuickbookList({ qbAuthClient });


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
}

export {
  quickbookList,
};