require('dotenv').config();
const {d6, twoD6} = require("../dice");
const orbitToAU = require("./orbitToAU");
const Random = require("random-js").Random;

const r = new Random();

const TYPES_BY_TEMP = ['O', 'B', 'A', 'F', 'G', 'K', 'M', 'D', 'L', 'T', 'Y'];

const AU = 149597870.9;

const SOL_DIAMETER = 1392000;
const EARTH_DIAMETER = 12756;

const StarColour = {
  'O': 'Blue',
  'B': 'Blue White',
  'A': 'White',
  'F': 'Yellow White',
  'G': 'Yellow',
  'K': 'Light Orange',
  'M': 'Orange Red',
  'D': 'White',
  'L': 'Deep Dim Red',
  'T': 'Deep Dim Red',
  'Y': 'Deep Dim Red',
}

const ORBIT_TYPES = {
  PRIMARY: 0,
  CLOSE: 1,
  NEAR: 2,
  FAR: 3,
  COMPANION: 4,
  GAS_GIANT: 10,
  TERRESTRIAL: 11,
  PLANETOID_BELT: 12,
  PLANETOID_BELT_OBJECT: 13,
}

const STELLAR_TYPES = {
  WhiteDwarf: 'D',
  BrownDwarf: 'BD',
  BlackHole: 'BH',
  Pulsar: 'PSR',
  NeutronStar: 'NS',
  StarCluster: 'SC',
  Anomaly: 'AN',
  Nebula: 'NB',
  Protostar: 'PS',
}

const toHex = (v) => {
  switch (v) {
    case 10:
      return 'A';
    case 11:
      return 'B';
    case 12:
      return 'C';
    case 13:
      return 'D';
    case 14:
      return 'E';
    case 15:
      return 'F';
    case 16:
      return 'G';
    case 17:
      return 'H';
    case 18:
      return 'J';
    case 19:
      return 'K';
    default:
      return v.toString();
  }
}

const hexToInt = (v) => {
  if (v >= 'A' && v <= 'H')
    return v.charCodeAt(0) - 55;
  else if (v >= 'J')
    return v.charCodeAt(0) - 56;
  else
    return parseInt(v);
}

const deconstructUWP = (uwp) => {
  return {
    starPort: uwp[0],
    size: hexToInt(uwp[1]),
    atmosphere: hexToInt(uwp[2]),
    hydrographics: hexToInt(uwp[3]),
    population: hexToInt(uwp[4]),
    government: hexToInt(uwp[5]),
    lawLevel: hexToInt(uwp[6]),
    techLevel: hexToInt(uwp[8]),
  }
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
  return d6()/10 + (twoD6()-7)/100;
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
  let log = `roll: ${baseline}`;

  if (star.companion) {
    baseline -= 2;
    log += `, companion -2`;
  }

  if (['Ia', 'Ib', 'II'].includes(star.stellarClass)) {
    baseline += 3;
    log += `, stellarClass ${star.stellarClass} +3`;
  } else if (star.stellarClass === 'III') {
    baseline += 2;
    log += `, stellarClass III +2`;
  } else if (star.stellarClass === 'IV') {
    baseline += 1;
    log += `, stellarClass IV +1`;
  } else if (star.stellarClass === 'VI') {
    baseline -= 1;
    log += `, stellarClass VI -1`;
  }

  if (star.totalObjects < 6) {
    baseline -= 4;
    log += `, totalObjects ${star.totalObjects} -4`;
  } else if (star.totalObjects <= 9) {
    baseline -= 3;
    log += `, totalObjects ${star.totalObjects} -3`;
  } else if (star.totalObjects <= 12) {
    baseline -= 2;
    log += `, totalObjects ${star.totalObjects} -2`;
  } else if (star.totalObjects <= 15) {
    baseline -= 1;
    log += `, totalObjects ${star.totalObjects} -1`;
  } else if (star.totalObjects >= 18 && star.totalObjects <= 20) {
    baseline += 1;
    log += `, totalObjects ${star.totalObjects} +1`;
  } else if (star.totalObjects > 20) {
    baseline += 2;
    log += `, totalObjects ${star.totalObjects} +2`;
  }

  star.buildLog.push({ baseline: log });
  return baseline;
};

