const {d6} = require("../dice");

const typeChange = (atmosphere, dm) => {
  const roll = d6() + dm;
  if (roll >= 6)
    atmosphere.code = 12;
  else
    switch (roll) {
      case 1:
        atmosphere.code = 1;
        atmosphere.characteristic = '';
        break;
      case 3:
      case 4:
      case 5:
        atmosphere.code = 11;
        break;
      default:
        break;
    }
}

module.exports = typeChange;
