const { twoD6 } = require('../dice');
const giantsStellarClassLookup = require('./giantsStellarClassLookup');
const starTypeLookup = require('./starTypeLookup');
const StellarClassification = require('../stars/StellarClassification');
const hotStarLookup = require('./hotStarLookup');

const specialStarTypeLookup = () => {
  const stellarClassification = new StellarClassification();

  const roll = twoD6();
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
      stellarClassification.stellarClass = giantsStellarClassLookup();
      break;
  }

  stellarClassification.stellarType = starTypeLookup({
    dm: 1,
    stellarClass: stellarClassification.stellarClass,
  });
  if (stellarClassification.stellarType === 'hot')
    stellarClassification.stellarType = hotStarLookup({
      stellarClass: stellarClassification.stellarClass,
    });

  return stellarClassification;
};

module.exports = specialStarTypeLookup;
