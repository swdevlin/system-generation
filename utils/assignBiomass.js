const biomass = require("./biomass");
const biocomplexity = require("./biocomplexity");
const biodiversity = require("./biodiversity");
const compatibilityRating = require("./compatibilityRating");
const {nativeSophont, extinctSophont} = require("./sophonts");

const assignBiomass = (star, planet, sophontCheck = 'standard') => {
  planet.biomassRating = biomass(star, planet);
  let biocomplexityDM = 0;
  if (sophontCheck === 'rareEarth') biocomplexityDM = -2;
  else if (sophontCheck === 'veryRareEarth') biocomplexityDM = -3;
  planet.biocomplexityCode = biocomplexity(star, planet, biocomplexityDM);
  planet.biodiversityRating = biodiversity(planet);
  planet.compatibilityRating = compatibilityRating(star, planet);
  if (sophontCheck === 'none') {
    planet.nativeSophont = false;
    planet.extinctSophont = false;
  } else {
    planet.nativeSophont = nativeSophont(star, planet);
    planet.extinctSophont = extinctSophont(star, planet);
  }
}


module.exports = assignBiomass;
