const {percentageChance, twoD6} = require("../dice");
const giantsStellarClassLookup = require("./giantsStellarClassLookup");
const StellarClassification = require("../stars/StellarClassification");
const peculiarStarLookup = require("./peculiarStarLookup");
const starTypeLookup = require("./starTypeLookup");

const unusualStarLookup = ({dm}) => {
  const roll = twoD6() + dm;

  let stellarClassification = new StellarClassification();

  if (roll <= 2)
    stellarClassification.stellarType = peculiarStarLookup(0);
  if (roll >= 12) {
      stellarClassification.stellarClass = giantsStellarClassLookup(0);
  }
  switch (roll) {
    case 3:
      stellarClassification.stellarClass = 'VI';
    case 4:
    case 5:
      break;
    case 6:
    case 7:
    case 8:
      stellarClassification.stellarClass = 'IV';
      break;
    case 9:
    case 10:
      stellarClassification.stellarClass = 'III';
      break;
    default:
      stellarClassification.stellarClass = giantsStellarClassLookup(0);
      break;
  }

  stellarClassification.stellarType = starTypeLookup({
    dm: 1,
    stellarClass: stellarClassification.stellarClass
  });

  return stellarClassification;
}

module.exports = unusualStarLookup;
