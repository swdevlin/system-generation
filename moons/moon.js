const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');

class Moon extends TerrestrialPlanet {
  constructor(size, uwp) {
    super(size, null, uwp);
    this.satelliteOrbit = null;  // {zone, orbit} — orbit around parent body
    this.period = null;          // orbital period in days (negative = retrograde)
  }
}

module.exports = Moon;
