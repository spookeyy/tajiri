require("dotenv").config();

const Mpesa = require("./../index");

const config = {
  BUSINESS_SHORT_CODE: process.env.PAYBILL,
  CONSUMER_KEY: process.env.CONSUMER_KEY,
  CONSUMER_SECRET: process.env.CONSUMER_SECRET,
  TRANSACTION_TYPE: process.env.TRANSACTION_TYPE,
  TRANSACTION_DESCRIPTION: "Payment of x",
  AMOUNT: 1,
  PHONE_NUMBER: "254728829146",
  CALLBACK_URL: process.env.CALLBACK_URL,
  ACCOUNT_REFERENCE: process.env.ACCOUNT_REFERENCE,
  PASS_KEY: process.env.PASS_KEY,
};

async function test() {
  let tajiri = new Mpesa({ environment: "sandbox", config });

  let res = await tajiri.stk_query({ id: "ws_CO_04022024093512587728829146" });
  console.log(res);
}

test();
