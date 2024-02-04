require("dotenv").config();

const Mpesa = require("./../index");

const config = {
  BUSINESS_SHORT_CODE: "600995",
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

  let res = await tajiri.register_url({
    CONFIRMATION_URL: "https://mydomain.com/confirmation",
    VALIDATION_URL: "https://mydomain.com/validation",
    RESPONSE_TYPE: "Completed",
  });
  console.log(res);
}

test();
