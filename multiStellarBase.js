const {twoD6, d6} = require("./dice");
const {TYPES_BY_TEMP, makeCooler, isHotter, ORBIT_TYPES} = require("./utils");
const {generateBaseStar} = require("./generateBaseStar");
const Star = require("./star");
const Random = require("random-js").Random;

const r = new Random();

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
  else if (stellarType === 'D' || stellarType === 'BD') {
    star.stellarClass = '';
    if (stellarType === 'BD') {
      switch (d6()) {
        case 1:
        case 2:
          star.stellarType = 'L';
          break;
        case 3:
        case 4:
          star.stellarType = 'T';
          break;
        case 5:
        case 6:
          star.stellarType = 'Y';
          break;
      }
      star.subtype = r.integer(0,9);
    } else {
      star.stellarType = stellarType;
      star.subtype = '';
    }
  } else if (stellarType === 'Twin') {
    star.stellarType = primary.stellarType;
    star.stellarClass = primary.stellarClass;
    star.subtype = primary.subtype;
  } else if (stellarType === 'Sibling') {
    star.stellarType = primary.stellarType;
    star.stellarClass = primary.stellarClass;
    if (star.stellarType === 'M')
      star.subtype = Math.min(9, primary.subtype + r.die(6));
    else {
      star.subtype = primary.subtype + r.die(6);
      if (star.subtype > 9) {
        star.subtype -= 10;
        star.stellarType = TYPES_BY_TEMP[TYPES_BY_TEMP.indexOf(star.stellarType) + 1];
        if (star.stellarClass === 'VI' && ['A', 'F'].includes(star.stellarType))
          star.stellarType = 'G';
        else if (star.class === 'IV' && ((star.stellarType === 'K' && star.subtype >=5) || star.stellarType === 'M') )
          star.stellarClass = 'V';
      }
    }
  }

  if (star.stellarType === 'BD') {
    switch (r.die(3)) {
      case 1: star.stellarType = 'L'; break;
      case 2: star.stellarType = 'T'; break;
      case 3: star.stellarType = 'Y'; break;
    }
    star.subtype = r.integer(0,9);
    star.stellarClass = '';
  }
  return new Star(stellarClass, stellarType, subtype, orbitType);
};

module.exports = multiStellarBase;
