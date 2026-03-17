const biomass = require("./biomass");
const biocomplexity = require("./biocomplexity");
const biodiversity = require("./biodiversity");
const compatibilityRating = require("./compatibilityRating");
const {nativeSophont, extinctSophont} = require("./sophonts");

const assignBiomass = (star, planet, sophontCheck = 'standard') => {
  planet.biomassRating = biomass(star, planet);
  planet.biocomplexityCode = biocomplexity(star, planet, sophontCheck === 'rareEarth' ? -2 : 0);
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
