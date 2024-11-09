const {twoD6, percentageChance} = require("../dice");

const nativeSophont = (star, planet) => {
  if (planet.biocomplexityCode < 7)
    return false;
  let r= twoD6() + Math.min(planet.biocomplexityCode, 9) - 7;
  const found = r >= 13;
  const chance = parseFloat(process.env.nativeSophontChance);
  return found && percentageChance(chance);
}

const extinctSophont = (star, planet) => {
  if (planet.biocomplexityCode < 7)
    return false;
  let r= twoD6() + Math.min(planet.biocomplexityCode, 9) - 7;
  if (star.age > 5)
    r++;
  const found = r >= 13;
  const chance = parseFloat(process.env.extinctSophontChance);
  return found && percentageChance(chance);
}

module.exports = {
  nativeSophont: nativeSophont,
  extinctSophont: extinctSophont,
}
