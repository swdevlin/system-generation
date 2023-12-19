const {twoD6} = require("../dice");

// page 130
const biodiversity = (planet) => {
  if (planet.biomassRating === 0)
    return 0;

  let dr = Math.ceil(twoD6()-7+(planet.biomassRating + planet.biocomplexityCode)/2);
  return Math.max(1, dr);
}

module.exports = biodiversity;
