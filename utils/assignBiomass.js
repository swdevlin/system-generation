const biomass = require("./biomass");
const biocomplexity = require("./biocomplexity");
const biodiversity = require("./biodiversity");
const compatibilityRating = require("./compatibilityRating");
const {nativeSophont, extinctSophont} = require("./sophonts");

const assignBiomass = (star, planet) => {
  planet.biomassRating = biomass(star, planet);
  planet.biocomplexityCode = biocomplexity(star, planet);
  planet.biodiversityRating = biodiversity(planet);
  planet.compatibilityRating = compatibilityRating(star, planet);
  planet.nativeSophont = nativeSophont(star, planet);
  planet.extinctSophont = extinctSophont(star, planet);
  if (planet.nativeSophont || planet.extinctSophont)
    console.log(`Sophont at ${planet.orbit}`);
}


module.exports = assignBiomass;
