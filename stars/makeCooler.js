const Star = require("./star");
const {TYPES_BY_TEMP} = require("../utils");
const StellarClassification = require("./StellarClassification");
const subtypeLookup = require("../lookups/subtypeLookup");

const makeCooler = (star) => {
  let classification = new StellarClassification();

  if (star.stellarType === 'M') {
    classification.stellarType = star.stellarType;
    classification.stellarClass = star.stellarClass;
    classification.subtype = subtypeLookup(false, 'M', star.stellarClass);
    if (classification.subtype > star.subtype) {
      classification.stellarType = 'BD';
      classification.stellarClass = '';
      classification.subtype = '';
    }
  } else {
    classification.stellarType = TYPES_BY_TEMP[TYPES_BY_TEMP.indexOf(star.stellarType) + 1];
    classification.stellarClass = star.stellarClass;
    classification.subtype = subtypeLookup(false, star.stellarType, star.stellarClass);
    if (classification.stellarType === 'O' && classification.stellarClass === 'IV')
      classification.stellarClass = 'V';
    else if (classification.stellarType === 'F' && classification.stellarClass === 'VI')
      classification.stellarClass = 'V';
    else if (classification.stellarType === 'A' && classification.stellarClass === 'VI')
      classification.stellarClass = 'V';
  }
  return classification;
};

module.exports = makeCooler;
