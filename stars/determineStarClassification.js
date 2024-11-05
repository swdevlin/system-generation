const StellarClassification = require("./StellarClassification");
const specialStarTypeLookup = require("../lookups/specialStarTypeLookup");
const hotStarLookup = require("../lookups/hotStarLookup");
const starTypeLookup = require("../lookups/starTypeLookup");
const {twoD6, d6, percentageChance} = require("../dice");
const {ORBIT_TYPES, isHotter, TYPES_BY_TEMP, STELLAR_TYPES, isAnomaly} = require("../utils");
const companionStarLookup = require("../lookups/companionStarLookup");
const secondaryStarLookup = require("../lookups/secondaryStarLookup");
const makeCooler = require("./makeCooler");
const unusualStarLookup = require("../lookups/unusualStarLookup");
const subtypeLookup = require("../lookups/subtypeLookup");

const primaryStarClassification = ({unusualChance}) => {
  let classification = new StellarClassification();

  const type = starTypeLookup({dm: 0})

  if (type === 'special') {
    if (unusualChance && percentageChance(unusualChance))
        classification = unusualStarLookup();
    else
      classification = specialStarTypeLookup();
  }
  else if (type === 'hot')
    classification.stellarType = hotStarLookup({stellarClass: classification.stellarClass});
  else
    classification.stellarType = type;

  if (!classification.isAnomaly && !classification.stellarClass)
    classification.stellarClass = 'V';

  classification.subtype = subtypeLookup({
    isPrimary: true,
    stellarType: classification.stellarType,
    stellarClass: classification.stellarClass
  });

  return classification;
}

const multiStarClassification = ({primary, unusualChance, orbitType}) => {
  let classification = new StellarClassification();
  let type;
  if (orbitType === ORBIT_TYPES.COMPANION)
    type = companionStarLookup({primary: primary, unusualChance: unusualChance});
  else
    type = secondaryStarLookup({primary: primary, unusualChance: unusualChance});

  if (type === 'Random') {
    classification = primaryStarClassification({unusualChance});
    if (isHotter(classification, primary)) {
      type = 'Lesser';
      classification = new StellarClassification();
    }
  }

  if (type === 'Lesser') {
    if (primary.stellarType === STELLAR_TYPES.BlackHole)
      classification.stellarType = STELLAR_TYPES.NeutronStar;
    else if (primary.stellarType === STELLAR_TYPES.NeutronStar)
      classification.stellarType = STELLAR_TYPES.WhiteDwarf;
    else if (primary.stellarType === STELLAR_TYPES.Pulsar)
      classification.stellarType = STELLAR_TYPES.WhiteDwarf;
    else if (primary.stellarType === STELLAR_TYPES.WhiteDwarf)
      classification.stellarType = STELLAR_TYPES.BrownDwarf;
    else
      classification = makeCooler(primary);
  } else if (type === 'Sibling') {
    classification.stellarType = primary.stellarType;
    classification.stellarClass = primary.stellarClass;
    if (classification.stellarType === 'M') {
      classification.subtype = Math.min(9, primary.subtype + d6());
      if (classification.stellarClass === 'IV')
        classification.stellarClass = 'III'
    }
    if (primary.subtype !== null) {
      classification.subtype = primary.subtype + d6();
      if (classification.subtype > 9) {
        classification.subtype -= 10;
        classification.stellarType = TYPES_BY_TEMP[TYPES_BY_TEMP.indexOf(classification.stellarType) + 1];
        if (classification.stellarClass === 'VI' && ['A', 'F'].includes(classification.stellarType)) {
          classification.stellarType = 'G';
        } else if (classification.stellarClass === 'IV' && ((classification.stellarType === 'K' && classification.subtype >= 5) || classification.stellarType === 'M'))
          classification.stellarClass = 'V';
      }
    }
  } else if (type === STELLAR_TYPES.BrownDwarf) {
    classification.stellarType = STELLAR_TYPES.BrownDwarf;
  } else if (type === STELLAR_TYPES.WhiteDwarf) {
    classification.stellarType = STELLAR_TYPES.WhiteDwarf;
  } else if (type === STELLAR_TYPES.NeutronStar) {
    classification.stellarType = STELLAR_TYPES.NeutronStar;
  } else if (type === 'Twin') {
    classification.stellarType = primary.stellarType;
    classification.stellarClass = primary.stellarClass;
    classification.subtype = primary.subtype;
  }

  return classification;
}

const determineStarClassification = ({unusualChance, primary, orbitType}) => {
  if (!primary)
    return primaryStarClassification({unusualChance: unusualChance});
  else
    return multiStarClassification({
      primary: primary, unusualChance: unusualChance, orbitType: orbitType
    });
}

module.exports = {
  determineStarClassification: determineStarClassification,
  primaryStarClassification: primaryStarClassification,
  multiStarClassification: multiStarClassification,
};
