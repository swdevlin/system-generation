const subtypeLookup = require("./subtypeLookup");
const {twoD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const TYPES_BY_TEMP = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

const ORBIT_TYPES = {
  PRIMARY: 0,
  CLOSE: 1,
  NEAR: 2,
  FAR: 3,
}

const isHotter = (starA, starB) => {
  if (starA.stellarType === starB.stellarType)
    return starA.subtype < starB.subtype;
  else
    return TYPES_BY_TEMP.indexOf(starA.stellarType) < TYPES_BY_TEMP.indexOf(starB.stellarType);
};

const makeCooler = (star) => {
  const cooler = {};
  if (star.stellarType === 'M') {
    cooler.stellarType = star.stellarType;
    cooler.stellarClass = star.stellarClass;
    cooler.subtype = subtypeLookup(false, 'M', star.stellarClass);
    if (cooler.subtype > star.subtype)
      cooler.stellarType = 'BD';
      cooler.stellarClass = 'BD';
      cooler.subtype = '';
  } else {
    cooler.stellarType = TYPES_BY_TEMP[TYPES_BY_TEMP.indexOf(star.stellarType) + 1];
    cooler.stellarClass = star.stellarClass;
    cooler.subtype = subtypeLookup(false, star.stellarType, star.stellarClass);
    if (cooler.stellarType === 'O' && cooler.stellarClass === 'IV')
      cooler.stellarClass = 'V';
    else if (cooler.stellarType === 'F' && cooler.stellarClass === 'VI')
      cooler.stellarClass = 'V';
    else if (cooler.stellarType === 'A' && cooler.stellarClass === 'VI')
      cooler.stellarClass = 'V';
  }

  return cooler;
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

module.exports = {
  isHotter: isHotter,
  makeCooler: makeCooler,
  determineDataKey: determineDataKey,
  companionOrbit: companionOrbit,
  additionalStarDM: additionalStarDM,
  TYPES_BY_TEMP: TYPES_BY_TEMP,
  ORBIT_TYPES: ORBIT_TYPES,
};
