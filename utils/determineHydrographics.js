const { twoD6 } = require('../dice');
const SurfaceLiquidGenerator = require('../hydrographics/ExoticLiquidsGenerator');

const determineHydrographics = (star, planet) => {
  let hydrographics;
  if (planet.hydrographics.code === null) {
    hydrographics = {
      code: 0,
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
  } else hydrographics = planet.hydrographics;

  if (hydrographics.code !== 0) hydrographics.distribution = twoD6() - 2;

  const generator = new SurfaceLiquidGenerator();
  hydrographics.liquid = generator.getLiquid(planet);

  return hydrographics;
};

module.exports = determineHydrographics;
