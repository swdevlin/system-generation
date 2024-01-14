const {determineStarClassification} = require("../stars/determineStarClassification");
const Star = require("../stars/star");
const {ORBIT_TYPES, additionalStarDM, calculatePeriod} = require("../utils");
const {twoD6, d6} = require("../dice");
const generateCloseSecondary = require("../stars/generateCloseSecondary");
const addCompanion = require("../stars/addCompanion");
const generateNearSecondary = require("../stars/generateNearSecondary");
const generateFarSecondary = require("../stars/generateFarSecondary");
const companionDM = require("../stars/companionDM");

const assignStars = ({solarSystem, unusualChance}) => {
  const classification = determineStarClassification({unusualChance: unusualChance});
  const s = new Star(classification, ORBIT_TYPES.PRIMARY);
  solarSystem.addPrimary(s);

  let dm = additionalStarDM(primary);
  if (twoD6() + dm >= 10) {
    const classification = determineStarClassification({
      unusualChance: unusualChance,
      primary: solarSystem.primary,
      orbitType: ORBIT_TYPES.COMPANION
    });
    star = new Star(classification, ORBIT_TYPES.COMPANION);
    star.orbit = d6() / 10 + (twoD6() - 7) / 100;
    star.period = calculatePeriod(star, solarSystem.primary);
    solarSystem.primary.companion = star;
  }

  if (twoD6() + dm >= 10) {
    star = generateCloseSecondary({star: solarSystem.primary, unusualChance: 0});
    if (twoD6() + companionDM(star) >= 10)
      addCompanion({star: star, unusualChance: unusualChance});
    solarSystem.addStar(star);
  }

  if (twoD6() + dm >= 10) {
    star = generateNearSecondary({star: solarSystem.primary, unusualChance: 0});
    if (twoD6() + companionDM(star) >= 10)
      addCompanion({star: star, unusualChance: unusualChance});
    solarSystem.addStar(star);
  }

  if (twoD6() + dm >= 10) {
    star = generateFarSecondary({star: solarSystem.primary, unusualChance: 0});
    if (twoD6() + companionDM(star) >= 10)
      addCompanion({star: star, unusualChance: unusualChance});
    solarSystem.addStar(star);
  }

}

module.exports = assignStars;
