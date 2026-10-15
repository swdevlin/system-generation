const { twoD6, randomInt } = require('../dice');
const SurfaceLiquidGenerator = require('../hydrographics/ExoticLiquidsGenerator');

// Code 0 covers 0-5%, code A covers 95-100%, codes 1-9 cover code*10 +/- 5%.
const hydrographicPercentage = (code) => {
  if (code === null || code === undefined) return 0;
  if (code <= 0) return randomInt(0, 5);
  if (code >= 10) return randomInt(95, 100);
  return randomInt(code * 10 - 5, code * 10 + 4);
};

const determineHydrographics = (star, planet) => {
  let hydrographics;
  if (planet.hydrographics.code === null) {
    hydrographics = {
      code: 0,
      percentage: 0,
      distribution: 0,
      liquid: '',
    };

    if (planet.size < 2) return hydrographics;
    let roll = twoD6() - 7;
    roll += planet.atmosphere.code;
    if (
      planet.atmosphere.code === 0 ||
      planet.atmosphere.code === 1 ||
      planet.atmosphere.code >= 10
    )
      roll -= 4;
    hydrographics.code = Math.max(Math.min(10, roll), 0);
    // Panthalassic and Steam unusual atmospheres require a minimum hydrographics
    if (planet.atmosphere.minHydrographics)
      hydrographics.code = Math.max(hydrographics.code, planet.atmosphere.minHydrographics);
    hydrographics.percentage = hydrographicPercentage(hydrographics.code);
  } else {
    hydrographics = planet.hydrographics;
    hydrographics.percentage ??= hydrographicPercentage(hydrographics.code);
  }

  if (hydrographics.code !== 0) hydrographics.distribution = twoD6() - 2;

  const generator = new SurfaceLiquidGenerator();
  hydrographics.liquid = generator.getLiquid(planet);

  return hydrographics;
};

module.exports = determineHydrographics;
module.exports.hydrographicPercentage = hydrographicPercentage;