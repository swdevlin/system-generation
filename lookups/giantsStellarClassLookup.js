const {twoD6} = require("../dice");

const giantsStellarClassLookup = (dm) => {
  const roll = twoD6() + dm;

  if (roll <= 2)
    return 'III';
  else if (roll >= 12)
    return 'Ia';
  else
    switch (roll) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return 'III';
      case 9:
      case 10:
        return 'II';
      case 11:
        return 'Ib';
    }
}

module.exports = giantsStellarClassLookup;