const starIdentifier = (starIndex) => {
  let identifier = String.fromCharCode(64 + starIndex[0])
  for (let i=1; i < starIndex.length; i++)
    identifier += String.fromCharCode(96 + starIndex[i])
  return identifier;
}

const sequenceIdentifier = (starIndex, index) => {
  return `${starIndex} ${romanNumeral(index)}`;
}

const orbitText = (orbit, index, starIndex) => {
  try {
    if (index)
      return `${orbitToAU(orbit).toFixed(2)} (${orbit.toFixed(2)}) ${sequenceIdentifier(index, starIndex)}`;
    else
      return `${orbitToAU(orbit).toFixed(2)} (${orbit.toFixed(2)})`;
  } catch (e) {
    console.log(e);
    return `bad orbit`;
  }
}

const romanNumeral = (n) => {
  const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
  let roman = '';
  for (const i in lookup ) {
    while ( n >= lookup[i] ) {
      roman += i;
      n -= lookup[i];
    }
  }
  return roman;
}

const isAnomaly = (type) => {
  return [
    STELLAR_TYPES.Anomaly,
    STELLAR_TYPES.BlackHole,
    // STELLAR_TYPES.BrownDwarf,
    // 'L', 'T', 'Y',
    STELLAR_TYPES.Nebula,
    STELLAR_TYPES.NeutronStar,
    STELLAR_TYPES.Protostar,
    STELLAR_TYPES.Pulsar,
    STELLAR_TYPES.StarCluster,
    STELLAR_TYPES.WhiteDwarf,
  ].includes(type);
}

const isNonBrownDwarfAnomaly = (type) => {
  return [
    STELLAR_TYPES.Anomaly,
    STELLAR_TYPES.BlackHole,
    STELLAR_TYPES.Nebula,
    STELLAR_TYPES.NeutronStar,
    STELLAR_TYPES.Protostar,
    STELLAR_TYPES.Pulsar,
    STELLAR_TYPES.StarCluster,
    STELLAR_TYPES.WhiteDwarf,
  ].includes(type);
}

const isBrownDwarf = (type) => {
  return [
    STELLAR_TYPES.BrownDwarf,
    'L', 'T', 'Y',
  ].includes(type);
}

const getBoolFromEnv = (key) => {
  return process.env[key] === 'true';
}

module.exports = {
  additionalStarDM: additionalStarDM,
  companionOrbit: companionOrbit,
  computeBaseline: computeBaseline,
  deconstructUWP: deconstructUWP,
  determineDataKey: determineDataKey,
  getBoolFromEnv: getBoolFromEnv,
  hexToInt: hexToInt,
  isAnomaly: isAnomaly,
  isBrownDwarf: isBrownDwarf,
  isHotter: isHotter,
  isNonBrownDwarfAnomaly: isNonBrownDwarfAnomaly,
  orbitText: orbitText,
  romanNumeral: romanNumeral,
  sequenceIdentifier: sequenceIdentifier,
  shuffleArray: shuffleArray,
  starIdentifier: starIdentifier,
  toHex: toHex,
  TYPES_BY_TEMP: TYPES_BY_TEMP,
  ORBIT_TYPES: ORBIT_TYPES,
  STELLAR_TYPES: STELLAR_TYPES,
  AU: AU,
  StarColour: StarColour,
  SOL_DIAMETER: SOL_DIAMETER,
  EARTH_DIAMETER: EARTH_DIAMETER,
};


module.exports.auToOrbit = require("./auToOrbit");
module.exports.orbitToAU = require("./orbitToAU");
module.exports.calculatePeriod = require("./calculatePeriod");
module.exports.hillSphere = require("./hillSphere").hillSphere;
module.exports.hillSpherePD = require("./hillSphere").hillSpherePD;
module.exports.eccentricity = require("./eccentricity");
module.exports.determineHydrographics = require("./determineHydrographics");
module.exports.meanTemperature = require("./meanTemperature");
module.exports.axialTilt = require("./axialTilt");
module.exports.calculateAlbedo = require("../atmosphere/albedo");
module.exports.orbitPosition = require("./orbitPosition");
module.exports.calculateDistance = require("./calculateDistance");
module.exports.travelTime = require("./travelTime");
