const {
  ORBIT_TYPES,
  shuffleArray,
  SOL_DIAMETER,
  eccentricity,
  determineHydrographics,
  meanTemperature, axialTilt, calculateAlbedo, orbitPosition, AU, calculateDistance, travelTime,
  romanNumeral
} = require("../utils");
const {threeD6, twoD6, d4, d6, d10, d8} = require("../dice");
const {GasGiant, gasGiantQuantity} = require("../gasGiants");
const {
  PlanetoidBelt,
  determineBeltComposition,
  determineBeltBulk,
  determineBeltResourceRating,
  addSignificantBodies, planetoidBeltQuantity
} = require("../planetoidBelts");
const {
  terrestrialWorldSize,
  TerrestrialPlanet,
  terrestrialComposition,
  terrestrialDensity, terrestrialPlanetQuantity, superEarthWorldSize
} = require("../terrestrialPlanets");
const {assignMoons} = require("../moons");
const {Star, addCompanion} = require("../stars");
const {determineMoonAtmosphere} = require("../atmosphere");

const Random = require("random-js").Random;
const r = new Random();

class SolarSystem {
  constructor(name) {
    this.stars = [];
    this.gasGiants = 0;
    this.planetoidBelts = 0;
    this.terrestrialPlanets = 0;
    this.sector = null;
    this.coordinates = null;
    this.remainingOrbits = [];
    this.name = name ? name : '';
    this.scanPoints = 0;
    this._mainWorld = null;
    this.bases = '';
  }

  calculateScanPoints() {
    if (this.scanPoints == 0) {
      this.scanPoints = d4() + d4();
      switch (this.stars.length) {
        case 1: break;
        case 2:
        case 3:
          this.scanPoints += 1;
          break;
        case 4:
        case 5:
          this.scanPoints += 2;
          break;
        default: this.scanPoints += 3;
      }
    }
    return this.scanPoints;
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
      if (primary.companion)
        minOrbit = Math.max(minOrbit, 0.5 + primary.companion.eccentricity)

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
      if (star)
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

  addTerrestrialPlanet({star, orbitIndex, orbit, size, uwp}) {
    if (!size)
      size = terrestrialWorldSize();
    if (orbitIndex !== undefined)
      orbit = star.occupiedOrbits[orbitIndex];
    const p = new TerrestrialPlanet(size, orbit, uwp);
    p.composition = terrestrialComposition(star, p);
    p.density = terrestrialDensity(p.composition);
    p.eccentricity = eccentricity(0);
    p.axialTilt = axialTilt();
    p.albedo = calculateAlbedo(p);
    star.addStellarObject(p);
    return p;
  };

  addGasGiant({star, orbitIndex, size}) {
    if (!size) {
      let roll= r.integer(1,6);
      if (star.spread < 0.1)
        roll -= 1;
      if (this.primaryStar.stellarType ==='M' && this.primaryStar.stellarClass === 'V')
        roll -= 1;
      else if (this.primaryStar.stellarClass === 'VI')
        roll -= 1;
      else if (['L', 'T', 'Y'].includes(this.primaryStar.stellarType))
        roll -= 1;
      if (roll <= 2)
        size = 'GS';
      else if (roll <= 5)
        size = 'GM';
      else
        size = 'GL';
    }
    let gg;
    if (size === 'GS')
      gg = new GasGiant(size, SOL_DIAMETER * (r.die(3) + r.die(3)), r.integer(2,7) * 5);
    else if (size === 'GM')
      gg = new GasGiant(size, SOL_DIAMETER * (d6() + 6), 20*(threeD6()-1));
    else
      gg = new GasGiant(size, SOL_DIAMETER * (twoD6()+6), r.die(3)*50*(threeD6()+4));
    if (gg.mass >= 3000)
      gg.mass = 4000-200*(twoD6()-2);
    gg.orbit = star.occupiedOrbits[orbitIndex];
    gg.eccentricity = eccentricity(0);
    gg.axialTilt = axialTilt();
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
      if (p === undefined)
        console.log('not enough orbits');
      else
        this.addGasGiant({star: p[0], orbitIndex: p[1]});
    }

    for (let i=0; i < this.planetoidBelts; i++) {
      const p = allOrbits.pop();
      if (p === undefined)
        console.log('not enough orbits');
      else
        this.addPlanetoidBelt(p[0], p[1]);
    }

    for (let i=0; i < this.terrestrialPlanets; i++) {
      const p = allOrbits.pop();
      if (p === undefined)
        console.log('not enough orbits');
      else
        this.addTerrestrialPlanet({star: p[0], orbitIndex: p[1]});
    }

    this.remainingOrbits = allOrbits;
  }

  addMoons() {
    for (const star of this.stars)
      assignMoons(star);
  }

  assignAtmospheres() {
    for (const star of this.stars)
      for (const stellarObject of star.stellarObjects)
        if ([ORBIT_TYPES.TERRESTRIAL, ORBIT_TYPES.PLANETOID_BELT_OBJECT].includes(stellarObject.orbitType)) {
          if (stellarObject.atmosphere.code === null)
            stellarObject.atmosphere = determineAtmosphere(star, stellarObject);
          stellarObject.meanTemperature = meanTemperature(star, stellarObject);
          if (stellarObject.hydrographics.code === null)
            stellarObject.hydrographics = determineHydrographics(star, stellarObject);
          for (const moon of stellarObject.moons)
            moon.atmosphere = determineMoonAtmosphere(star, stellarObject, moon);
        }
  }

  randomStar() {
    const i = r.integer(0, this.stars.length-1);
    return this.stars[i];
  }

