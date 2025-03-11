const {twoD6} = require("../dice");
const {isAnomaly, isBrownDwarf} = require("../utils");

const subtypeLookup = ({isPrimary, stellarType, stellarClass}) => {
  const roll = twoD6();

  if (isAnomaly(stellarType) || isBrownDwarf(stellarType))
    return null;

  let subtype;
  if (isPrimary && stellarType === 'M')
    switch (roll) {
      case  2:
        subtype = 8;
        break;
      case  3:
        subtype = 6;
        break;
      case  4:
        subtype = 5;
        break;
      case  5:
        subtype = 4;
        break;
      case  6:
        subtype = 0;
        break;
      case  7:
        subtype = 2;
        break;
      case  8:
        subtype = 1;
        break;
      case  9:
        subtype = 3;
        break;
      case 10:
        subtype = 5;
        break;
      case 11:
        subtype = 7;
        break;
      case 12:
        subtype = 9;
        break;
    }
  else
    switch (roll) {
      case  2:
        subtype = 0;
        break;
      case  3:
        subtype = 1;
        break;
      case  4:
        subtype = 3;
        break;
      case  5:
        subtype = 5;
        break;
      case  6:
        subtype = 7;
        break;
      case  7:
        subtype = 9;
        break;
      case  8:
        subtype = 8;
        break;
      case  9:
        subtype = 6;
        break;
      case 10:
        subtype = 4;
        break;
      case 11:
        subtype = 2;
        break;
      case 12:
        subtype = 0;
        break;
    }

  if (stellarClass === 'IV' && stellarType === 'K' && subtype > 4)
    subtype -= 5;

  return subtype;
}

module.exports = subtypeLookup;
