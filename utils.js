const subtypeLookup = require("./subtypeLookup");
const {twoD6} = require("./dice");
const Star = require("./star");
const Random = require("random-js").Random;

const r = new Random();

const TYPES_BY_TEMP = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

const ORBIT_TYPES = {
  PRIMARY: 0,
  CLOSE: 1,
  NEAR: 2,
  FAR: 3,
  COMPANION: 4,
}

const isHotter = (starA, starB) => {
  if (starA.stellarType === starB.stellarType)
    return starA.subtype < starB.subtype;
  else
    return TYPES_BY_TEMP.indexOf(starA.stellarType) < TYPES_BY_TEMP.indexOf(starB.stellarType);
};

const determineDataKey = (stellarType, subtype) => {
  let dataKey;
  if (stellarType === 'M') {
    if (subtype < 5)
      dataKey = 'M0';
    else if (subtype < 9)
      dataKey = 'M5';
    else
      dataKey = 'M9';
  } else {
    if (subtype === '')
      dataKey = stellarType;
    else if (subtype < 5)
      dataKey = stellarType + '0';
    else
      dataKey = stellarType + '5';
  }

  return dataKey;
}

const companionOrbit = () => {
  return r.die(6)/10+(twoD6()-7)/100;
}

const additionalStarDM = (primary) => {
  let dm = 0;
  switch (primary.stellarClass) {
    case 'Ia':
    case 'Ib':
    case 'II':
    case 'III':
    case 'IV':
      dm = 1;
      break;
    case 'V':
    case 'VI':
      if (['O', 'B', 'A', 'F'].includes(primary.stellarType))
        dm = 1;
      else if (primary.stellarType === 'M')
        dm = -1
      break;
  }
  return dm;
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = r.integer(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const computeBaseline = (star) => {
  let baseline = twoD6();
  if (star.companion)
    baseline -= 2;
  if (['Ia', 'Ib', 'II'].includes(star.stellarClass))
    baseline += 3;
  else if (star.stellarClass === 'III')
    baseline += 2;
  else if (star.stellarClass === 'IV')
    baseline += 1;
  else if (star.stellarClass === 'VI')
    baseline -= 1;
  if (star.totalObjects < 6)
    baseline -= 4;
  else if (star.totalObjects <= 9)
    baseline -= 3;
  else if (star.totalObjects <= 12)
    baseline -= 2;
  else if (star.totalObjects <= 15)
    baseline -= 1;
  else if (star.totalObjects >= 18 && star.totalObjects <= 20)
    baseline += 1;
  else if (star.totalObjects > 20)
    baseline += 2;
  return baseline;
}

module.exports = {
  isHotter: isHotter,
  determineDataKey: determineDataKey,
  companionOrbit: companionOrbit,
  additionalStarDM: additionalStarDM,
  shuffleArray: shuffleArray,
  computeBaseline: computeBaseline,
  TYPES_BY_TEMP: TYPES_BY_TEMP,
  ORBIT_TYPES: ORBIT_TYPES,
};
