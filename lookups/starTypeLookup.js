const {twoD6} = require("../dice");

const starTypeLookup = ({dm, stellarClass, realisticDistribution}) => {
  let roll = twoD6() + dm;
  if (stellarClass === 'IV' && (roll >= 3 && roll <= 6))
    roll += 5;

  if (roll <= 2)
    return 'special';
  else if (roll >= 12)
    return 'hot';
  else if (realisticDistribution)
    switch (roll) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return 'M';
      case 9:
        return 'K';
      case 10:
        return 'G';
      case 11:
        return stellarClass === 'VI' ? 'G' : 'F';
    }
  else
    switch (roll) {
      case 3:
      case 4:
      case 5:
      case 6:
        return 'M';
      case 7:
      case 8:
        return 'K';
      case 9:
      case 10:
        return 'G';
      case 11:
        return stellarClass === 'VI' ? 'G' : 'F';
    }
}

module.exports = starTypeLookup;
