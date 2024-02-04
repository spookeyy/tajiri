const notFalsey = (params = {}) => {
  let keys = Object.keys(params);

  for (key of keys) {
    if (!params[key]) {
      throw { custom: true, message: `${key} is required` };
    }
  }
};

module.exports = { notFalsey };
