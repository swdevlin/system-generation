const {twoD6} = require("../dice");

const nativeSophont = (star, planet) => {
  if (planet.biocomplexityCode < 7)
    return false;
  const rating = Math.min(0, planet.biocomplexityCode);
  let r= twoD6() + rating - 7 + parseInt(process.env.sophontDM);
  return r >= 13;
}

const extinctSophont = (star, planet) => {
  if (planet.biocomplexityCode < 7)
    return false;
  const rating = Math.min(0, planet.biocomplexityCode);
  let r= twoD6() + rating - 7 + parseInt(process.env.sophontDM);
  if (star.age > 5)
    r++;
  return r >= 13;
}

module.exports = {
  nativeSophont: nativeSophont,
  extinctSophont: extinctSophont,
}
