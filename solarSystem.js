const {ORBIT_TYPES, shuffleArray} = require("./utils");
const {threeD6, twoD6} = require("./dice");
const GasGiant = require("./gasGiant");
const PlanetoidBelt = require("./planetoidBelt");
const TerrestrialPlanet = require("./terrestrialPlanet");
const terrestrialWorldSize = require("./terrestrialWorldSize");
const {terrestrialComposition, terrestrialDensity} = require("./terrestrialComposition");
const {determineBeltComposition, determineBeltBulk, determineBeltResourceRating, addSignificantBodies} = require("./planetoidBelts");
const Random = require("random-js").Random;
const r = new Random();

class SolarSystem {
  constructor() {
    this.stars = [];
    this.gasGiants = 0;
    this.planetoidBelts = 0;
    this.terrestrialPlanets = 0;
    this.sector = null;
    this.coordinates = null;
  }

  get totalObjects() {
    return this.gasGiants + this.planetoidBelts + this.terrestrialPlanets;
  }

  addPrimary(star) {
    if (this.stars.length === 0)
      this.stars.push(star);
    else
      this.stars[0] = star;
  }

  addStar(star) {
    this.stars.push(star);
    this.primaryStar.addStellarObject(star);
  }

  get primaryStar() {
    return this.stars[0];
  }

  get starCount() {
    let count = 0;
    for (const star in this.stars) {
      count++;
      if (star.companion)
        count++
    }
    return count;
  }

  determineAvailableOrbits() {
    let maxOrbit;
    let minOrbit;
    let luminosity;
    const primary = this.primaryStar;
    if (primary.stellarType !== 'D') {
      minOrbit = primary.minimumAllowableOrbit;
      luminosity = primary.luminosity;
      if (primary.companion) {
        minOrbit = Math.max(minOrbit, 0.5 + primary.companion.eccentricity)
        luminosity += primary.companion.luminosity;
      }

      primary.availableOrbits = [];
      if (this.stars.length > 1)
        for (let i=1; i < this.stars.length; i++) {
          const star = this.stars[i];
          let eccMod = star.eccentricity > 0.2 ? 1 : 0;
          if ((star.orbitType === ORBIT_TYPES.NEAR || star.orbitType === ORBIT_TYPES.CLOSE ) && star.eccentricity > 0.5)
            eccMod++;
          maxOrbit = star.orbit - 1.0 - eccMod;
          if (maxOrbit < minOrbit)
            minOrbit = star.orbit + 1.0 + eccMod;
          else {
            primary.availableOrbits.push([minOrbit, maxOrbit]);
            minOrbit = star.orbit + 1.0 + eccMod;
          }
        }

      primary.availableOrbits.push([minOrbit, 20]);
    }

    for (let i=1; i < this.stars.length; i++) {
      const star = this.stars[i];
      if (star.stellarType === 'D')
        continue;
      let minOrbit = star.minimumAllowableOrbit;
      if (star.companion)
        minOrbit = Math.max(minOrbit, 0.5+star.companion.eccentricity)

      maxOrbit = star.orbit - 3.0;
      if (i < this.stars.length-1 && this.stars[i+1].orbitType - star.orbitType === 1)
        maxOrbit -= 1;
      else if (i > 0 && star.orbitType - this.stars[i-1].orbitType === 1)
        maxOrbit -= 1;

      if (maxOrbit > minOrbit)
        star.availableOrbits.push([minOrbit, maxOrbit]);
    }

  }

  get totalOrbits() {
    let totalOrbits = 0;
    for (const star of this.stars)
      totalOrbits += star.totalOrbits;
    return totalOrbits;
  }

  pickStar() {
    let roll = r.integer(1, this.totalOrbits);
    for (const star of this.stars) {
      roll -= star.totalOrbits;
      if (roll <= 0)
        return star;
    }
    return null;
  }

  distributeObjects() {
    for (let i=0; i < this.totalObjects; i++) {
      const star = this.pickStar();
      star.totalObjects++;
    }
  }

  addPlanetoidBelt(star, orbit_index) {
    const pb = new PlanetoidBelt();
    pb.orbit = star.occupiedOrbits[orbit_index];
    pb.span = star.spread * twoD6()/10;
    determineBeltComposition(star, pb);
    determineBeltBulk(star, pb);
    determineBeltResourceRating(star, pb);
    addSignificantBodies(star, pb);
    star.addStellarObject(pb);
  };

  addTerrestrialPlanet(star, orbit_index) {
    const size = terrestrialWorldSize();
    const orbit = star.occupiedOrbits[orbit_index];
    const p = new TerrestrialPlanet(size, orbit);
    p.composition = terrestrialComposition(star, p);
    p.density = terrestrialDensity(p.composition);
    star.addStellarObject(p);
  };

  addGasGiant(star, orbit_index) {
    let roll= r.integer(1,6);
    if (star.spread < 0.1)
      roll -= 1;
    if (this.primaryStar.stellarType ==='M' && this.primaryStar.stellarClass === 'V')
      roll -= 1;
    else if (this.primaryStar.stellarClass === 'VI')
      roll -= 1;
    else if (['L', 'T', 'Y'].includes(this.primaryStar.stellarType))
      roll -= 1;
    let gg;
    if (roll <= 2)
      gg = new GasGiant('GS', r.die(3) + r.die(3), r.integer(2,7) * 5);
    else if (roll < 5)
      gg = new GasGiant('GM', r.die(6) + 6, 20*(threeD6()-1));
    else
      gg = new GasGiant('GL', twoD6()+6, r.die(3)*50*(threeD6()+4));
    if (gg.mass >= 3000)
      gg.mass = 4000-200*(twoD6()-2);
    gg.orbit = star.occupiedOrbits[orbit_index];
    star.addStellarObject(gg);
  };

  assignOrbits() {
    for (const star of this.stars)
      star.assignOrbits();

    let allOrbits = [];
    for (const star of this.stars) {
      let starOrbits = [...Array(star.occupiedOrbits.length).keys()].map(x => [star, x]);
      shuffleArray(starOrbits);
      for (let i=0; i < star.emptyOrbits; i++)
        starOrbits.pop();
      allOrbits = allOrbits.concat(starOrbits);
    }
    shuffleArray(allOrbits);

    for (let i=0; i < this.gasGiants; i++) {
      const p = allOrbits.pop();
      this.addGasGiant(p[0], p[1]);
    }

    for (let i=0; i < this.planetoidBelts; i++) {
      const p = allOrbits.pop();
      this.addPlanetoidBelt(p[0], p[1]);
    }

    for (let i=0; i < this.terrestrialPlanets; i++) {
      const p = allOrbits.pop();
      if (p === undefined)
        console.log('not enough orbits');
      this.addTerrestrialPlanet(p[0], p[1]);
    }

  }

}

module.exports = SolarSystem;
