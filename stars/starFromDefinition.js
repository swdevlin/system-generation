const predefinedClassification = require("./predefinedClassification");
const Star = require("./star");
const {ORBIT_TYPES, companionOrbit, calculatePeriod} = require("../utils");

const starFromDefinition = (definition, orbitType, unusualChance) => {
  const classification = predefinedClassification(definition);
  const star = new Star(classification, orbitType);
  if (definition.companion) {
    const companion = starFromDefinition(definition.companion, ORBIT_TYPES.COMPANION, unusualChance);
    star.companion = companion;
    companion.orbit = companionOrbit();
    companion.period = calculatePeriod(companion, star);
  }
  return star;
}

module.exports = starFromDefinition;
