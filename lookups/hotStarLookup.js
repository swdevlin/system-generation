const {twoD6} = require("../dice");

const hotStarLookup = ({dm, stellarClass}) => {
  const roll = twoD6() + dm;

  if (roll <= 2)
    return 'A';
  else if (roll >= 12)
    return stellarClass === 'IV' ? 'B' : 'O';
  else
    switch (roll) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return stellarClass === 'VI' ? 'B' : 'A';
      case 10:
      case 11:
        return 'B';
    }
}

module.exports = hotStarLookup;
