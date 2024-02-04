const live_base_url = "https://api.safaricom.co.ke";
const sand_box_base_url = "https://sandbox.safaricom.co.ke";

const live = {
  Authorization: `${live_base_url}/oauth/v1/generate?grant_type=client_credentials`,
};

const sandbox = {
  Authorization: `${sand_box_base_url}/oauth/v1/generate?grant_type=client_credentials`,
};

module.exports = urls;
