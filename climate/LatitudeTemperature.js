const orbitToAU = require('../utils/orbitToAU');

const DEG = Math.PI / 180;

// page 115 - Temperature Scenario: Mean Temperature by Latitude
class LatitudeTemperature {
  static BASE_TEMPERATURE = 279;

  constructor(star, planet) {
    this.luminosity = LatitudeTemperature.starLuminosity(star);
    const stellarOrbit = planet.satelliteOrbit ? planet.parentOrbit : planet.orbit;
    this.au = orbitToAU(stellarOrbit);
    this.albedo = planet.albedo ?? 0;
    this.greenhouse = planet.greenhouse ?? 0;
    this.atmosphericFactor = 1 + (planet.atmosphere?.bar ?? 0);
    this.tilt = LatitudeTemperature.normaliseTilt(planet.axialTilt ?? 0);
    // Latitude below which the adjustment is constant: the tropical zone for tilts under 45°,
    // or the edge of the arctic zone (90° - tilt) for tilts of 45° or more.
    this.zoneBoundary = this.tilt < 45 ? this.tilt : 90 - this.tilt;
  }

  static starLuminosity(star) {
    if (typeof star.totalLuminosity === 'number') return star.totalLuminosity;
    if (typeof star.luminosity === 'number') return star.luminosity;
    // hzco = auToOrbit(sqrt(L))
    return orbitToAU(star.hzco) ** 2;
  }

  static normaliseTilt(tilt) {
    let t = Math.abs(tilt) % 360;
    if (t > 180) t = 360 - t;
    if (t > 90) t = 180 - t;
    return t;
  }

  adjustment(latitude) {
    const lat = Math.max(Math.abs(latitude), this.zoneBoundary);
    return Math.sin((45 - lat) * DEG);
  }

  luminosityModifier(latitude) {
    return this.adjustment(latitude) / this.atmosphericFactor;
  }

  // Constant part of the temperature equation: L(1-A)(1+G)/AU^2
  get irradiance() {
    return (this.luminosity * (1 - this.albedo) * (1 + this.greenhouse)) / this.au ** 2;
  }

  // page 111 - mean temperature (45° latitude), optionally at another distance (Near/Far AU)
  meanTemperature(au = this.au) {
    const irradiance = (this.luminosity * (1 - this.albedo) * (1 + this.greenhouse)) / au ** 2;
    return LatitudeTemperature.BASE_TEMPERATURE * irradiance ** 0.25;
  }

  // Page 111: tune greenhouse (or albedo, if greenhouse would go negative) so the mean matches tempK.
  // Returns { albedo, greenhouse } without modifying the planet.
  fitTo(tempK, vacuum = false) {
    const required = ((tempK / LatitudeTemperature.BASE_TEMPERATURE) ** 4 * this.au ** 2) / this.luminosity;
    if (!vacuum) {
      const greenhouse = required / (1 - this.albedo) - 1;
      if (greenhouse >= 0) return { albedo: this.albedo, greenhouse };
    }
    const albedo = Math.min(0.98, Math.max(0.02, 1 - required));
    return { albedo, greenhouse: 0 };
  }

  temperatureAt(latitude) {
    const latitudeLuminosity = 1 + this.luminosityModifier(latitude);
    return LatitudeTemperature.BASE_TEMPERATURE * (latitudeLuminosity * this.irradiance) ** 0.25;
  }

  // Returns the lowest latitude at or above which the temperature is <= tempK.
  // null: never that cold (even at the poles). 0: that cold everywhere.
  latitudeAtTemperature(tempK) {
    const ratio = (tempK / LatitudeTemperature.BASE_TEMPERATURE) ** 4 / this.irradiance;
    const target = this.atmosphericFactor * (ratio - 1);
    if (target < Math.sin(-45 * DEG)) return null;
    if (target >= Math.sin((45 - this.zoneBoundary) * DEG)) return 0;
    return 45 - Math.asin(target) / DEG;
  }

  table(step = 15) {
    const rows = [];
    for (let latitude = 0; latitude <= 90; latitude += step)
      rows.push({ latitude, temperature: Math.round(this.temperatureAt(latitude) * 10) / 10 });
    return rows;
  }
}

module.exports = LatitudeTemperature;
