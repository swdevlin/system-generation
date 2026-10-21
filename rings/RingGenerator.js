const { twoD6, threeD6 } = require('../dice');
const Ring = require('./ring');

const SURFACE_LIMIT = 0.55;

class RingGenerator {
  static rollCentreLocation() {
    return 0.4 + twoD6() / 8;
  }

  static rollSpan() {
    return threeD6() / 100 + 0.07;
  }

  static generate(count) {
    const rings = [];
    for (let i = 0; i < count; i++) {
      let centreLocation = this.rollCentreLocation();
      let span = this.rollSpan();
      const previous = rings[rings.length - 1];
      if (previous) {
        const previousOuterEdge = previous.centreLocation + previous.span / 2;
        if (centreLocation - span / 2 < previousOuterEdge) {
          centreLocation = previous.centreLocation + previous.span / 2 + span / 2;
        }
      }
      if (centreLocation - span / 2 < SURFACE_LIMIT) {
        span = 2 * (centreLocation - SURFACE_LIMIT);
      }
      rings.push(new Ring(centreLocation, span));
    }
    return rings;
  }
}

module.exports = RingGenerator;
