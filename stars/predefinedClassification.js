const StellarClassification = require("./StellarClassification");
const giantsStellarClassLookup = require("../lookups/giantsStellarClassLookup");

const predefinedClassification = (star) => {
  const tokens = star.type.split('');

  const classification = new StellarClassification();
  if (star.class) {
    if (star.class === 'Giant')
      classification.stellarClass = giantsStellarClassLookup(0);
    else
      classification.stellarClass = star.class;
  } else {
    classification.stellarClass = 'V';
  }
  classification.stellarType = tokens[0];
  classification.subtype = parseInt(tokens[1]);

  return classification;
}

module.exports = predefinedClassification;
