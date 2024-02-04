# Mpesa Express

## Installation

```bash
npm install tajiri
```

or

```bash
yarn add tajiri
```

**Warning**: Note that this npm package name is case sensitive.

## Description

Mpesa Express is a Node.js package for interacting with Mpesa APIs, providing methods for authentication, STK push, STK query, and URL registration.

## Response Format

The responses from the Mpesa API calls follow a standard format. Here's how a typical response might look like

```javascript
{
  "error": false,
  "data": {
    // Response data specific to the API call
  }
}
```

## Usage

### Initialization

```javascript
const Mpesa = require("tajiri-mpesa-express");

// Initialize with your configuration
const config = {
  CONSUMER_KEY: "your_consumer_key",
  CONSUMER_SECRET: "your_consumer_secret",
  // other configuration options...
};
const mpesa = new Mpesa({ environment: "sandbox", config });
```

### Creating a New Object

```javascript
const Mpesa = require("tajiri-mpesa-express");

// Initialize with your configuration
const config = {
  BUSINESS_SHORT_CODE: process.env.PAYBILL,
  CONSUMER_KEY: process.env.CONSUMER_KEY,
  CONSUMER_SECRET: process.env.CONSUMER_SECRET,
  TRANSACTION_TYPE: process.env.TRANSACTION_TYPE,
  TRANSACTION_DESCRIPTION: "Payment of x",
  AMOUNT: 1,
  PHONE_NUMBER: "254........",
  CALLBACK_URL: process.env.CALLBACK_URL,
  ACCOUNT_REFERENCE: process.env.ACCOUNT_REFERENCE,
  PASS_KEY: process.env.PASS_KEY,
};
const tajiri = new Mpesa({ environment: "sandbox", config });
```

### Authentication

#### Using `then/catch`

```javascript
// Perform authentication

mpesa.auth().then((res) => {
  if (!res.error) {
    console.log(res.data);
  } else {
    console.error(res.data);
  }
});
```

#### Using `async/await`

```javascript
// Perform authentication using async/await
async function authenticate() {
  try {
    const res = await mpesa.auth();
    if (!res.error) {
      console.log(res.data);
    } else {
      console.error(res.data);
    }
  } catch (err) {
    console.error(err);
  }
}
authenticate();
```

Valid response:

```json
{
  "error": false,
  "data": {
    "error": false,
    "data": {
      "access_token": "VGFeagA4irIQCW4cTMZXO1e4nq10",
      "expires_in": "3599"
    }
  }
}
```

### STK Push

#### Using `then/catch`

```javascript
// Perform STK push
mpesa
  .stkPush({
    // If any of these keys are not provided here, they will be picked from the config object by default
    BUSINESS_SHORT_CODE: 123456,
    TRANSACTION_TYPE: "CustomerPayBillOnline",
    AMOUNT: 100,
    PHONE_NUMBER: "254........",
    CALLBACK_URL: "https://example.com/callback",
    // other parameters...
  })
  .then((res) => {
    if (!res.error) {
      console.log(res.data);
    } else {
      console.error(res.data);
    }
  });
```

#### Using `async/await`

```javascript
// Perform STK push using async/await
// Perform STK push using async/await
async function stkPush() {
  try {
    const res = await mpesa.stkPush({
      // If any of these keys are not provided here, they will be picked from the config object by default
      BUSINESS_SHORT_CODE: 123456,
      TRANSACTION_TYPE: "CustomerPayBillOnline",
      AMOUNT: 100,
      PHONE_NUMBER: "254........",
      CALLBACK_URL: "https://example.com/callback",
      // other parameters...
    });
    if (!res.error) {
      console.log(res.data);
    } else {
      console.error(res.data);
    }
  } catch (err) {
    console.error(err);
  }
}

stkPush();
```

Valid response:

```json
{
  "error": false,
  "data": {
    "MerchantRequestID": "6e86-45dd-91ac-fd5d4178ab52286773",
    "CheckoutRequestID": "ws_CO_04022024093146733728829146",
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing",
    "CustomerMessage": "Success. Request accepted for processing"
  }
}
```

### STK Query

#### Using `then/catch`

```javascript
// Perform STK query
mpesa
  .stk_query({
    // If any of these keys are not provided here, they will be picked from the config object by default
    BUSINESS_SHORT_CODE: 123456,
    PASS_KEY: "your_pass_key",
    id: "checkout_request_id",
    // other parameters...
  })
  .then((res) => {
    if (!res.error) {
      console.log(res.data);
    } else {
      console.error(res.data);
    }
  });
```

#### Using `async/await`

```javascript
// Perform STK query using async/await
async function stkQuery() {
  try {
    const res = await mpesa.stk_query({
      BUSINESS_SHORT_CODE: 123456,
      PASS_KEY: "your_pass_key",
      id: "checkout_request_id",
      // other parameters...
    });
    if (!res.error) {
      console.log(res.data);
    } else {
      console.error(res.data);
    }
  } catch (err) {
    console.error(err);
  }
}

stkQuery();
```

Valid response:

```json
{
  "error": false,
  "data": {
    "ResponseCode": "0",
    "ResponseDescription": "The service request has been accepted successsfully",
    "MerchantRequestID": "2ba8-4165-beca-292db11f9ef8316449",
    "CheckoutRequestID": "ws_CO_04022024093512587728829146",
    "ResultCode": "0",
    "ResultDesc": "The service request is processed successfully."
  }
}
```

### URL Registration

#### Using `then/catch`

```javascript
// Perform URL registration
mpesa
  .register_url({
    // If any of these keys are not provided here, they will be picked from the config object by default
    BUSINESS_SHORT_CODE: 123456,
    RESPONSE_TYPE: "Completed",
    CONFIRMATION_URL: "https://example.com/confirmation",
    VALIDATION_URL: "https://example.com/validation",
    // other parameters...
  })
  .then((res) => {
    if (!res.error) {
      console.log(res.data);
    } else {
      console.error(res.data);
    }
  });
```

#### Using `async/await`

```javascript
// Perform URL registration using async/await
async function registerURL() {
  try {
    const res = await mpesa.register_url({
      BUSINESS_SHORT_CODE: 123456,
      RESPONSE_TYPE: "Completed",
      CONFIRMATION_URL: "https://example.com/confirmation",
      VALIDATION_URL: "https://example.com/validation",
      // other parameters...
    });
    if (!res.error) {
      console.log(res.data);
    } else {
      console.error(res.data);
    }
  } catch (err) {
    console.error(err);
  }
}

registerURL();
```

Valid response:

```json
{
  "error": false,
  "data": {
    "OriginatorCoversationID": "2ba8-4165-beca-292db11f9ef8316476",
    "ResponseCode": "0",
    "ResponseDescription": "Success"
  }
}
```

---

## References

> get the application credentials from daraja

[daraja]](https://developer.safaricom.co.ke/)

This Markdown documentation provides examples for using both `then/catch` and `async/await` patterns for each method call,
