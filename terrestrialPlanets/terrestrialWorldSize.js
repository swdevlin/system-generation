const Random = require("random-js").Random;

const r = new Random();

const terrestrialWorldSize = () => {
  switch (r.die(6)) {
    case 1:
    case 2:
      return r.die(6);
    case 3:
    case 4:
      return r.die(6) + r.die(6);
    case 5:
    case 6:
      return r.die(6) + r.die(6)+3;
  }
}

module.exports = terrestrialWorldSize;
