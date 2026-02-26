const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');

class Moon extends TerrestrialPlanet {
  constructor(size) {
    super(size, null);
    this.satelliteOrbit = null;  // {zone, orbit} — orbit around parent body
    this.period = null;          // orbital period in days (negative = retrograde)
  }
}

module.exports = Moon;
