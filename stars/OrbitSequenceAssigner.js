const { sequenceIdentifier, ORBIT_TYPES } = require('../utils');
const Star = require('./star');

class OrbitSequenceAssigner {
  constructor(starSystem) {
    this.starSystem = starSystem;
    this.letterIndex = 0;
  }

  assign() {
    const primary = this.starSystem.primaryStar;
    if (!primary) return;
    this.assignStar(primary, '');
    this.assignPlanetoidObjects(primary);
  }

  nextLetter() {
    this.letterIndex += 1;
    return String.fromCharCode(64 + this.letterIndex);
  }

  assignStar(star, orbitingPrefix) {
    const letter = this.nextLetter();
    star.orbitSequence = letter;

    if (star.companion) {
      star.companion.orbitSequence = letter + 'b';
    }

    let orbiting = orbitingPrefix + letter;
    let index = 0;

    for (const body of this.nonCompanionBodies(star)) {
      if (body instanceof Star) {
        const childLetter = this.assignStar(body, '');
        orbiting += childLetter;
      } else if (body.orbitType !== ORBIT_TYPES.PLANETOID_BELT_OBJECT) {
        index++;
        const prefix = star.companion && orbiting.length === 1 ? orbiting + 'ab' : orbiting;
        body.orbitSequence = sequenceIdentifier(prefix, index);
      }
    }

    return letter;
  }

  assignPlanetoidObjects(star) {
    const beltCounters = new Map();

    for (const body of star.stellarObjects) {
      if (body instanceof Star) {
        this.assignPlanetoidObjects(body);
        continue;
      }
      if (body.orbitType !== ORBIT_TYPES.PLANETOID_BELT_OBJECT) continue;

      const belt = body.belt;
      const count = (beltCounters.get(belt) ?? 0) + 1;
      beltCounters.set(belt, count);
      body.orbitSequence = `${belt.orbitSequence}.${count}`;
    }
  }

  nonCompanionBodies(star) {
    return star.stellarObjects;
  }
}

module.exports = OrbitSequenceAssigner;
