const {twoD6} = require("../dice");

const nativeSophont = (star, planet) => {
  if (planet.biocomplexityCode < 7)
    return false;
  let r= twoD6() + Math.min(planet.biocomplexityCode, 9) - 7 + parseInt(process.env.sophontDM);
  return r >= 13;
}

const extinctSophont = (star, planet) => {
  if (planet.biocomplexityCode < 7)
    return false;
  let r= twoD6() + Math.min(planet.biocomplexityCode, 9) - 7 + parseInt(process.env.sophontDM);
  if (star.age > 5)
    r++;
  return r >= 13;
}

module.exports = {
  nativeSophont: nativeSophont,
  extinctSophont: extinctSophont,
}
