const LatitudeTemperature = require('./LatitudeTemperature');
const IceCapGenerator = require('./IceCapGenerator');
const SurfaceLiquidGenerator = require('../hydrographics/ExoticLiquidsGenerator');
const calculateAlbedo = require('../atmosphere/albedo');
const calculateGreenhouse = require('../atmosphere/calculateGreenhouse');

// Second temperature pass. The Basic Mean Temperature table (page 108) gives the estimate used to
// roll atmosphere and hydrographics; once those are final, albedo and greenhouse are computed and
// the temperature equation (page 111) sets the mean temperature everything else uses.
class ClimateGenerator {
  constructor(iceCapGenerator = new IceCapGenerator(), liquidGenerator = new SurfaceLiquidGenerator()) {
    this.iceCapGenerator = iceCapGenerator;
    this.liquidGenerator = liquidGenerator;
  }

  apply(star, planet) {
    if (planet.composition) planet.albedo = calculateAlbedo(star, planet);
    planet.greenhouse = calculateGreenhouse(planet);
    planet.estimatedTemperature = planet.meanTemperature;

    let temperature = new LatitudeTemperature(star, planet);
    if (planet.fromUWP && planet.estimatedTemperature) {
      // Worlds defined by UWP keep their table temperature: tune greenhouse (or albedo) to fit
      const fit = temperature.fitTo(planet.estimatedTemperature, !planet.atmosphere?.code);
      planet.albedo = fit.albedo;
      planet.greenhouse = fit.greenhouse;
      temperature = new LatitudeTemperature(star, planet);
    }

    planet.meanTemperature = Math.round(temperature.meanTemperature());
    this.liquidGenerator.reconcile(planet);

    planet.latitudeTemperatures = temperature.table();
    planet.iceCaps = this.iceCapGenerator.generate(star, planet, temperature);
  }

  // page 114 step 8: Near and Far AU from eccentricity
  applyPeriapsisApoapsis(star, planet) {
    const temperature = new LatitudeTemperature(star, planet);
    const eccentricity = planet.eccentricity || 0;
    planet.periapsisTemperature = Math.round(temperature.meanTemperature(temperature.au * (1 - eccentricity)));
    planet.apoapsisTemperature = Math.round(temperature.meanTemperature(temperature.au * (1 + eccentricity)));
  }
}

module.exports = ClimateGenerator;