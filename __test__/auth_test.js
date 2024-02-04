require("dotenv").config();

const Mpesa = require("./../index");

const config = {
  CONSUMER_KEY: process.env.CONSUMER_KEY,
  CONSUMER_SECRET: process.env.CONSUMER_SECRET,
};

async function test() {
  let tajiri = new Mpesa({ environment: "live", config: config });
  let res = await tajiri.auth({});

  console.log(res);
}

test();
