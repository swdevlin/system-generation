const {twoD6} = require("../dice");

const stellarTypeLookup = (dm, stellarClass) => {
  let roll = twoD6() + dm;
  let stellarType;
  if (stellarClass && stellarClass === 'IV')
    if (roll >=3 && roll <= 6)
      roll += 5;

  if (roll <= 2)
    stellarType = 'Special';
  else if (roll >= 12)
    stellarType = 'Hot';
  else
    switch (roll) {
      case 3:
      case 4:
      case 5:
      case 6:
        stellarType = 'M';
        break;
      case 7:
      case 8:
        stellarType = 'K';
        break;
      case 9:
      case 10:
        stellarType = 'G';
        break;
      case 11:
        stellarType = 'F';
        break;
    }
  if (stellarClass && stellarClass === 'VI')
    if (stellarType === 'F')
      stellarType = 'G';
    else if (stellarType === 'A')
      stellarType = 'B';

  return stellarType;
}

module.exports = stellarTypeLookup;
