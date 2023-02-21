import * as logger from "../../utils/Logger/index.js";
import { MongoError } from "../../utils/Errors/mongo-errors.js";
import QuickbooksToken from "../../models/quickbooksTokenModels.js";
/**
 * This component component establishes a connection to quickbooks 
 *   via their provided credentials. 
 * 
 * This Components is effectifly a sdk built to manange the quickbooks connection. 
 *   getAuthUrl: fetching auth configs
 *   fetching the initial token to connect
 *   saveToken: storing that token in our db (for it's period of)
 *   restoreFromDB: fetching that token
 *   scheduleRefreshToken:
 *   refreshToken: makes further requests to quickbook to create a new token when expired
 *   setTokenFromCallback:
 */
export default function makeAuthClient({ configOptions, oauthClient }) {
  
  /**
   *  Restore qb token from DB
   *   -Get token from Db
   *   -set tokenInfo into oauthClient (QB Auth tool)
   *   -use tool to verify old token
   *   -if invalid, and expired attempt 
   *       use token to get new token
   *   -if not rereshed, clear, token from oauthClient
   */
  const attemptRestoreToken = async() => { //initQuickbooks
    try{
      const { expireOffset } = configOptions
      logger.debug("loaded token from DB", `${expireOffset}` );
      const tokenInfo = await getTokenFromDB();
      if(!tokenInfo) {
        logger.debug('Token not found');
        return;
      }

      if(!!tokenInfo) logger.debug("Quickbooks token loaded from DB", `${tokenInfo.access_token}`);

      if (tokenInfo) {
        delete tokenInfo._id; //don't print
        await setToken({ tokenInfo })
        let isValidToken = await oauthClient.isAccessTokenValid();
        logger.info("Quickbooks token validity:", { isValidToken });

        const expiredFromUpdated =
          (Math.floor(new Date()) - Math.floor(tokenInfo.createdAt)) / 1000; // in secs

        // if token is expired and refresh_token is valid
        // then refresh auth token
        if (
          (!isValidToken ||
            expiredFromUpdated > tokenInfo.expires_in - expireOffset) &&
          expiredFromUpdated < tokenInfo.x_refresh_token_expires_in
        ) {
          const tokenRefreshed = await refreshToken();
          

          //TODO: REMOVE TOKEN??? 
          if (!tokenRefreshed) { 
            oauthClient.setToken(null) 
          };
          return;
        }
      }
    }catch(err){
      logger.debug('Quickboos restore failed', `${err.message}`);
      throw new Error(err);
    }
  };

  /**
   * Token refresh function
   *  uses quickbooks Api to fetch new token, 
   *   using the token previously issued by quickbooks
   * 
   * In refreshUsingToken modifies the token in oathClient  
   * @returns {Boolean}
   */
  const refreshToken = async () => {
    try{
      return await oauthClient
      .refreshUsingToken(oauthClient.token.refresh_token)
      .then(async(authResponse) => {
        logger.debug("Quickbooks token refresh")
        const isSaved = await saveTokenToDB();
        return true;
      })
      .catch((e) => {
        console.log(e?.response)
        console.log(e?.message)
        logger.debug("Quickbooks token refresh failed", `${e}`);
        return false;
      });
    }catch(err){
      logger.debug(`qb token refresh failed`, err)
      throw new Error(err)
    }
  };

  /**
   * Schedule refresh token before expiring
   *   Creates continuous internal loop 
   */
  const scheduleRefreshToken = async () => {
    try{
      var { validWindow, expireOffset } = configOptions
      const tokenInfo = oauthClient.getToken();
      logger.info('schedule token refresh')
      const isValidToken = await oauthClient.isAccessTokenValid();
      logger.info("Quickbooks token validity:", { isValidToken });
      if(!isValidToken) return;
      
      const expiredFromUpdated =
        (Math.floor(new Date()) - Math.floor(tokenInfo.createdAt)) / 1000; // in secs
      if (
        isValidToken ||
        expiredFromUpdated < tokenInfo.x_refresh_token_expires_in
      ) {
        const willExpireInSecs =
          (tokenInfo.createdAt - Math.floor(new Date())) / 1000 +
          tokenInfo.expires_in;

        setTimeout(async () => { //schedules first refresh from token present
          await refreshToken();
          setInterval(async () => {//timer to subsequent requests
            await refreshToken();
          }, (validWindow - expireOffset) * 1000);
        }, Math.max(willExpireInSecs - expireOffset, 0) * 1000);
        
        logger.debug("Quickbooks token refresh scheduled");
      }
    }catch(err){
      logger.debug(`schedule refresh failed`, `${err}`)
      throw new Error(err)
    }
  };

  /**
   * Returns token created by client
   */
  const createToken = async({ url }) => {
    console.log('createToken - url', url)
    console.log('createToken - url', oauthClient)
    return await oauthClient.createToken(url)
      .then((authResponse) => {
        console.log('createToken authResponse', authResponse)
        return authResponse.getJson();
      })
      .catch((err) => {
        console.log("createToken", err)
        console.log("createToken", err?.message)
        logger.debug(`extract token fail`, `${err}`)
        throw new Error(err);
    } );
  }

  const setToken = async({ tokenInfo }) => {
    var { realmId } = configOptions;
    try{
      return await oauthClient.setToken({
          realmId: !!tokenInfo.realmId ? tokenInfo.realmId: realmId,
          token_type: tokenInfo.token_type,
          access_token: tokenInfo.access_token,
          expires_in: tokenInfo.expires_in,
          refresh_token: tokenInfo.refresh_token,
          x_refresh_token_expires_in: tokenInfo.x_refresh_token_expires_in,
          id_token: tokenInfo.id_token,
          createdAt: Math.floor(tokenInfo.createdAt),
        });
    } catch(error) {
      logger.debug('Set token fail', `${error}`)
      throw new Error(error)
    }
  }

  /**
   * If valid returns quickbooks token information
   *   displays token validitity status on admin panel
   * @returns {Object}
   */
  const tokenInfo = async() => {
    try{
      const isAccessTokenValid = await oauthClient.isAccessTokenValid();
      let expireAt = null; // Unix epoch time
      if (isAccessTokenValid) {
        const tokenInfo = await oauthClient.getToken();
        const { expires_in, createdAt } = tokenInfo;
        expireAt = createdAt + expires_in * 1000;
      }

      return {
        isAccessTokenValid,
        expireAt,
        expireAtDesc: "unix epoch",
      };
    }catch(error){
      logger.debug(`tokenInfo`, `${error}`)
      throw new Error(error)
    }
  }

  /**
   * prep tokeninfo to save in DB
   *
   * @param {Object} tokenRes
   * @returns {Bool}
   */
  const prepTokenSaveDb = () => {
    try{
      let tokenInfo = oauthClient.getToken();
      tokenInfo.createdAt = new Date();
      tokenInfo.updatedAt = new Date();
      return tokenInfo;
    }catch(error){
      logger.debug(`saveToken`, `${error}`)
      throw new Error(error)
    }
  };

  /**
   * Save token to DB
   *  There is only one live token at a time, 
   *   deletes all previous, then save new
   * @param {Object} token
   * @returns
   */
  const saveTokenToDB = async () => {
    // Save token to DB QuickbooksTokens table
    try{
      const tokenInfo = prepTokenSaveDb();
      logger.info('Attempt save...', tokenInfo)
      const tokenDB = await QuickbooksToken;
      await tokenDB.collection.deleteMany({});
      const saveResult = await tokenDB.collection
        .insertOne(tokenInfo)
        .catch((mongoError) => {
          throw new MongoError(mongoError);
        });

      logger.debug("Quickbooks token saved", { saveResult });
      return (!!saveResult.acknowledged)
    }catch(error){
      logger.debug(`saveTokenToDB`, `${error}`)
      throw new Error(error)
    }
  };

  /**||| Interacts with DB |||
   * Restore qb token from DB
   *   TODO: DONT RETRY IF DOC_COUNT===0
   */
  const getTokenFromDB = async () => {
    try{
      const tokenDB = await QuickbooksToken;
      return await tokenDB
        .findOne()
        .catch((mongoError) => { throw new MongoError(mongoError) });
    }catch(error){
      logger.debug(`getTokenFromDB`, `${error}`)
      throw new Error('error');
      // setTimeout(async()=>{
      //   logger.info(`refetching token...`)
      //   return await getTokenFromDB();
      // }, 3000)
    }
  };

  /**
   * Called from Client?
   * Get quickbooks auth url for getting access_token
   * @returns {String} qb authentification url
   */
  const getAuthUrl = async () => {
    try{
      const { scope } = configOptions;
      return await oauthClient.authorizeUri({ scope });
    }catch(err){
      logger.debug("getAuthUrl", `${err}`)
      throw new Error(err)
    }
  };

  /**
   * 
   * Quickbooks authentification callback (Get token information in this function)
   *  quickbooks sends a "callback received by our api, ending up here, 
   *   extract url, set active token in client, store tokeninfo to DB 
   * @param {Object} param
   * @returns {Bool}
   */
  const setTokenFromCallback = async ({ url }) => {
    try{
      const tokenInfo = await createToken({ url });
      logger.info(`setTokenFromCallback - token set`, tokenInfo)
      await setToken({ tokenInfo })



      if (!!tokenInfo) {
        const dbSaveResult = await saveTokenToDB();
        console.log("dbSaveResult", dbSaveResult)
        if(!dbSaveResult) logger.debug("Token not set");

        //form loop from token creation event
        await attemptRestoreToken();
        scheduleRefreshToken();

        return dbSaveResult;
      } else{
        throw new Error('Callback failed')
      }
    } catch(err) {
      logger.debug('setToken', `${err}`)
      throw new Error(err);
    }
  };

  const deleteToken = async () => {
    try{
      const tokenDB = await QuickbooksToken;
      return await tokenDB.collection
      .deleteMany({})
      .catch((mongoError)=> {
        throw new MongoError(mongoError)
      });
    } catch (error){
      logger.debug('delete token failed', `${error}`)
      throw new MongoError(mongoError)
    }

  }
  
  return Object.freeze({
    attemptRestoreToken,
    refreshToken,
    scheduleRefreshToken,
    createToken,
    tokenInfo,
    prepTokenSaveDb,
    saveTokenToDB,
    getTokenFromDB,
    getAuthUrl,
    setTokenFromCallback,
    deleteToken,
  });
};