  randomStarAndOrbit() {
    let star;
    let orbit;
    do {
      star = this.randomStar();
      orbit = twoD6() - 2 + d10()/10;
    } while (!star.orbitValid(orbit));
    return [star, orbit];
  }

  randomPlanet() {
    const planets = [];
    for (const star of this.stars)
      for (const object of star.stellarObjects)
        if (object.constructor.name !== 'PlanetoidBelt')
          planets.push([star, object]);
    return r.pick(planets);
  }

  addAnomalousPlanets() {
    let planets = twoD6() - 9;
    let star;
    let orbit;
    let original;
    while (planets > 0) {
      [star, orbit] = this.randomStarAndOrbit();
      const roll = twoD6();
      if (roll < 12) {
        const p = this.addTerrestrialPlanet({star: star, orbit: orbit});
        if (roll === 8)
          p.eccentricity = eccentricity(5);
        else
          p.eccentricity = eccentricity(2);

        if (roll === 9)
          p.inclination = d6()+2*10 + d10();

        if ([10, 11].includes(roll))
          p.retrograde = true;
      } else {
        [star, original] = this.randomPlanet();
        const p = this.addTerrestrialPlanet({star: star, orbit: original.orbit});
        const trojan = p.diameter > original.diameter ? original : p;
        trojan.trojanOffset = r.pick([-1, 1]) * 60;
      }
      planets--;
    }
  }

  countObjects(star) {
    let total = star.stellarObjects.length;
    for (const obj of star.stellarObjects)
      if (obj instanceof Star)
        total += this.countObjects(obj);
    return total;
  }

  addLocations(star, locations) {
    for (const obj of star.stellarObjects) {
      locations.push(orbitPosition(obj, star.y));
      if (obj instanceof Star) {
        obj.y = locations[locations.length-1].y;
        this.addLocations(obj, locations);
      }
    }
  }

  travelGrid() {
    let totalObjects = this.countObjects(this.primaryStar);
    const distances = new Array(totalObjects);
    for (let i=0; i < totalObjects; i++)
      distances[i] = new Array(totalObjects);

    const locations = [];
    this.addLocations(this.primaryStar, locations);

    for (let i= 0; i < totalObjects; i++)
      for (let j= 0; j < totalObjects; j++) {
        if (i===j)
          distances[i][j] = {
            distance: 0
          };
        else
          distances[i][j] = {
            distance: calculateDistance(locations[i].x, locations[i].y, locations[j].x, locations[i].y)
          };
      }
    let grid = '<table><thead><tr><th></th>';
    for (const i in locations) {
      const obj = locations[i].stellarObject;
      if ((obj.constructor.name !== 'TerrestrialPlanet' || obj.size !== 'S') && !(obj instanceof Star))
        grid += `<th>${obj.orbitSequence}</th>`;
    }
    grid += '</tr></thead><tbody>';
    for (let i=0; i < totalObjects; i++) {
      const obj = locations[i].stellarObject;
      if ((obj.constructor.name !== 'TerrestrialPlanet' || obj.size !== 'S') && !(obj instanceof Star)) {
        grid += `<tr><th>${obj.orbitSequence}</th>`;
        for (let j=0; j < totalObjects; j++) {
          const target = locations[j].stellarObject;
          if ((target.constructor.name !== 'TerrestrialPlanet' || target.size !== 'S') && !(target instanceof Star)) {
            grid += '<td>';
            if (distances[i][j].distance !== 0)
              grid += travelTime(distances[i][j].distance, 4);
            grid += '</td>';
          }
        }
        grid += '</tr>';
      }
    }
    grid += '</tbody></table>';
    return grid;
  }

  preassignedBody({star, body, orbitIndex}) {
    if (body.uwp.includes('000000')) {
      this.addPlanetoidBelt(star, orbitIndex);
      this.planetoidBelts++;
    } else if (body.uwp === 'Small Gas Giant') {
      this.gasGiants++;
      this.addGasGiant({star: star, orbitIndex: orbitIndex, size: 'GS'});
    } else if (body.uwp === 'Gas Giant') {
      this.gasGiants++;
      this.addGasGiant({star: star, orbitIndex: orbitIndex, size: 'GM'});
    } else if (body.uwp === 'Large Gas Giant') {
      this.gasGiants++;
      this.addGasGiant({star: star, orbitIndex: orbitIndex, size: 'GL'});
    } else if (body.uwp === 'Super-Earth') {
      this.addTerrestrialPlanet({
        star: star,
        orbitIndex: orbitIndex,
        uwp: body.uwp,
        size: superEarthWorldSize()
      });
      this.terrestrialPlanets++;
    } else {
      this.addTerrestrialPlanet({star: star, orbitIndex: orbitIndex, uwp: body.uwp});
      this.terrestrialPlanets++;
    }
  }

  getPossibleMainWorlds(star, possibleMainWorlds) {
    for (const stellarObject of star.stellarObjects)
      if (stellarObject instanceof Star)
        this.getPossibleMainWorlds(stellarObject, possibleMainWorlds);
      else if (!(stellarObject instanceof GasGiant))
        possibleMainWorlds.push([Math.abs(star.hzco - stellarObject.orbit), stellarObject])
  }

  get mainWorld() {
    if (this._mainWorld)
      return this._mainWorld;
    const possibleMainWorlds = [];
    for (const star of this.stars)
      this.getPossibleMainWorlds(star, possibleMainWorlds)
    possibleMainWorlds.sort((a,b) => {
      if (Math.abs(a[0] - b[0]) > 0.1)
        return a[0] - b[0];

      return b[1].populationCode - a[1].populationCode;
    });
    this._mainWorld = possibleMainWorlds[0][1];
    return this._mainWorld;
  }
}

module.exports = SolarSystem;
