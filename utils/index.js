const {d6, twoD6} = require("../dice");
const orbitToAU = require("./orbitToAU");
const Random = require("random-js").Random;

const r = new Random();

const TYPES_BY_TEMP = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

const AU = 149597870.9;

const SOL_DIAMETER = 1392000;

const StarColour = {
  'O': 'Blue',
  'B': 'Blue White',
  'A': 'White',
  'F': 'Yellow White',
  'G': 'Yellow',
  'K': 'Light Orange',
  'M': 'Orange Red',
  'D': 'White',
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
  if (v === 10)
    return 'A';
  if (v === 11)
    return 'B';
  if (v === 12)
    return 'C';
  if (v === 13)
    return 'D';
  if (v === 14)
    return 'E';
  if (v === 15)
    return 'F';
  if (v === 16)
    return 'G';
  if (v === 17)
    return 'H';
  return v.toString();
}

const hexToInt = (v) => {
  if (v >= 'A')
    return v.charCodeAt(0) - 55;
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

const starIdentifier = (starIndex) => {
  let identifier = String.fromCharCode(64 + starIndex[0])
  for (let i=1; i < starIndex.length; i++)
    identifier += String.fromCharCode(96 + starIndex[i])
  return identifier;
}

const sequenceIdentifier = (index, starIndex) => {
  return `${starIdentifier(starIndex)} ${romanNumeral(index)}`;
}

const orbitText = (orbit, index, starIndex) => {
  if (!orbit)
    index = index;
  if (index)
    return `${orbitToAU(orbit).toFixed(2)} (${orbit.toFixed(2)}) ${sequenceIdentifier(index, starIndex)}`;
  else
    return `${orbitToAU(orbit).toFixed(2)} (${orbit.toFixed(2)})`;
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


module.exports = {
  isHotter: isHotter,
  determineDataKey: determineDataKey,
  companionOrbit: companionOrbit,
  additionalStarDM: additionalStarDM,
  shuffleArray: shuffleArray,
  toHex: toHex,
  hexToInt: hexToInt,
  orbitText: orbitText,
  computeBaseline: computeBaseline,
  TYPES_BY_TEMP: TYPES_BY_TEMP,
  ORBIT_TYPES: ORBIT_TYPES,
  STELLAR_TYPES: STELLAR_TYPES,
  AU: AU,
  StarColour: StarColour,
  SOL_DIAMETER: SOL_DIAMETER,
  romanNumeral: romanNumeral,
  sequenceIdentifier: sequenceIdentifier,
  starIdentifier: starIdentifier,
  deconstructUWP: deconstructUWP,
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
module.exports.calculateAlbedo = require("./albedo");
module.exports.orbitPosition = require("./orbitPosition");
module.exports.calculateDistance = require("./calculateDistance");
module.exports.travelTime = require("./travelTime");
