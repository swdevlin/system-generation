const {d4} = require("../dice");

const superEarthWorldSize = () => {
  return d4() + d4() + 7;
}

module.exports = superEarthWorldSize;
