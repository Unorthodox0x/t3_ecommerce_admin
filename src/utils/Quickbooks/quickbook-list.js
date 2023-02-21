import mongoose from "mongoose";
import _ from "lodash";
import * as logger from "../../utils/Logger/index.js";
import validateObjectId from "../../utils/Validation/validate-object-id.js"
import { QuickbooksError } from "../../utils/Errors/errors.js";
import { MongoError } from "../../utils/Errors/mongo-errors.js";
import makeTransaction from "../Transactions/Validation/transaction.js";
import makeQuickbookBill from "./Validation/bill.js"
import makeQuickbookVendor from './Validation/vendor.js';
import { QueueProcesses } from "../../queue/queue-processes.js";
import { createJob } from "../../queue/producer.js";
import { Payout } from "../Transactions/models/payouts.js";
import { makeQBApi } from "./config.js";

export default function makeQuickbookList({ qbApi, UserQuickbook, Transaction }) {

  /**
   * Creates a Master account for UCM to include in
   * all vendor transactions 
   * 
   * This master account is not stored in our db
   *   the account's Id is necessary for future calls to interact
   *     with quickbooks api tools, (all???) 
   */
  const createMasterAccount = async() => {
    try{
      const MasterAccount = {
        //Id: //undefined for QB to generate
        //SyncToken to be defined by QB
        Name: "UnchainedMusic App",
        domain: "qbApi",
        AccountType: "Expense",
        CurrencyRef: {
          "name": "United States Dollar", 
          "value": "USD"
        },
      }
      const { accountObject, resolveErr } = await createAccount(MasterAccount)
        .then((accountObject) => { return { accountObject } })
        .catch((resolveErr) => { throw new QuickbooksError(resolveErr) });

      if(resolveErr) throw new QuickbooksError(resolveErr);
      logger.info('Master account created', `${accountObject}`)
    }catch(error){
      logger.debug(`Create UCM account failed`, `${error}`)
      throw new Error(error)
    }
  }

  /**
   * Create a vendor
   *   Called from admin user management page.
   * If created, proceed to store Vendor Info in DB
   * @param { newUser } object
   * @returns updateUCMVendor()
   */
  const createVendor = async ({ newUser }) => {
    try{
      const { createdVendor, resolveErr } = await createQBVendor({ newUser })
        .then((createdVendor) => { return { createdVendor } })
        .catch((resolveErr) => { throw new QuickbooksError(resolveErr) });

      if (resolveErr) throw new QuickbooksError(resolveErr)
      logger.info('new vendor created') 
      return await updateUCMVendor({
        userId: newUser._id, 
        Id: createdVendor.Id,
        SyncToken: createdVendor.SyncToken,
      });
    }catch(error){
      logger.debug(`create vendor failed`, error)
      throw new Error(error)
    }
  }

   /** ||| FETCH FROM DB && QUICKBOOS |||
   * Get quickbooks ID and SyncToken of user-vendor
   * 1. Request to Mongoose, for userQuickbook object
   * 2. Calls qbApi to verify that sync token stored in db is most current
   * Possible for token to not match if an update
   *  occurs to object in quickbook's server, 
   *   but that update not is saved in our db
   * //TODO: CHECK SYNC TOKENS MATCH, IF NOT THROW ERR
   * @param {string} userId
   * @returns {Object} {Id:string, SyncToken:string}
   */
  const getVendor = async ({ userId }) => {
    try{
      const uQbInfo = await getUCMVendor({ userId })
      const Id = uQbInfo[0]?.qbId //should only be 1 in array
      
      if(!Id) throw new Error('Vendor not found')
      const { vendorObject, resolveErr } = await getQBVendor({ Id })
        .then((vendorObject) => { return { vendorObject } })
        .catch((resolveErr) => { throw new QuickbooksError(resolveErr) });
      
      if(resolveErr) throw new QuickbooksError(resolveErr)
      if(!vendorObject) throw new Error('Vendor not found')      
      if(!!vendorObject && !!uQbInfo) return { vendorObject, uQbInfo };
    }catch(error){
      logger.debug(`Get Vendor fail`, error)
      throw new Error(error)
    }
  }

  /** ||| FETCH FROM  DB ||| 
   * @returns {array} single user Quickbook Object
   */
  const getUCMVendor = async ({ userId }) => {
    try{
      const validId = validateObjectId(userId)
      return await UserQuickbook.find({ userId: validId })
        .catch((mongoError) => { throw new MongoError(mongoError) });
    } catch(error){
      logger.debug('error', `${error}`)
      throw new Error(mongoError)
    }
  }

  /**
   * Update a vendor [Stored in QB && UCM]
   *   currently called from queue tasks schedules after updates
   *    to user's info in userList. Keeps User's info current with
   *     quickbooks data. (name, email, ...)
   */
  const updateVendor = async ({ existingUser }) => {
    try{
      const { vendorObject, uQbInfo } = await getVendor({ userId: existingUser._id, });
      const { Id, SyncToken } = vendorObject;

      const { updatedVendor, resolveErr } = await updateQBVendor({ existingUser, Id, SyncToken })
        .then((updatedVendor) => { return { updatedVendor } })
        .catch((resolveErr) => { throw new QuickbooksError(resolveErr) });

      logger.info("QB vendor updated")
      if (resolveErr) throw new QuickbooksError(resolveErr)
      return await updateUCMVendor({
        userId: existingUser._id, 
        Id: updatedVendor.Id,
        SyncToken: updatedVendor.SyncToken
      });
    }catch(error){
      logger.debug(`Update vendor failed`, error)
      throw new Error(error)
    }
  }

   /**   |||  INTERACTS WITH DB  |||
   *     [ UPDATE | CREATE ] (upsert)
   * Update quickbooks ID and SyncToken of user-vendor
   *   update vendor, then call to update userFinancialAccount
   *  - 1st time called, creates new user, (createVendor)
   *  - future requests update sync token to keep stored syncToken 
   *     current with item syncToken in Quickbooks
   * @param {userId} string
   * @returns {Object} | {Id:string, SyncToken:string }
   */
  const updateUCMVendor = async ({ userId, Id, SyncToken }) => {
    try{
      const validId = validateObjectId(userId)
      const result = await UserQuickbook
        .findOneAndUpdate({
          userId:validId
        },{
          $set:{
            qbId:Id,
            qbSyncToken:SyncToken,
          }
        }, { 
          upsert: true,
          new: true, //if false, returns null on upsert
      }).catch((mongoError) => {
        throw new MongoError(mongoError);
      });

      //can use upserted Count to decide schedule task???
      if(!!result._id){
        return await createJob(
            QueueProcesses.userFinancialAccount.updateAccount,
            {
              userId: mongoose.Types.ObjectId(userId),
              data: { quickbooksAccount: result._id }
            }
        );
      } else {
        logger
        throw new Error('Stored Vendor not modified')
      } 
    }catch(error){
      logger.debug(`Update UCM vendor`, `${error}`)
      throw new Error(error)
    }
  };

  /**
   *  1. getVendor pulls user Id, SyncToken from Database
   *  2. qbApi.getVendor gets vendor account info from quickbooks
   *  3. makeBill formats {royaltiesByMusicians} into bill for each artist list.
   *  4. qbApi.createBill
   *  5. emit TRANSACTION_CREATE event
   * 
   *  @params {TransactionInfo} { userId, period, amountEarned, amountDue }
   *  @params {amountEarned} | number | amount of royalties earned by user in a month
   *  @params {amountDue} | number | conditionally present if amount paid to user in month is less than amount earned by user
   */
  const createBill = async({ TransactionInfo }) => {
    try{
      const {normalTransaction} = makeTransaction({ TransactionInfo })
      const {vendorObject} = await getVendor({ userId: normalTransaction.userId });
      const { Id:vendorId, DisplayName }= vendorObject;

      const { createdBill, resolveErr } = await createQBBill({  
        normalTransaction, vendorId, DisplayName
      }).then((createdBill) => { return { createdBill } })
        .catch((resolveErr) => { throw new QuickbooksError(resolveErr) });

      if (resolveErr) throw new QuickbooksError(resolveErr);
      if(!!createdBill){
        const createdUCMBill = await createUCMBill({ 
          userId: normalTransaction.userId, 
          billObject:createdBill,
          normalTransaction
        })
        if(!!createdUCMBill.acknowledged && 
          createdUCMBill.modifiedCount===1
        ){
          logger.info('Bill creation complete', createdUCMBill)
          return !!createdUCMBill.acknowledged
        }else{
          logger.info('createdUCMBill', createdUCMBill)
          throw new Error("UCM bill not created")
        }
      }
    }catch(error){
      logger.debug(`bill creation err`, error)
      throw new Error(error)
    }
  }

 /**
   * Bill requirements, 
   *   -VendorRef {Id, DisplayName}
   *   -billId && billSyncToken
   * Use userId in txnInfo to fetch user vendor objects
   * Use TxnId, to extract bill from uQbInfo
   * package bill 
   */
  const updateBill = async({ TransactionInfo }) => {
    try{
      const {normalTransaction} = makeTransaction({ TransactionInfo })
      const {vendorObject, uQbInfo} = await getVendor({ userId: normalTransaction.userId });
      const {Id:vendorId, DisplayName} = vendorObject;
      const UCMBill = extractUCMBillByTxnId({ uQbInfo, normalTransaction })
      const {billId:Id, billSyncToken:SyncToken} = UCMBill[0] || {};
      if(!Id || !SyncToken) throw new Error('bill not found');

      logger.info('updatable bill found');
      const { updatedBill, resolveErr } = await updateQBBill({  
          normalTransaction, vendorId, DisplayName,
            Id, SyncToken 
      }).then((updatedBill) => { return { updatedBill } })
        .catch((resolveErr) => { throw new QuickbooksError(resolveErr) });

      if (resolveErr) throw new QuickbooksError(resolveErr);
      if(updatedBill){
        const updatedUCMBill = await updateUCMBill({
          normalTransaction, 
          billObject:updatedBill
        });
        //confirm udpate success or throw err
        if(!!updatedUCMBill.acknowledged && 
          updatedUCMBill.modifiedCount===1
        ){
          logger.info('Bill update complete', updatedUCMBill)
          return !!updatedUCMBill.acknowledged
        }else{
          logger.info('updatedUCMBill', updatedUCMBill)
          throw new Error("UCM bill not created")
        }
      }
    } catch(billCreateErr) {
      console.log('bill update error', `${TransactionInfo.txnId}`)
      throw new Error(`error on bill update` )
    }
  }

  /**   |||  INTERACTS WITH DB  |||
   * - After receiving response from request to createBill, 
   *     this function is called to update the bill in our DB
   * - Pushes bill to array of all bill attributed user userQuickbook object
   * - Both initial creatioin and future updates route through here,
   *     Borderless uses description as txnId on first pass,
   *       on update, txnId is updated with Boderless paymentReferenceId 
   */
  async function createUCMBill({ userId, billObject, normalTransaction }) {
    const validId = validateObjectId(userId)    
    return await UserQuickbook.updateOne({ userId:validId }, 
    { $push: { 
        qbBills: {
          billId: billObject.Id, //quickbooks generated unique identifier
          billSyncToken: billObject.SyncToken, //default to 0 for new bill
          txnId: normalTransaction.txnId
      } } 
    },{
      upsert:true,
    }).catch((mongoError) => {
        logger.debug(`Fail save UserQuickbooks bill ${billObject.Id} for Amount ${billObject.TotalAmt}`, `${mongoError}`)
        throw new MongoError(mongoError);
    });
  }
   
  /**   |||  INTERACTS WITH DB  |||
   * - After receiving response from request to createBill, 
   *     this function is called to update the bill in our DB
   * - Pushes bill to array of all bill attributed user userQuickbook object
   * - Both initial creatioin and future updates route through here,
   *     Borderless uses description as txnId on first pass,
   *       on update, txnId is updated with Boderless paymentReferenceId 
   */
  async function updateUCMBill({ billObject, normalTransaction }) {
    const validId = validateObjectId(normalTransaction.userId);
    const {serviceType, originalTxnId, txnId} = normalTransaction;
    return await UserQuickbook
      .updateOne({
        userId: validId,
        'qbBills.billId' : billObject.Id
      }, {
        $set : {
          'qbBills.$.billSyncToken' : billObject.SyncToken,
          'qbBills.$.txnId' : serviceType === Payout.ServiceType.Borderless ? originalTxnId:txnId
        },
      }).catch((mongoError) => {
        logger.debug(`Fail save UserQuickbooks bill ${billObject.Id} for Amount ${billObject.TotalAmt}`, `${mongoError}`)
        throw new MongoError(mongoError);
    });
  }

  /**
   * On bill update, the exact billId is required to interact with bill
   *  in quickbooks server.
   * A txnId is present in userQuickbooks bill. Using this txnId
   *   find billId from our database. 
   * @params {uQbInfo} | Object, userQuickbook Account object
   * @params {txnId}|string find find bill matching exact transaction
   */
  const extractUCMBillByTxnId = ({ uQbInfo, normalTransaction }) => {
    try{
      if(!uQbInfo||uQbInfo.length===0) throw new Error("Stored vendor not found");
      switch(normalTransaction.serviceType){
        case Payout.ServiceType.Borderless:
          return uQbInfo[0].qbBills.filter((bill) => bill.txnId === normalTransaction.originalTxnId )
          break
        case Payout.ServiceType.Circle:
          return uQbInfo[0].qbBills.filter((bill) => bill.txnId === normalTransaction.txnId)
          break
        default:
          throw new Error('Unsupported bill type');
      }
    }catch(error){
      logger.debug('bill not found', `${error}`)
      throw new Error(error);
    }
  }

  /**
   * Only one master account can exist at a time. 
   */
  const createAccount = async (MasterAccount) => {
    const qbApi = await makeQBApi(); //init with most recent token
    return new Promise((resolve, reject) => {
      qbApi.createAccount(MasterAccount, (resolveErr, accountObject) => {
        if (resolveErr) return reject(resolveErr);
        resolve(accountObject);
      });
    });
  };

  const createQBVendor = async({ newUser }) => {
    const qbApi = await makeQBApi(); //init with most recent token
    const normalVendor = await makeQuickbookVendor({ user:newUser, Id:null, SyncToken:null });
    return new Promise((resolve, reject) => {
      qbApi.createVendor(normalVendor, (resolveErr, createdVendor) => {
        if (resolveErr) return reject(resolveErr);
        resolve(createdVendor);
      });
    });
  };

  const getQBVendor = async({ Id }) => {
    const qbApi = await makeQBApi(); //init with most recent token
    return new Promise((resolve, reject) => {
      qbApi.getVendor(Id, (resolveErr, vendorObject) => {
        if (resolveErr) return reject(resolveErr);
        resolve(vendorObject);
      });
    });
  };

  const updateQBVendor = async({ existingUser, Id, SyncToken }) => {
    const qbApi = await makeQBApi(); //init with most recent token
    const normalVendor = await makeQuickbookVendor({ user:existingUser, Id, SyncToken });
    return new Promise((resolve, reject) => {
      qbApi.updateVendor(normalVendor, (resolveErr, updatedVendor) => {
        if (resolveErr) return reject(resolveErr);
        resolve(updatedVendor);
      });
    });
  };

  //store normalTransaction object in quickbooks 
  // ?????make bill object including sum of all royalties earned by user in a month
  const createQBBill = async({ normalTransaction, vendorId, DisplayName }) => {
    const qbApi = await makeQBApi(); //init with most recent token
    const normalBill = await makeQuickbookBill({ normalTransaction, vendorId, DisplayName, Id:null, SyncToken:null });
    return new Promise((resolve, reject) => {
      qbApi.createBill(normalBill, (resolveErr, createdBill) => {
        if (resolveErr) return reject(resolveErr);
        resolve(createdBill);
      });
    });
  };

  /**
   * @params {id} string, exact id of bill in quickbooks system
   */
  const getQBBill = async({ id }) => {
    const qbApi = await makeQBApi(); //init with most recent token
    return new Promise((resolve, reject) => {
      qbApi.getBill(id, (resolveErr, billObject) => {
        if (resolveErr) return reject(resolveErr);
        resolve(billObject);
      });
    });
  }  

  const updateQBBill = async({ normalTransaction, vendorId, DisplayName, Id, SyncToken }) => {
    const qbApi = await makeQBApi(); //init with most recent token
    const normalBill = await makeQuickbookBill({ normalTransaction, vendorId, DisplayName, Id, SyncToken });
    return new Promise((resolve, reject) => {
      qbApi.updateBill(normalBill, (resolveErr, updatedBill) => {
         if (resolveErr) return reject(resolveErr);
        resolve(updatedBill);
      });
    });
  };

  // const handleWebhook = async ({body})=>{
  
  //   let  notifications = [];
  //   for(let i=0; i < req.body.eventNotifications.length; i++) {
  //       let entities = req.body.eventNotifications[i].dataChangeEvent.entities;
  //       let realmID = req.body.eventNotifications[i].realmId;
  //       for(let j=0; j < entities.length; j++) {
  //           let notification = {
  //               'realmId': realmID,
  //               'name': entities[i].name,
  //               'id': entities[i].id,
  //               'operation': entities[i].operation,
  //               'lastUpdated': entities[i].lastUpdated
  //           }
  //           notifications.push(notification);
  //       }
  //   }
  //   if(!notifications.length===0){
  //     return {success: true};
  //   }
  //   else{
  //     let borderlessPayouts = [];
  //     for(let i=0; i < notifications.length; i++) {
  //       if(notification[i].operation === "Update"){
  //         let bill = await getBillById({id: notification[i].id});
  //         const txnDb = await Transaction;
  //         if(bill && bill.Bill){
  //           bill = bill.Bill;
  //           if(bill.Balance>0){
  //             try {
  //               await txnDb.findOneAndUpdate({txnId: notification[i].id}, {status: "failed"});
  //             } catch (error) {
  //               logger.debug(`Error on method:`, `${error}`);
  //               return;
  //             };
  //           }else{
  //             let transactionInDb;
  //             try {
  //               transactionInDb = await txnDb.findOne({txnId: notification[i].id});
  //               if(!transactionInDb){
  //                 throw Error(`Transaction undefined with id:`, `${notification[i].id}`);
  //               }
  //             } catch (error) {
  //               logger.debug(`Error on method handleWebhook`, `${error}`);
  //               return;
  //             }
  //             if(transactionInDb.txnAmount !== bill.TotalAmt){
  //              try {
  //               await txnDb.findOneAndUpdate({txnId: notification[i].id}, {status: "failed"});
  //              } catch (error) {
  //               logger.debug(`Error on method handleWebhook`, `${error}`);
  //               return;
  //              }
  //             }else{
  //               borderlessPayouts.push({userId: transactionInDb.userId, amount:bill.TotalAmt, txnId: bill.id})
  //             }
  //           }
  //         }else{
  //           logger.warn("Bill is undefined, bill Id:", `${notification[i].id}`);
  //         }
  //         await createJob(QueueProcesses.borderless.borderlessMassPayout, {massPayoutArray: borderlessPayouts});
  //         return {success: true}
  //       }
  //   }
  //   return {success: true};
  //   }
  // }

  return Object.freeze({
    createMasterAccount,
    createVendor,
    updateVendor,
    createBill,
    updateBill
  // handleWebhook,
  });
}