const StellarClassification = require("./StellarClassification");
const specialStarTypeLookup = require("../lookups/specialStarTypeLookup");
const hotStarLookup = require("../lookups/hotStarLookup");
const starTypeLookup = require("../lookups/starTypeLookup");
const {twoD6, d6} = require("../dice");
const {ORBIT_TYPES, isHotter, TYPES_BY_TEMP, STELLAR_TYPES} = require("../utils");
const companionStarLookup = require("../lookups/companionStarLookup");
const secondaryStarLookup = require("../lookups/secondaryStarLookup");
const makeCooler = require("./makeCooler");

const primaryStarClassification = ({unusualChance}) => {
  let classification = new StellarClassification();

  const type = starTypeLookup({dm: 0})

  if (!classification.stellarClass)
    classification.stellarClass = 'V';

  if (type === 'special')
    classification = specialStarTypeLookup({dm: 0, unusualChance: unusualChance});
  else if (type === 'hot')
    classification.stellarType = hotStarLookup({dm: 0, stellarClass: classification.stellarClass});
  else
    classification.stellarType = type;


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
    if (isHotter(classification, primary))
      type = 'Lesser';
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
    if (classification.stellarType === 'M')
      classification.subtype = Math.min(9, primary.subtype + d6());
    else {
      classification.subtype = primary.subtype + d6();
      if (classification.subtype > 9) {
        classification.subtype -= 10;
        classification.stellarType = TYPES_BY_TEMP[TYPES_BY_TEMP.indexOf(classification.stellarType) + 1];
        if (classification.stellarClass === 'VI' && ['A', 'F'].includes(classification.stellarType))
          classification.stellarType = 'G';
        else if (classification.stellarClass === 'IV' && ((classification.stellarType === 'K' && classification.subtype >=5) || classification.stellarType === 'M') )
          classification.stellarClass = 'V';
      }
    }
  } else if (type === 'BD') {
    classification.stellarType = STELLAR_TYPES.BrownDwarf;
  } else if (type === 'D') {
    classification.stellarType = STELLAR_TYPES.WhiteDwarf;
  } else if (type === 'NS') {
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
