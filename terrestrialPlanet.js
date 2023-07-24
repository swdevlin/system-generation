class TerrestrialPlanet {
  constructor(size, mass, orbit) {
    this.size = size;
    this.mass = mass;
    this.orbit = orbit;
    this.moons = [];
  }

  get diameter() {
    if (this.size === 0)
      return 0;
    if (this.size === 'R')
      return 0;
    if (this.size === 'S')
      return 600;
    return this.size * 1600;
  }
}

module.exports = TerrestrialPlanet;
