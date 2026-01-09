const {determineStarClassification} = require("../stars/determineStarClassification");
const Star = require("../stars/star");
const {ORBIT_TYPES, companionOrbit, calculatePeriod, additionalStarDM} = require("../utils");
const predefinedClassification = require("../stars/predefinedClassification");
const starFromDefinition = require("../stars/starFromDefinition");
const generateCloseSecondary = require("../stars/generateCloseSecondary");
const generateNearSecondary = require("../stars/generateNearSecondary");
const generateFarSecondary = require("../stars/generateFarSecondary");
const {twoD6, d6} = require("../dice");
const addCompanion = require("../stars/addCompanion");
const companionDM = require("../stars/companionDM");

const loadStarsFromDefinition = ({sector, subsector, definition, solarSystem}) => {
  let unusualChance = sector.unusualChance / 100;
  if (definition.unusualChance)
    unusualChance = definition.unusualChance / 100;

  let primary;
  let close;
  let near;
  let far;
  if (definition.primary) {
    primary = starFromDefinition(definition.primary, ORBIT_TYPES.PRIMARY, unusualChance);
    solarSystem.addPrimary(primary);
    if (definition.primary.close) {
      const classification = (definition.primary.close.type) ? predefinedClassification(definition.primary.close) : null;
      close = generateCloseSecondary({
        star: solarSystem.primaryStar,
        unusualChance: unusualChance,
        classification: classification
      });
      solarSystem.addStar(close);
    }

    if (definition.primary.near) {
      const classification = (definition.primary.near.type) ? predefinedClassification(definition.primary.near) : null;
      near = generateNearSecondary({
        star: solarSystem.primaryStar,
        unusualChance: unusualChance,
        classification: classification
      });
      solarSystem.addStar(near);
    }

    if (definition.primary.far) {
      const classification = (definition.primary.far.type) ? predefinedClassification(definition.primary.far) : null;
      far = generateFarSecondary({
        star: solarSystem.primaryStar,
        unusualChance: unusualChance,
        classification: classification
      });
      solarSystem.addStar(far);
    }
  } else {
    const classification = determineStarClassification({unusualChance: unusualChance});
    primary = new Star(classification, ORBIT_TYPES.PRIMARY);
    solarSystem.addPrimary(primary);

    let dm= additionalStarDM(primary);
    if (twoD6() + dm >= 10) {
      const classification = determineStarClassification({
        unusualChance: unusualChance,
        primary: primary,
        orbitType: ORBIT_TYPES.COMPANION
      });
      const star = new Star(classification, ORBIT_TYPES.COMPANION);
      star.orbit = d6() / 10 + (twoD6() - 7) / 100;
      star.period = calculatePeriod(star, primary);
      primary.companion = star;
    }

    if (twoD6() + dm >= 10) {
      close = generateCloseSecondary({star: primary, unusualChance: 0});
      if (twoD6() + companionDM(close) >= 10)
        addCompanion({star: close, unusualChance: unusualChance});
      solarSystem.addStar(close);
    }

    if (twoD6() + dm >= 10) {
      near = generateNearSecondary({star: primary, unusualChance: 0});
      if (twoD6() + companionDM(near) >= 10)
        addCompanion({star: near, unusualChance: unusualChance});
      solarSystem.addStar(near);
    }

    if (twoD6() + dm >= 10) {
      far = generateFarSecondary({star: primary, unusualChance: 0});
      if (twoD6() + companionDM(far) >= 10)
        addCompanion({star: far, unusualChance: unusualChance});
      solarSystem.addStar(far);
    }
  }
}

module.exports = loadStarsFromDefinition;
