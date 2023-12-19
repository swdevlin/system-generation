const {ORBIT_TYPES} = require("../utils");
const biocomplexityDescription = require("../utils/biocomplexityDescription");

const refereeReference = (sector) => {
  const systems = ['Hex,Name,Scan Points,bio complexity,Native Sophont,Extinct Sophont,compatibility,resources,habitability'];

  for (const solarSystem of sector.solarSystems) {
    let biocomplexityCode = 0;
    let compatibilityRating = 0;
    let resourceRating = 0;
    let habitabilityRating = 0;
    let nativeSophont = false;
    let extinctSophont = false;

    for (const star of solarSystem.stars)
      for (const stellarObject of star.stellarObjects)
        if (stellarObject.orbitType === ORBIT_TYPES.TERRESTRIAL) {
          biocomplexityCode = Math.max(biocomplexityCode, stellarObject.biocomplexityCode);
          compatibilityRating = Math.max(compatibilityRating, stellarObject.compatibilityRating);
          resourceRating = Math.max(resourceRating, stellarObject.resourceRating);
          habitabilityRating = Math.max(habitabilityRating, stellarObject.habitabilityRating);
          nativeSophont |= stellarObject.nativeSophont;
          extinctSophont |= stellarObject.extinctSophont;
        }
    const values = [
      solarSystem.coordinates,
      solarSystem.name,
      solarSystem.calculateScanPoints(),
      biocomplexityDescription[biocomplexityCode],
      nativeSophont ? 'true' : 'false',
      extinctSophont ? 'true' : 'false',
      compatibilityRating,
      resourceRating,
      habitabilityRating
    ];
    systems.push(values.join(','));
  }

  return systems;
}

module.exports = refereeReference;
