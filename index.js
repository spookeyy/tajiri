const { timeStamp, password64 } = require("./conf/utils");

const request = require("./conf/axios");

const urls = require("./conf/urls");

const { notFalsey } = require("./conf/validations");

class Mpesa {
  timeStamp = timeStamp;

  constructor({ environment = "sandbox", config }) {
    if (environment !== "sandbox" && environment !== "live") {
      throw {
        custom: true,
        message: "Environment can only by sandbox or live",
      };
    }
    this.environment = environment;
    this.config = config;
  }

  auth = async (params = {}) => {
    try {
      const { consumerKey, consumerSecret, environment } = params;

      let cK = consumerKey || this.config.CONSUMER_KEY || null;
      let cS = consumerSecret || this.config.CONSUMER_SECRET || null;
      let env = environment || this.environment;

      if (!cK || !cS) {
        throw {
          custom: true,
          message: "Consumer key and consumer secret must be provided",
        };
      }

      if (env !== "sandbox" && env !== "live") {
        throw {
          custom: true,
          message: "Environment can only by sandbox or live",
        };
      }

      let url = urls[env].auth;

      if (!url) {
        throw {
          custom: true,
          message: "Url error",
        };
      }

      const encodedString = btoa(`${cK}:${cS}`);

      let res = await request({
        url: url,
        method: "GET",
        headers: {
          Authorization: `Basic ${encodedString}`,
        },
      });

      return { error: false, data: res };
    } catch (e) {
      return { error: true, e: e };
    }
  };

  stkPush = async (params = {}) => {
    try {
      const {
        BUSINESS_SHORT_CODE,
        TRANSACTION_TYPE,
        TRANSACTION_DESCRIPTION,
        AMOUNT,
        PHONE_NUMBER,
        CALLBACK_URL,
        ACCOUNT_REFERENCE,
        PASS_KEY,
        environment,
      } = params;

      let doc = {
        TransactionType: TRANSACTION_TYPE || this.config.TRANSACTION_TYPE,
        TransactionDesc:
          TRANSACTION_DESCRIPTION || this.config.TRANSACTION_DESCRIPTION,
        BusinessShortCode:
          BUSINESS_SHORT_CODE || this.config.BUSINESS_SHORT_CODE,
        Amount: AMOUNT || this.config.AMOUNT,
        PartyA: PHONE_NUMBER || this.config.PHONE_NUMBER,
        PartyB: BUSINESS_SHORT_CODE || this.config.BUSINESS_SHORT_CODE,
        CallBackURL: CALLBACK_URL || this.config.CALLBACK_URL,
        AccountReference: ACCOUNT_REFERENCE || this.config.ACCOUNT_REFERENCE,
        pass_key: PASS_KEY || this.config.PASS_KEY,
      };

      let env = environment || this.environment;

      if (env !== "sandbox" && env !== "live") {
        throw {
          custom: true,
          message: "Environment can only by sandbox or live",
        };
      }

      notFalsey(doc);

      let ts = this.timeStamp();

      const encodedString = password64({ ...doc, ts: ts });

      const auth = await this.auth();

      if (auth.error) {
        throw { custom: true, message: "Authentication Error", error: auth };
      }

      let url = urls[env].stk_push;

      let res = await request({
        url,
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.data?.data?.access_token}`,
        },
        body: {
          BusinessShortCode: doc.BusinessShortCode,
          Password: encodedString,
          Timestamp: ts,
          TransactionType: doc?.TransactionType || "CustomerPayBillOnline",
          Amount: doc?.Amount,
          PartyA: doc?.PartyA,
          PartyB: doc.BusinessShortCode,
          PhoneNumber: doc?.PartyA,
          CallBackURL: doc.CallBackURL,
          AccountReference: doc.AccountReference,
          TransactionDesc: doc.TransactionDesc,
        },
      });

      return res;
    } catch (e) {
      return { error: true, e: e };
    }
  };

  stk_query = async (params = {}) => {
    try {
      const { BUSINESS_SHORT_CODE, PASS_KEY, environment, id } = params;

      if (!id) {
        throw { custom: true, message: "Checkout request id required." };
      }

      let doc = {
        BusinessShortCode:
          BUSINESS_SHORT_CODE || this.config.BUSINESS_SHORT_CODE,
        pass_key: PASS_KEY || this.config.PASS_KEY,
      };

      let env = environment || this.environment;

      if (env !== "sandbox" && env !== "live") {
        throw {
          custom: true,
          message: "Environment can only by sandbox or live",
        };
      }

      notFalsey(doc);
      let ts = this.timeStamp();
      const encodedString = password64({ ...doc, ts: ts });

      const auth = await this.auth();

      if (auth.error) {
        throw { custom: true, message: "Authentication Error", error: auth };
      }

      let url = urls[env].stk_query;

      let res = await request({
        url,
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.data?.data?.access_token}`,
        },
        body: {
          BusinessShortCode: doc.BusinessShortCode,
          Password: encodedString,
          Timestamp: ts,
          CheckoutRequestID: id,
        },
      });

      return res;
    } catch (e) {
      return { error: true, e: e };
    }
  };

  register_url = async (params = {}) => {
    try {
      const {
        BUSINESS_SHORT_CODE,
        RESPONSE_TYPE,
        CONFIRMATION_URL,
        VALIDATION_URL,
        environment,
      } = params;

      let doc = {
        BUSINESS_SHORT_CODE:
          BUSINESS_SHORT_CODE || this.config.BUSINESS_SHORT_CODE,
        CONFIRMATION_URL: CONFIRMATION_URL || this.config.CONFIRMATION_URL,
        VALIDATION_URL: VALIDATION_URL || this.config.VALIDATION_URL,
      };

      notFalsey(doc);

      if (RESPONSE_TYPE !== "Completed" && RESPONSE_TYPE !== "Cancelled") {
        throw {
          custom: true,
          message: "Response type can only be 'Completed' or 'Cancelled' ",
        };
      }

      let env = environment || this.environment;

      if (env !== "sandbox" && env !== "live") {
        throw {
          custom: true,
          message: "Environment can only by sandbox or live",
        };
      }

      let data = {
        ShortCode: doc.BUSINESS_SHORT_CODE,
        ResponseType: RESPONSE_TYPE,
        ConfirmationURL: CONFIRMATION_URL,
        ValidationURL: VALIDATION_URL,
      };

      const auth = await this.auth();

      if (auth.error) {
        throw { custom: true, message: "Authentication Error", error: auth };
      }

      let url = urls[env].register_url;

      let res = await request({
        url,
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.data?.data?.access_token}`,
        },
        body: data,
      });

      return res;
    } catch (e) {
      return { error: true, e: e };
    }
  };
}

module.exports = Mpesa;
