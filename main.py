import base64
from datetime import datetime
import requests

from conf.utils import timestamp, password64
from conf.urls import urls
from conf.validations import not_falsey

class Mpesa:
    def __init__(self, environment="sandbox", config=None):
        if environment not in ["sandbox", "live"]:
            raise Exception("Environment can only be 'sandbox' or 'live'")
        self.environment = environment
        self.config = config

    def auth(self, params=None):
        try:
            params = params or {}
            consumer_key = params.get("consumerKey") or self.config.CONSUMER_KEY or None
            consumer_secret = params.get("consumerSecret") or self.config.CONSUMER_SECRET or None
            environment = params.get("environment") or self.environment

            if not consumer_key or not consumer_secret:
                raise Exception("Consumer key and consumer secret must be provided")

            if environment not in ["sandbox", "live"]:
                raise Exception("Environment can only be 'sandbox' or 'live'")

            url = urls[environment]["auth"]
            if not url:
                raise Exception("URL error")

            encoded_string = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode("utf-8")

            res = requests.get(url, headers={"Authorization": f"Basic {encoded_string}"})
            res.raise_for_status()

            return {"error": False, "data": res}
        except Exception as e:
            return {"error": True, "e": e}

    def stk_push(self, params=None):
        try:
            params = params or {}
            business_short_code = params.get("BUSINESS_SHORT_CODE") or self.config.BUSINESS_SHORT_CODE
            transaction_type = params.get("TRANSACTION_TYPE") or self.config.TRANSACTION_TYPE
            transaction_description = params.get("TRANSACTION_DESCRIPTION") or self.config.TRANSACTION_DESCRIPTION
            amount = params.get("AMOUNT") or self.config.AMOUNT
            phone_number = params.get("PHONE_NUMBER") or self.config.PHONE_NUMBER
            callback_url = params.get("CALLBACK_URL") or self.config.CALLBACK_URL
            account_reference = params.get("ACCOUNT_REFERENCE") or self.config.ACCOUNT_REFERENCE
            pass_key = params.get("PASS_KEY") or self.config.PASS_KEY
            environment = params.get("environment") or self.environment

            if environment not in ["sandbox", "live"]:
                raise Exception("Environment can only be 'sandbox' or 'live'")

            doc = {
                "TransactionType": transaction_type,
                "TransactionDesc": transaction_description,
                "BusinessShortCode": business_short_code,
                "Amount": amount,
                "PartyA": phone_number,
                "PartyB": business_short_code,
                "CallBackURL": callback_url,
                "AccountReference": account_reference,
                "pass_key": pass_key,
            }

            not_falsey(doc)

            ts = timestamp()
            encoded_string = password64({**doc, "ts": ts})

            auth = self.auth()
            if auth["error"]:
                raise Exception("Authentication Error", auth)

            url = urls[environment]["stk_push"]

            res = requests.post(
                url,
                headers={"Authorization": f"Bearer {auth['data'].json()['access_token']}"},
                json={
                    "BusinessShortCode": doc["BusinessShortCode"],
                    "Password": encoded_string,
                    "Timestamp": ts,
                    "TransactionType": doc.get("TransactionType", "CustomerPayBillOnline"),
                    "Amount": doc["Amount"],
                    "PartyA": doc["PartyA"],
                    "PartyB": doc["BusinessShortCode"],
                    "PhoneNumber": doc["PartyA"],
                    "CallBackURL": doc["CallBackURL"],
                    "AccountReference": doc["AccountReference"],
                    "TransactionDesc": doc["TransactionDesc"],
                },
            )
            res.raise_for_status()

            return res
        except Exception as e:
            return {"error": True, "e": e}

    def stk_query(self, params=None):
        try:
            params = params or {}
            business_short_code = params.get("BUSINESS_SHORT_CODE") or self.config.BUSINESS_SHORT_CODE
            pass_key = params.get("PASS_KEY") or self.config.PASS_KEY
            environment = params.get("environment") or self.environment
            checkout_request_id = params.get("id")

            if not checkout_request_id:
                raise Exception("Checkout request id required.")

            doc = {
                "BusinessShortCode": business_short_code,
                "pass_key": pass_key,
            }

            if environment not in ["sandbox", "live"]:
                raise Exception("Environment can only be 'sandbox' or 'live'")

            not_falsey(doc)
            ts = timestamp()
            encoded_string = password64({**doc, "ts": ts})

            auth = self.auth()
            if auth["error"]:
                raise Exception("Authentication Error", auth)

            url = urls[environment]["stk_query"]

            res = requests.post(
                url,
                headers={"Authorization": f"Bearer {auth['data'].json()['access_token']}"},
                json={
                    "BusinessShortCode": doc["BusinessShortCode"],
                    "Password": encoded_string,
                    "Timestamp": ts,
                    "CheckoutRequestID": checkout_request_id,
                },
            )
            res.raise_for_status()

            return res
        except Exception as e:
            return {"error": True, "e": e}

    def register_url(self, params=None):
        try:
            params = params or {}
            business_short_code = params.get("BUSINESS_SHORT_CODE") or self.config.BUSINESS_SHORT_CODE
            response_type = params.get("RESPONSE_TYPE")
            confirmation_url = params.get("CONFIRMATION_URL") or self.config.CONFIRMATION_URL
            validation_url = params.get("VALIDATION_URL") or self.config.VALIDATION_URL
            environment = params.get("environment") or self.environment

            doc = {
                "BUSINESS_SHORT_CODE": business_short_code,
                "CONFIRMATION_URL": confirmation_url,
                "VALIDATION_URL": validation_url,
            }

            not_falsey(doc)

            if response_type not in ["Completed", "Cancelled"]:
                raise Exception("Response type can only be 'Completed' or 'Cancelled'")

            if environment not in ["sandbox", "live"]:
                raise Exception("Environment can only be 'sandbox' or 'live'")

            data = {
                "ShortCode": doc["BUSINESS_SHORT_CODE"],
                "ResponseType": response_type,
                "ConfirmationURL": confirmation_url,
                "ValidationURL": validation_url,
            }

            auth = self.auth()
            if auth["error"]:
                raise Exception("Authentication Error", auth)

            url = urls[environment]["register_url"]

            res = requests.post(
                url,
                headers={"Authorization": f"Bearer {auth['data'].json()['access_token']}"},
                json=data,
            )
            res.raise_for_status()

            return res
        except Exception as e:
            return {"error": True, "e": e}