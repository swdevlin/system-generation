const {twoD6} = require("./dice");
const stellarTypeLookup = require("./stellarTypeLookup");
const subtypeLookup = require("./subtypeLookup");
const Random = require("random-js").Random;

const r = new Random();

const hotLookup = (dm, stellarClass) => {
  const roll = twoD6() + dm;
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

const giantsLookup = (dm) => {
  const roll = twoD6() + dm;
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
  const roll = twoD6() + dm;
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

const generateBaseStar = (dm) => {
  let stellarClass = '';
  let stellarType = stellarTypeLookup(0);
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
  return {
    stellarClass: stellarClass,
    stellarType: stellarType,
    subtype: subtype,
  };
};

module.exports = {
  generateBaseStar: generateBaseStar,
};
