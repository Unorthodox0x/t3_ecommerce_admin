import _ from "lodash";
import moment from 'moment';
import mongoose from 'mongoose' //only used for _id: mongoose.Types.ObjectId().toString(),
import * as logger from "../../../utils/Logger/index.js";
import requiredParam from '../../../utils/Errors/required-param.js';
import { InvalidPropertyError } from '../../../utils/Errors/errors.js';
import isValidEmail from '../../../utils/Validation/is-valid-email.js';
import validateObjectId from "../../../utils/Validation/validate-object-id.js";

/** Defines what a Quickbooks Vendor object is
 * Convert a user data to Quickbooks vendor data
 * @param {UserModel} user
 * @returns {Object}
 */
export default async function makeQuickbookVendor({
  user=requiredParam("User"),
  Id,  //requiredParam("User quickbook Id"), 
  SyncToken, //requiredParam("User's vendor SyncToken") 
  }={}) {

    try{
      const {_id, firstName, lastName, ArtistLabelName, email} = user || {};
      validateObjectId(_id)
      validateName('first', firstName)
      validateName('last', lastName)
      validateName('Artist|Label', ArtistLabelName)
      validateEmail(email)
      const normalVendor = normalize({ 
       _id, firstName, lastName, ArtistLabelName, 
         email, Id, SyncToken 
      } )

     return Object.freeze(normalVendor);
    } catch(error){
      logger.debug('make vendor error', `${error}`)
      throw new Error(error);
    }

  function validateName (label, name) {
    if (typeof name !== "string" || name.length < 2) {
      throw new InvalidPropertyError(
        `Invalid ${label} name`
      )
    }
  }

  function validateEmail (email) {
    if (typeof email !== "string" || !isValidEmail(email)) {
      throw new InvalidPropertyError('Invalid contact email address.')
    }
  }

  function normalize({ 
    _id, firstName, lastName, ArtistLabelName, 
      email, Id, SyncToken
  }) {
    return {
      Id: !!Id ? Id: null,
      SyncToken: !!SyncToken ? SyncToken: null,
      PrimaryEmailAddr: {
        Address: email,
      },
      WebAddr: {
        URI: null,
      },
      PrimaryPhone: {
        FreeFormNumber: null,
      },
      DisplayName: `${firstName} ${lastName} <${email}>`,
      Suffix: null,
      Title: _.truncate(ArtistLabelName, {
        length: 16,
      }),
      Mobile: {
        FreeFormNumber: null,
      },
      FamilyName: lastName,
      TaxIdentifier: null,
      AcctNum: _id,
      CompanyName: null,
      BillAddr: null,
      GivenName: firstName,
      PrintOnCheckName: `${firstName} ${lastName}`,
    };
  }
}