const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { AU } = require('../utils');

class Moon extends TerrestrialPlanet {
  constructor(size, uwp) {
    super(size, null, uwp);
    this.satelliteOrbit = null;  // {zone, orbit} — orbit around parent body
    this.period = null;          // orbital period in days (negative = retrograde)
    this.parentDiameter = null;  // diameter (km) of the body this moon orbits
  }

  get au() {
    return (this.orbit * this.parentDiameter) / AU;
  }
}

module.exports = Moon;
