const Star = require("./star");
const {TYPES_BY_TEMP} = require("../utils");
const StellarClassification = require("./StellarClassification");
const subtypeLookup = require("../lookups/subtypeLookup");

// page 29
const makeCooler = (star) => {
  let classification = new StellarClassification();

  if (star.stellarType === 'M') {
    classification.stellarType = star.stellarType;
    classification.stellarClass = star.stellarClass;
    classification.subtype = subtypeLookup({
      isPrimary: false,
      stellarType: 'M',
      stellarClass: star.stellarClass
    });
    if (classification.subtype > star.subtype) {
      classification.stellarType = 'BD';
      classification.stellarClass = '';
      classification.subtype = '';
    }
  } else {
    let tempIndex = TYPES_BY_TEMP.indexOf(star.stellarType);
    if (tempIndex === TYPES_BY_TEMP.length - 1) {
      classification.stellarType = star.stellarType;
    } else
      classification.stellarType = TYPES_BY_TEMP[TYPES_BY_TEMP.indexOf(star.stellarType) + 1];
    classification.stellarClass = star.stellarClass;
    if (classification.stellarType === star.stellarType && classification.stellarClass === star.stellarClass) {
      if (star.subtype === 9)
        classification.subtype = star.subtype;
      else
        classification.subtype = star.subtype + 1;
    } else
      classification.subtype = subtypeLookup({
        isPrimary: false,
        stellarType: star.stellarType,
        stellarClass: star.stellarClass
      });
  }

  if (classification.stellarType === 'O' && classification.stellarClass === 'IV')
    classification.stellarClass = 'V';
  else if (classification.stellarType === 'F' && classification.stellarClass === 'VI')
    classification.stellarClass = 'V';
  else if (classification.stellarType === 'A' && classification.stellarClass === 'VI')
    classification.stellarClass = 'V';
  else if (classification.stellarType === 'M' && classification.stellarClass === 'IV')
    classification.stellarClass = 'V';
  else if (classification.stellarType === 'K' && classification.subtype >= 5 && classification.stellarClass === 'IV')
    classification.stellarClass = 'V';

  return classification;
};

module.exports = makeCooler;
