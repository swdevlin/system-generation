const {SOL_DIAMETER, AU} = require("../utils");
const travelTime = require("../utils/travelTime");

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

  get jumpShadow() {
    return 100 * this.diameter;
  }

  safeJumpTime(mDrive) {
    return travelTime(this.diameter, mDrive, true);
  }
}

module.exports = StellarObject;
