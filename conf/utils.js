timeStamp = () => {
  const options = {
    timeZone: "Africa/Nairobi",
  };

  const doubleDig = (dd) => {
    return dd < 10 ? "0" + dd : "" + dd;
  };

  // Create a Date object for the current date and time

  let formattedDate = new Date().toLocaleString("en-US", options);

  let newDate = new Date(formattedDate);

  let year = doubleDig(newDate.getFullYear());
  let month = doubleDig(newDate.getMonth() + 1);
  let date = doubleDig(newDate.getDate());
  let hours = doubleDig(newDate.getHours());
  let minutes = doubleDig(newDate.getMinutes());
  let seconds = doubleDig(newDate.getSeconds());

  return year + month + date + hours + minutes + seconds;
};

password64 = (params = {}) => {
  let { BusinessShortCode, pass_key, ts } = params;
  let combinedString = BusinessShortCode + pass_key + ts.toString();
  const encodedString = Buffer.from(combinedString).toString("base64");
  return encodedString;
};

module.exports = { timeStamp, password64 };
