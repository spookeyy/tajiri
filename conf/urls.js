const live_base_url = "https://api.safaricom.co.ke";
const sand_box_base_url = "https://sandbox.safaricom.co.ke";

const live = {
  auth: `${live_base_url}/oauth/v1/generate?grant_type=client_credentials`,
  stk_push: `${live_base_url}/mpesa/stkpush/v1/processrequest`,
  stk_query: `${live_base_url}/mpesa/stkpushquery/v1/query`,
  register_url: `${live_base_url}/mpesa/c2b/v1/registerurl`,
};

const sandbox = {
  auth: `${sand_box_base_url}/oauth/v1/generate?grant_type=client_credentials`,
  stk_push: `${sand_box_base_url}/mpesa/stkpush/v1/processrequest`,
  stk_query: `${sand_box_base_url}/mpesa/stkpushquery/v1/query`,
  register_url: `${sand_box_base_url}/mpesa/c2b/v1/registerurl`,
};

urls = { live: live, sandbox: sandbox };

module.exports = urls;
