import mongoose from 'mongoose' //only used for _id: mongoose.Types.ObjectId().toString(),
import requiredParam from '../../../utils/Errors/required-param.js';
import { InvalidPropertyError } from '../../../utils/Errors/errors.js';
import moment from 'moment';
import * as logger from "../../../utils/Logger/index.js";
import dateIsValid from "../../../utils/Validation/date-is-valid.js";
import validateObjectId from "../../../utils/Validation/validate-object-id.js";
import {Payout} from "../../Transactions/models/payouts.js"

/** defines what a quickbooks bill is
 * Convert Royalty data from a given month for a user to Quickbooks Bill data
 * @param {royaltiesByUser} {all royalty info in a month grouped by user}
 * @returns {Object}
 * 
 */
export default async function makeQuickbookBill({ 
  normalTransaction=requiredParam("Transaction info"),
  vendorId=requiredParam("vendorId"),
  DisplayName=requiredParam("vendor display name"),
  Id, //string | null
  SyncToken, //string | null
}) {

  try{
    const normalBill = normalize({ 
      normalTransaction, vendorId, DisplayName,
        Id, SyncToken
    })
    return Object.freeze(normalBill);
  }catch(validateErr){
    logger.debug(`Bill validation failed`, `${validateErr}`)
    throw new Error(validateErr)
  }

  function normalize ({ 
        normalTransaction, vendorId, DisplayName,
        Id, SyncToken
  }={}) {
    const completedStatuses = [
      Payout.Statuses.Circle.success, 
      Payout.Statuses.Circle.failed,
      Payout.Statuses.Borderless.success,
      Payout.Statuses.Borderless.failed,
    ]

    return {
      Id: !!Id ? Id: null,
      SyncToken: !!SyncToken ? SyncToken: 0, //ommitting causes QB to generate, default: 0
      domain: "QDO",
      VendorRef: {
        name: DisplayName,
        value: vendorId
      },
      TotalAmt: normalTransaction.txnAmount, //quickbooks performs rounding to 2 decimals, so roundedTotal is used
      DueDate: normalTransaction.period.startDate, //the original date event occured (i.e. date royalties were earned)
      CurrencyRef: normalTransaction.currencyRef, //:{
      //   "name": "United States Dollar", 
      //   "value": "USD"
      // },
      Line: [
        {
          DetailType: "AccountBasedExpenseLineDetail", 
          AccountBasedExpenseLineDetail:{ //this is required.
            AccountRef: {
              name: "Unchained Music", //name of UCM master account
              value: process.env.QUICKBOOKS_UMC_ACCOUNT //not same as vendorObject, only one "master account" exists. All vendors bound to this account
            },
          },
          Id: null, //must be a number, ids generated for Borderless&&Circel are strings, 
          Description: `${normalTransaction.description}: ${normalTransaction.txnId}`,
          Amount: normalTransaction.txnAmount,
        }
      ],
      Balance: 
        completedStatuses.indexOf(normalTransaction.status) === -1 
        ?  0 
        : normalTransaction.amountDue, 
        //0 indicates paid (i.e. no further action required in quickbooks)
        //for Royalty Bills, UCM has already received the money for these bills and now further action is required
        //for Payout Request, the initial status of a bill is "pending", so the Balance of the bill must be === amountDue
          //until updated payout information received in response from borderless or circle
    }; //Transaction data should be fully prepped for storage in database
  }
}