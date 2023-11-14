const {twoD6, d6} = require("../dice");
const generateBaseStar = require("./generateBaseStar");
const Star = require("./star");
const makeCooler = require("./makeCooler");
const {TYPES_BY_TEMP, isHotter, ORBIT_TYPES} = require("../utils");

const secondaryType = (dm) => {
  const roll = twoD6() + dm;
  if (roll <= 3)
    return otherType(dm);
  else if (roll <= 6) {
    return 'Random';
  } else if (roll <= 8) {
    return 'Lesser';
  } else if (roll <= 10) {
    return 'Sibling';
  } else {
    return 'Twin';
  }
}

const companionType = (dm) => {
  const roll = twoD6() + dm;
  if (roll <= 3)
    return otherType(dm);
  else if (roll <= 5) {
    return 'Random';
  } else if (roll <= 7) {
    return 'Lesser';
  } else if (roll <= 9) {
    return 'Sibling';
  } else {
    return 'Twin';
  }
}

const otherType = (dm) => {
  const roll = twoD6() + dm;
  if (roll <= 2)
    return 'D';
  else if (roll <= 7) {
    return 'D';
  } else {
    return 'BD';
  }
}

const multiStellarBase = (primary, orbitType) => {
  const dm = primary.stellarClass === 'III' || primary.stellarClass === 'IV' ? -1 : 0
  let stellarType;
  let stellarClass;
  let subtype;
  let star;

  if (orbitType === ORBIT_TYPES.COMPANION)
    stellarType = companionType(dm);
  else
    stellarType = secondaryType(dm);

  if (stellarType === 'Random') {
    star = generateBaseStar(0, orbitType);
    if (isHotter(star, primary))
      stellarType = 'Lesser';
  }

  if (stellarType === 'Lesser')
    star = makeCooler(primary, orbitType);
  else if (stellarType === 'Twin') {
    star = new Star(primary.stellarClass, primary.stellarType, primary.subtype, orbitType);
  } else if (stellarType === 'Sibling') {
    stellarType = primary.stellarType;
    stellarClass = primary.stellarClass;
    if (stellarType === 'M')
      subtype = Math.min(9, primary.subtype + d6());
    else {
      subtype = primary.subtype + d6();
      if (subtype > 9) {
        subtype -= 10;
        stellarType = TYPES_BY_TEMP[TYPES_BY_TEMP.indexOf(stellarType) + 1];
        if (stellarClass === 'VI' && ['A', 'F'].includes(stellarType))
          stellarType = 'G';
        else if (stellarClass === 'IV' && ((stellarType === 'K' && subtype >=5) || stellarType === 'M') )
          stellarClass = 'V';
      }
    }
    star = new Star(stellarClass, stellarType, subtype, orbitType);
  } else if (stellarType === 'D') {
    star = new Star(stellarType, stellarType, subtype, orbitType);
  } else if (stellarType === 'BD') {
    star = new Star(stellarType, stellarType, subtype, orbitType);
  }
  return star;
};

module.exports = multiStellarBase;
