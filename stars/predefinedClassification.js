const StellarClassification = require("./StellarClassification");
const giantsStellarClassLookup = require("../lookups/giantsStellarClassLookup");
const { isBrownDwarf, STELLAR_TYPES } = require("../utils");

const ANOMALY_TYPES = new Set([
  STELLAR_TYPES.WhiteDwarf,
  STELLAR_TYPES.BrownDwarf,
  STELLAR_TYPES.BlackHole,
  STELLAR_TYPES.Pulsar,
  STELLAR_TYPES.NeutronStar,
  STELLAR_TYPES.StarCluster,
  STELLAR_TYPES.Anomaly,
  STELLAR_TYPES.Nebula,
  STELLAR_TYPES.Protostar,
]);

const predefinedClassification = (star) => {
  const classification = new StellarClassification();

  if (ANOMALY_TYPES.has(star.type)) {
    classification.stellarType = star.type;
    classification.isProtostar = star.type === STELLAR_TYPES.Protostar;
  } else {
    const tokens = star.type.split('');

    classification.stellarType = tokens[0];
    classification.subtype = parseInt(tokens[1]);

    if (isBrownDwarf(classification.stellarType)) {
      classification.stellarClass = '';
    } else if (star.class) {
      if (star.class.toLowerCase() === 'giant')
        classification.stellarClass = giantsStellarClassLookup();
      else
        classification.stellarClass = star.class;
    } else {
      classification.stellarClass = 'V';
    }
  }

  return classification;
}

module.exports = predefinedClassification;
