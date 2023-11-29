const {percentageChance, twoD6} = require("../dice");
const giantsStellarClassLookup = require("./giantsStellarClassLookup");
const starTypeLookup = require("./starTypeLookup");
const unusualStarLookup = require("./unusualStarLookup");
const StellarClassification = require("../stars/StellarClassification");
const hotStarLookup = require("./hotStarLookup");

const specialStarTypeLookup = ({dm, unusualChance}) => {
  if (unusualChance)
    if (percentageChance(unusualChance))
      return unusualStarLookup(0);

  const stellarClassification = new StellarClassification();

  const roll = twoD6() + dm;
  switch (roll) {
    case 2:
    case 3:
    case 4:
    case 5:
      stellarClassification.stellarClass = 'VI';
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
  if (stellarClassification.stellarType === 'hot')
    stellarClassification.stellarType = hotStarLookup({
      dm: 0,
      stellarClass: stellarClassification.stellarClass
    });

  return stellarClassification;
}

module.exports = specialStarTypeLookup;
