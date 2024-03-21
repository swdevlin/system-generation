class StellarObject {
  constructor() {
    this.orbitPosition = {x: 0, y: 0};
    this.inclination = 0;
    this.eccentricity = 0;
    this.effectiveHZCODeviation = 0;
  }

  setOrbit(star, orbitNumber) {
    this.orbit = orbitNumber;
    if (star.hzco < 1 || orbitNumber < 1)
      this.effectiveHZCODeviation = (star.hzco - orbitNumber) / Math.min(star.hzco, orbitNumber);
    else
      this.effectiveHZCODeviation = star.hzco - orbitNumber;
  }

}

module.exports = StellarObject;
