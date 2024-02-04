const axios = require("axios");

const request = async (params) => {
  try {
    const { method = "GET", url = "", headers = {}, body } = params;
    let res = await axios({
      url,
      method,
      headers: { "Content-Type": "application/json", ...headers },
      data: body,
    });
    return { error: false, data: res.data };
  } catch (e) {
    if (e.response) {
      return { error: true, status: e.response.status, data: e.response.data };
    }
    return { error: true, response: e };
  }
};

module.exports = request;
