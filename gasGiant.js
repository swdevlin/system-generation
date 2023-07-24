class GasGiant {
  constructor(code, diameter, mass, orbit) {
    this.code = code;
    this.diameter = diameter;
    this.mass = mass;
    this.orbit = orbit;
    this.moons = [];
  }
}

module.exports = GasGiant;
