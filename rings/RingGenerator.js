const { twoD6, threeD6 } = require('../dice');
const Ring = require('./ring');

const SURFACE_LIMIT = 0.55;

class RingGenerator {
  static rollOrbit() {
    return 0.4 + twoD6() / 8;
  }

  static rollSpan() {
    return threeD6() / 100 + 0.07;
  }

  static generate(count) {
    const rings = [];
    for (let i = 0; i < count; i++) {
      let orbit = this.rollOrbit();
      let span = this.rollSpan();
      const previous = rings[rings.length - 1];
      if (previous) {
        const previousOuterEdge = previous.orbit + previous.span / 2;
        if (orbit - span / 2 < previousOuterEdge) {
          orbit = previous.orbit + previous.span / 2 + span / 2;
        }
      }
      if (orbit - span / 2 < SURFACE_LIMIT) {
        span = 2 * (orbit - SURFACE_LIMIT);
      }
      rings.push(new Ring(orbit, span));
    }
    return rings;
  }
}

module.exports = RingGenerator;
