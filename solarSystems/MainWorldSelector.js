'use strict';

const ORBIT_TYPES = {
  GAS_GIANT: 10,
  TERRESTRIAL: 11,
  PLANETOID_BELT: 12,
  PLANETOID_BELT_OBJECT: 13,
};

const VALID_CRITERIA = ['habitable', 'habitableAndResource', 'resource'];

class MainWorldSelector {
  constructor(system, criteria = 'habitable') {
    this.system = system;
    this.criteria = criteria;
  }

  select() {
    const candidates = this.collectCandidates();
    if (candidates.length === 0) return null;

    for (const c of candidates) c.score = this.score(c);

    candidates.sort((a, b) => this.compare(a, b));

    const winner = candidates[0];
    return {
      world: winner.world,
      path: winner.path,
      star: winner.star,
    };
  }

  collectCandidates() {
    const candidates = [];
    const primaryStar = this.system.primaryStar;
    if (primaryStar) {
      this.collectFromStar(primaryStar, 'primaryStar', candidates);
    }
    return candidates;
  }

  collectFromStar(star, starPath, candidates) {
    const stellarObjects = star.stellarObjects ?? [];

    for (let idx = 0; idx < stellarObjects.length; idx++) {
      const stellarObject = stellarObjects[idx];
      const objPath = `${starPath}.stellarObjects[${idx}]`;

      // A stellarObject that has its own stellarObjects array is a companion star — recurse into it
      if (Array.isArray(stellarObject.stellarObjects)) {
        this.collectFromStar(stellarObject, objPath, candidates);
        continue;
      }

      const { orbitType, hzcoDeviation } = stellarObject;
      const hzco = Math.abs(hzcoDeviation ?? 0);

      if (orbitType === ORBIT_TYPES.TERRESTRIAL) {
        candidates.push({
          world: stellarObject,
          star,
          isMoon: false,
          hzco,
          path: objPath,
          effectiveResourceRating: stellarObject.resourceRating ?? 0,
        });
      } else if (orbitType === ORBIT_TYPES.PLANETOID_BELT && this.criteria === 'resource') {
        const rr =
          typeof stellarObject.resourceRating === 'number'
            ? stellarObject.resourceRating
            : Math.max(
                0,
                ...(stellarObject.significantBodies ?? []).map((b) => b.resourceRating ?? 0)
              );
        candidates.push({
          world: stellarObject,
          star,
          isMoon: false,
          hzco,
          path: objPath,
          effectiveResourceRating: rr,
        });
      }

      // Check moons on any body type (gas giants, terrestrials, belts)
      const moons = stellarObject.moons ?? [];
      for (let moonIdx = 0; moonIdx < moons.length; moonIdx++) {
        const moon = moons[moonIdx];
        if (moon.size === 'S' || moon.size === 'R' || moon.size === 0) continue;
        if (moon.orbitType === ORBIT_TYPES.PLANETOID_BELT_OBJECT) continue;
        candidates.push({
          world: moon,
          star,
          isMoon: true,
          hzco: Math.abs(moon.hzcoDeviation ?? hzco),
          path: `${objPath}.moons[${moonIdx}]`,
          effectiveResourceRating: moon.resourceRating ?? 0,
        });
      }
    }
  }

  score(entry) {
    const hr = entry.world.habitabilityRating ?? 0;
    const rr = entry.effectiveResourceRating;
    switch (this.criteria) {
      case 'habitable':
        return hr;
      case 'habitableAndResource':
        return hr + rr;
      case 'resource':
        return rr;
      default:
        return hr;
    }
  }

  compare(a, b) {
    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) return scoreDiff;
    if (a.isMoon !== b.isMoon) return a.isMoon ? 1 : -1;
    return a.hzco - b.hzco;
  }
}

module.exports = { MainWorldSelector, VALID_CRITERIA };
