const {SOL_DIAMETER, AU, orbitToAU} = require("../utils");
const travelTime = require("../utils/travelTime");

class StellarObject {
  constructor() {
    this.orbitPosition = {x: 0, y: 0};
    this.inclination = 0;
    this.eccentricity = 0;
    this.effectiveHZCODeviation = 0;
    this.orbit = 0;
    this.buildLog = [];
    this.fromUWP = false;
    this.hzcoDeviation = 0;
  }

  setOrbit(star, orbitNumber) {
    this.orbit = orbitNumber;
    if (star.hzco < 1 || orbitNumber < 1)
      this.effectiveHZCODeviation = (orbitNumber - star.hzco) / Math.min(star.hzco, orbitNumber);
    else
      this.effectiveHZCODeviation = orbitNumber - star.hzco;
    this.hzcoDeviation = orbitNumber - star.hzco;
  }

  get jumpShadow() {
    return 100 * this.diameter;
  }

  safeJumpTime(mDrive) {
    if (this.diameter)
      return travelTime(this.diameter, mDrive, true);
    else
      return '0m';
  }

  get au() {
    return orbitToAU(this.orbit);
  }
}

module.exports = StellarObject;
