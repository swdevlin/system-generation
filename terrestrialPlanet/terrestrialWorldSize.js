const {d6} = require("../dice");

const terrestrialWorldSize = () => {
  switch (d6()) {
    case 1:
    case 2:
      return d6();
    case 3:
    case 4:
      return d6() + d6();
    case 5:
    case 6:
      return d6() + d6() + 3;
  }
}

module.exports = terrestrialWorldSize;
