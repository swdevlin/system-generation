const StarColour = require("./starColour");
const StarMass = require("./starMass");
const StarTemperature = require("./starTemperature");
const StarDiameter = require("./starDiameter");
const {twoD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const stellarTypeLookup = (dm, stellarClass) => {
  let roll = twoD6() + dm;
  let stellarType;
  if (stellarClass && stellarClass === 'IV')
    if (roll >=3 && roll <= 6)
      roll += 5;

  if (roll <= 2)
    stellarType = 'Special';
  else if (roll >= 12)
    stellarType = 'Hot';
  else
    switch (roll) {
      case 3:
      case 4:
      case 5:
      case 6:
        stellarType = 'M';
        break;
      case 7:
      case 8:
        stellarType = 'K';
        break;
      case 9:
      case 10:
        stellarType = 'G';
        break;
      case 11:
        stellarType = 'F';
        break;
    }
  if (stellarClass && stellarClass === 'VI')
    if (stellarType === 'F')
      stellarType = 'G';
    else if (stellarType === 'A')
      stellarType = 'B';

  return stellarType;
}

const hotLookup = (dm, stellarClass) => {
  const roll = r.die(6) + r.die(6) + dm;
  if (roll <= 9)
    return 'A';
  else if (roll <= 11)
    return 'B';
  else
    if (stellarClass && stellarClass === 'IV')
      return 'B';
    else
      return 'O';
}

const subtypeLookup = (isPrimary, stellarType, stellarClass) => {
  const roll = r.die(6) + r.die(6);
  let subtype;
  if (isPrimary && stellarType === 'M')
    switch (roll) {
      case  2:
        subtype = 8;
        break;
      case  3:
        subtype = 6;
        break;
      case  4:
        subtype = 5;
        break;
      case  5:
        subtype = 4;
        break;
      case  6:
        subtype = 0;
        break;
      case  7:
        subtype = 2;
        break;
      case  8:
        subtype = 1;
        break;
      case  9:
        subtype = 3;
        break;
      case 10:
        subtype = 5;
        break;
      case 11:
        subtype = 7;
        break;
      case 12:
        subtype = 9;
        break;
    }
  else
    switch (roll) {
      case  2:
        subtype = 0;
        break;
      case  3:
        subtype = 1;
        break;
      case  4:
        subtype = 3;
        break;
      case  5:
        subtype = 5;
        break;
      case  6:
        subtype = 7;
        break;
      case  7:
        subtype = 9;
        break;
      case  8:
        subtype = 8;
        break;
      case  9:
        subtype = 6;
        break;
      case 10:
        subtype = 4;
        break;
      case 11:
      	subtype = 2;
      	break;
      case 12:
        subtype = 0;
        break;
    }

  if (stellarClass === 'IV' && stellarType === 'K' && subtype > 4)
    subtype -= 5;

  return subtype;
}

const giantsLookup = (dm) => {
  const roll = r.die(6) + r.die(6) + dm;
  let stellarClass;
  if (roll <= 8)
    stellarClass = 'III';
  else if (roll <= 10)
    stellarClass = 'II';
  else if (roll <= 11)
    stellarClass = 'Ib';
  else
    stellarClass = 'Ia';
  return stellarClass;
}

const specialLookup = (dm) => {
  const roll = r.die(6) + r.die(6) + dm;
  let stellarClass;
  let stellarType;
  if (roll <= 5) {
    stellarClass = 'VI';
    stellarType = stellarTypeLookup(1, stellarClass);
  } else if (roll <= 8) {
    stellarClass = 'IV';
    stellarType = stellarTypeLookup(1, stellarClass);
  } else if (roll <= 10) {
    stellarClass = 'III';
    stellarType = stellarTypeLookup(1, stellarClass);
  }
  else {
    stellarClass = giantsLookup(0);
    stellarType = stellarTypeLookup(1, stellarClass);
  }
  if (stellarType === 'Hot')
    stellarType = hotLookup(0);

  return {
    stellarClass: stellarClass,
    stellarType: stellarType,
  };
}

const addMassAndTemperature = (star) => {
  switch (star.stellarClass) {
    case 'O':

      break;
  }
}

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
    if (subtype < 5)
      dataKey = stellarType + '0';
    else
      dataKey = stellarType + '5';
  }

  return dataKey;
}

const generateStar = (primary, dm) => {
  let star = '';
  let stellarClass = '';
  let stellarType = stellarTypeLookup(primary, 0);
  if (stellarType === 'Special') {
    const s= specialLookup(0);
    stellarClass = s.stellarClass;
    stellarType = s.stellarType;
  } else if (stellarType === 'Hot') {
    stellarType = hotLookup(0);
    stellarClass = 'V';
  } else {
    stellarClass = 'V';
  }
  const subtype = subtypeLookup(true, stellarType, stellarClass);

  let dataKey = determineDataKey(stellarType, subtype);

  const diameter = StarDiameter[dataKey][stellarClass];
  const temperature = StarTemperature[dataKey];
  let luminosity= diameter**2 + (temperature/5772)**4;
  if (luminosity > 10)
    luminosity = Math.round(luminosity);
  else
    luminosity =  Math.round(luminosity * 100) / 100;
  const mass = StarMass[dataKey][stellarClass];
  const mainSequenceLifespan = 10/(mass**2.5);
  let age;
  if (stellarClass === 'III') {
    age = mainSequenceLifespan;
    age += mainSequenceLifespan / (4/mass);
    age += mainSequenceLifespan / (10 * mass**3) * r.die(100)/100;
  } else if (stellarClass === 'IV') {
    age = mainSequenceLifespan / (4/mass);
    age = mainSequenceLifespan + age * r.die(100)/100;
  } else if (mass > 0.9) {
    age = mainSequenceLifespan * (r.die(6)-1/(r.die(6)/6))/6;
  } else {
    age = r.die(6)*2/(r.die(3) + r.die(10)/10);
  }
  if (mass < 4.7 && age < 0.01)
    age = 0.01;
  age = Math.round(age * 100) / 100;
  return {
    stellarClass: stellarClass,
    stellarType: stellarType,
    subtype: subtype,
    colour: StarColour[stellarType],
    mass: mass,
    diameter: diameter,
    temperature: temperature,
    luminosity: luminosity,
    age: age,
  };
};

module.exports = {
  generateStar: generateStar,
  generateBaseStar: generateBaseStar,
};
