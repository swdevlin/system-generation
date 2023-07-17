const {twoD6} = require("./dice");
const secondaryType = (dm) => {
  const roll = twoD6() + dm;
  if (roll <= 3)
    return otherType(dm);
  else if (roll <= 6) {
    let stellarType =
  } else if (roll <= 8) {
    return 'Lesser';
  } else if (roll <= 10) {
    return 'Sibling';
  } else {
    return 'Twin';
  }

}
const multiStellarType = (primary) => {

  'O': 'Blue',
  'B': 'Blue White',
  'A': 'White',
  'F': 'Yellow White',
  'G': 'Yellow',
  'K': 'Light Orange',
  'M': 'Orange Red',
};

module.exports = multiStellarType;
