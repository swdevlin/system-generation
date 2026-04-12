const { d2, d3, d6, twoD6 } = require('../dice');
const { isAgricultural, isNonAgricultural } = require('../economics/assignTradeCodes');

const urbanizationDMs = (planet) => {
  let dm = 0;

  const pcr = planet.population.concentrationRating;
  if (pcr <= 2) dm += -3 + pcr;
  else if (pcr >= 7) dm += -6 + pcr;

  if (planet.techLevel >= 0 && planet.techLevel <= 3) dm -= 1;

  if (planet.size === 0) dm += 2;

  if (planet.population.code === 8) dm += 1;
  else if (planet.population.code === 9) dm += 2;
  else if (planet.population.code >= 10) dm += 4;

  if (planet.government.code === 0) dm -= 2;

  if (planet.lawLevelCode >= 9) dm += 1;

  if (planet.techLevel <= 2) dm -= 2;
  else if (planet.techLevel === 3) dm -= 1;
  else if (planet.techLevel === 4) dm += 1;
  else if (planet.techLevel >= 5 && planet.techLevel <= 9) dm += 2;
  else if (planet.techLevel >= 10) dm += 1;

  if (isAgricultural(planet)) dm -= 2;
  if (isNonAgricultural(planet)) dm += 2;

  return dm;
};

const basePercentage = (roll) => {
  if (roll <= 0) return 0;
  if (roll === 1) return d6();
  if (roll === 2) return 6 + d6();
  if (roll === 3) return 12 + d6();
  if (roll === 4) return 18 + d6();
  if (roll === 5) return 22 + d6() * 2 + d2();
  if (roll === 6) return 34 + d6() * 2 + d2();
  if (roll === 7) return 46 + d6() * 2 + d2();
  if (roll === 8) return 58 + d6() * 2 + d2();
  if (roll === 9) return 70 + d6() * 2 + d2();
  if (roll === 10) return 84 + d6();
  if (roll === 11) return 90 + d6();
  if (roll === 12) return 96 + d3();
  return 100;
};

const assignUrbanizationPercentage = (planet) => {
  const roll = twoD6() + urbanizationDMs(planet);
  let result = basePercentage(roll);

  // Minimums
  if (planet.population.code === 9) result = Math.max(result, 18 + d6());
  else if (planet.population.code >= 10) result = Math.max(result, 50 + d6());

  // Maximums — collect all applicable, take most restrictive
  const maxValues = [];
  if (planet.techLevel <= 2) maxValues.push(20 + d6());
  else if (planet.techLevel === 3) maxValues.push(30 + d6());
  else if (planet.techLevel === 4) maxValues.push(60 + d6());
  else if (planet.techLevel >= 5 && planet.techLevel <= 9) maxValues.push(90 + d6());

  if (isAgricultural(planet)) maxValues.push(90 + d6());

  if (maxValues.length > 0) result = Math.min(result, Math.min(...maxValues));

  planet.population.urbanizationPercentage = result;
};

module.exports = { assignUrbanizationPercentage, urbanizationDMs };
