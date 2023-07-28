const subtypeLookup = require("./subtypeLookup");
const Star = require("./star");
const {TYPES_BY_TEMP} = require("../utils");

const makeCooler = (star, orbitType) => {
  let stellarType;
  let stellarClass;
  let subtype;

  if (star.stellarType === 'M') {
    stellarType = star.stellarType;
    stellarClass = star.stellarClass;
    subtype = subtypeLookup(false, 'M', star.stellarClass);
    if (subtype > star.subtype) {
      stellarType = 'BD';
      stellarClass = 'BD';
      subtype = '';
    }
  } else {
    stellarType = TYPES_BY_TEMP[TYPES_BY_TEMP.indexOf(star.stellarType) + 1];
    stellarClass = star.stellarClass;
    subtype = subtypeLookup(false, star.stellarType, star.stellarClass);
    if (stellarType === 'O' && stellarClass === 'IV')
      stellarClass = 'V';
    else if (stellarType === 'F' && stellarClass === 'VI')
      stellarClass = 'V';
    else if (stellarType === 'A' && stellarClass === 'VI')
      stellarClass = 'V';
  }

  return new Star(stellarClass, stellarType, subtype, orbitType);
};

module.exports = makeCooler;
