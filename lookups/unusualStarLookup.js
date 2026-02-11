const giantsStellarClassLookup = require('./giantsStellarClassLookup');
const StellarClassification = require('../stars/StellarClassification');
const peculiarStarLookup = require('./peculiarStarLookup');
const starTypeLookup = require('./starTypeLookup');
const hotStarLookup = require('./hotStarLookup');
const { STELLAR_TYPES } = require('../utils');
const { twoD6 } = require('../dice');

const unusualStarLookup = () => {
  let stellarClassification = new StellarClassification();
  const roll = twoD6();

  if (roll <= 2) {
    stellarClassification.stellarType = peculiarStarLookup();
    if (stellarClassification.stellarType === STELLAR_TYPES.Protostar) {
      stellarClassification.isProtostar = true;
      stellarClassification.stellarType = starTypeLookup({ dm: 1 });
      stellarClassification.stellarClass = 'V';
    }
  } else if (roll >= 12) {
    stellarClassification.stellarClass = giantsStellarClassLookup();
    stellarClassification.stellarType = starTypeLookup({
      dm: 1,
      stellarClass: stellarClassification.stellarClass,
    });
  } else {
    switch (roll) {
      case 3:
        stellarClassification.stellarClass = 'VI';
        stellarClassification.stellarType = starTypeLookup({
          dm: 1,
          stellarClass: stellarClassification.stellarClass,
        });
        break;
      case 4:
        stellarClassification.stellarClass = 'IV';
        stellarClassification.stellarType = starTypeLookup({
          dm: 1,
          stellarClass: stellarClassification.stellarClass,
        });
        break;
      case 5:
      case 6:
      case 7:
        stellarClassification.stellarType = STELLAR_TYPES.BrownDwarf;
        stellarClassification.stellarClass = '';
        break;
      case 8:
      case 9:
      case 10:
        stellarClassification.stellarType = STELLAR_TYPES.WhiteDwarf;
        stellarClassification.stellarClass = '';
        break;
      case 11:
        stellarClassification.stellarClass = 'III';
        stellarClassification.stellarType = starTypeLookup({
          dm: 1,
          stellarClass: stellarClassification.stellarClass,
        });
        break;
      default:
        stellarClassification.stellarClass = giantsStellarClassLookup();
        stellarClassification.stellarType = starTypeLookup({
          dm: 1,
          stellarClass: stellarClassification.stellarClass,
        });
        break;
    }
  }

  if (stellarClassification.stellarType === 'hot')
    stellarClassification.stellarType = hotStarLookup({
      stellarClass: stellarClassification.stellarClass,
    });

  return stellarClassification;
};

module.exports = unusualStarLookup;
