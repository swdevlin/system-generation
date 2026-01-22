const {
  ORBIT_TYPES,
  shuffleArray,
  SOL_DIAMETER,
  eccentricity,
  determineHydrographics,
  meanTemperature, axialTilt, orbitPosition, calculateDistance, travelTime, STELLAR_TYPES, AU, isBrownDwarf,
  auToOrbit,
  orbitText,
  starIdentifier,
} = require("../utils");
const {threeD6, twoD6, d4, d6, d10} = require("../dice");
const {GasGiant} = require("../gasGiants");
const {
  PlanetoidBelt,
  determineBeltComposition,
  determineBeltBulk,
  determineBeltResourceRating,
  addSignificantBodies
} = require("../planetoidBelts");
const Star = require("../stars/star");
const biomass = require("../utils/assignBiomass");
const resourceRating = require("../utils/resourceRating");
const habitabilityRating = require("../utils/habitabilityRating");
const {starColour} = require("../utils/starColours");
const assignAtmosphere = require("../atmosphere/assignAtmosphere");
const assignMoonAtmosphere = require("../atmosphere/assignMoonAtmosphere");
const assignMoons = require("../moons/assignMoons");
const terrestrialWorldSize = require("../terrestrialPlanet/terrestrialWorldSize");
const TerrestrialPlanet = require("../terrestrialPlanet/terrestrialPlanet");
const superEarthWorldSize = require("../terrestrialPlanet/superEarthWorldSize");
const assignPhysicalCharacteristics = require("../terrestrialPlanet/assignPhysicalCharacteristics");
const assignSocialCharacteristics = require("../terrestrialPlanet/assignSocialCharacteristics");
const summaryBlock = require("../stars/summaryBlock");
const {determineStarport} = require("../terrestrialPlanet/assignStarport");
const {techLevelDMs} = require("../terrestrialPlanet/assignTechLevel");

const Random = require("random-js").Random;
const r = new Random();

const determineAllegiance = (sector, subsector) => {
  if (subsector.allegiance !== undefined)
    return subsector.allegiance;
  else
    return sector.allegiance === undefined ? null: sector.allegiance;
}

const determineSocialLimits = (sector, subsector) => {
  const limits = {
    minTechLevel: 0,
    maxTechLevel: 15,
    minPopulationCode: 0,
    maxPopulationCode: 15
  };

  if (subsector.minTechLevel !== undefined)
    limits.minTechLevel = subsector.minTechLevel;
  else if (sector.minTechLevel !== undefined)
    limits.minTechLevel = sector.minTechLevel;

  if (subsector.maxTechLevel !== undefined)
    limits.maxTechLevel = subsector.maxTechLevel;
  else if (sector.maxTechLevel !== undefined)
    limits.maxTechLevel = sector.maxTechLevel;

  if (subsector.minPopulationCode !== undefined)
    limits.minPopulationCode = subsector.minPopulationCode;
  else if (sector.minPopulationCode !== undefined)
    limits.minPopulationCode = sector.minPopulationCode;

  if (subsector.maxPopulationCode !== undefined)
    limits.maxPopulationCode = subsector.maxPopulationCode;
  else if (sector.maxPopulationCode !== undefined)
    limits.maxPopulationCode = sector.maxPopulationCode;

  return limits;
}

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
    this.remarks = '';
    this.surveyIndex = 0;
    this.allegiance = null;
  }

  get x() {
    if (!this.coordinates) return null;
    return parseInt(this.coordinates.substring(0, 2), 10)
  }

  get y() {
    if (!this.coordinates) return null;
    return parseInt(this.coordinates.substring(2, 4), 10)
  }

  onlyBrownDwarfs() {
    return isBrownDwarf(this.primaryStar.stellarType);
  }

  calculateScanPoints() {
    if (this.scanPoints === 0)
      this.scanPoints = d6() + d6();

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
    if (star.isAnomaly && !isBrownDwarf(star.stellarType) && star.stellarType !== STELLAR_TYPES.WhiteDwarf)
      this.remarks = '{Anomaly}';
  }

  get primaryStar() {
    return this.stars[0];
  }

  starString(star) {
    if (star.isAnomaly)
      return star.stellarType;
    else
      return `${star.stellarType}${star.subtype} ${star.stellarClass}`;
  }

  starsString() {
    let s = [];
    for (const star of this.stars) {
      let t = this.starString(star);
      if (star.companion)
        t += ` (${this.starString(star.companion)})`;
      s.push(t);
    }
    return s.join(', ');
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
    if (isNaN(this.totalOrbits))
      return null;

    try {
      let roll = r.integer(1, this.totalOrbits);
      for (const star of this.stars) {
        roll -= star.totalOrbits;
        if (roll <= 0)
          return star;
      }
      return null;
    } catch (e) {
      console.log(e);
      console.log(this.totalOrbits);
      console.log(this.coordinates);
    }
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
    pb.setOrbit(star, star.occupiedOrbits[orbit_index]);
    pb.span = star.spread * twoD6()/10;
    determineBeltComposition(star, pb);
    determineBeltBulk(star, pb);
    determineBeltResourceRating(star, pb);
    addSignificantBodies(star, pb);
    star.addStellarObject(pb);
    return pb;
  };

  addTerrestrialPlanet({star, orbitIndex, orbit, size, uwp}) {
    if (!size)
      size = terrestrialWorldSize();
    if (orbitIndex !== undefined)
      orbit = star.occupiedOrbits[orbitIndex];
    const p = new TerrestrialPlanet(size, orbit, uwp);
    p.setOrbit(star, orbit);

    if (!uwp)
      assignPhysicalCharacteristics(star, p);
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
    gg.setOrbit(star, star.occupiedOrbits[orbitIndex]);
    gg.eccentricity = eccentricity(0);
    gg.axialTilt = axialTilt();
    star.addStellarObject(gg);
    return gg;
  };

  assignOrbits() {
    for (const star of this.stars)
      star.assignOrbits(this.primaryStar);

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
      if (p === undefined) {
        break;
      } else
        this.addGasGiant({star: p[0], orbitIndex: p[1]});
    }

    for (let i=0; i < this.planetoidBelts; i++) {
      const p = allOrbits.pop();
      if (p === undefined) {
        break;
      } else
        this.addPlanetoidBelt(p[0], p[1]);
    }

    for (let i=0; i < this.terrestrialPlanets; i++) {
      const p = allOrbits.pop();
      if (p === undefined) {
        break;
      } else
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
          assignAtmosphere(star, stellarObject);
          stellarObject.meanTemperature = meanTemperature(star, stellarObject);
          stellarObject.hydrographics = determineHydrographics(star, stellarObject);
          for (const moon of stellarObject.moons)
            assignMoonAtmosphere(star, stellarObject, moon);
        }
  }

  assignMainWorldSocialCharacteristics(populated) {
    const mainWorld = this.mainWorld;
    if (!mainWorld || mainWorld.fromUWP)
      return;
    mainWorld.population.code = Math.min(populated.maxPopulationCode, Math.max(populated.minPopulationCode, twoD6()));
    mainWorld.governmentCode = Math.max(twoD6() - 7 + mainWorld.population.code, 0);
    mainWorld.lawLevelCode = Math.max(twoD6() - 7 + mainWorld.governmentCode, 0);
    mainWorld.starPort = determineStarport(mainWorld);
    mainWorld.techLevel = Math.min(populated.maxTechLevel, Math.max(populated.minTechLevel, d6() + techLevelDMs(mainWorld)));
    this.allegiance = populated.allegiance;
  }

  assignBiomass() {
    for (const star of this.stars)
      for (const stellarObject of star.stellarObjects)
        if ([ORBIT_TYPES.TERRESTRIAL, ORBIT_TYPES.PLANETOID_BELT_OBJECT].includes(stellarObject.orbitType)) {
          biomass(star, stellarObject);
          if (stellarObject.nativeSophont) {
            // todo: determine sophont
            assignSocialCharacteristics(star, stellarObject);
          }
          // TODO: Moons
        }
  }

  assignResourceRatings() {
    for (const star of this.stars)
      for (const stellarObject of star.stellarObjects)
        if ([ORBIT_TYPES.TERRESTRIAL, ORBIT_TYPES.PLANETOID_BELT_OBJECT].includes(stellarObject.orbitType))
          stellarObject.resourceRating = resourceRating(stellarObject);
          // TODO: Moons
  }

  assignHabitabilityRatings() {
    for (const star of this.stars)
      for (const stellarObject of star.stellarObjects)
        if ([ORBIT_TYPES.TERRESTRIAL, ORBIT_TYPES.PLANETOID_BELT_OBJECT].includes(stellarObject.orbitType))
          stellarObject.habitabilityRating = habitabilityRating(stellarObject);
          // TODO: Moons
  }

  starsSummary() {
    const summary = [];
    for (const star of this.stars)
      summary.push(summaryBlock(star));
    return summary;
  }

  randomStar() {
    const hasOrbits = this.stars.filter(star => star.availableOrbits.length > 0);
    const i = r.integer(0, hasOrbits.length-1);
    return hasOrbits[i];
  }

  get hasNativeSophont() {
    for (const star of this.stars)
      for (const stellarObject of star.stellarObjects)
        if (stellarObject.nativeSophont)
          return true;
    return false;
  }

  get hasExtinctSophont() {
    for (const star of this.stars)
      for (const stellarObject of star.stellarObjects)
        if (stellarObject.extinctSophont)
          return true;
    return false;
  }

  randomStarAndOrbit() {
    let star;
    let orbit;
    let count = 0;
    do {
      star = this.randomStar();
      if (!star)
        return [null, null];
      if (star.minimumOrbit === null)
        if (this.stars.length === 1)
          return [null, null];
        else
          continue;
      orbit = twoD6() - 2 + d10()/10;
      if (star.minimumOrbit > 10) {
        const newO = r.integer(star.availableOrbits[0][0]*10, star.availableOrbits[0][1]*10)/10;
        console.log(`high minimum orbit: ${this.sector} ${this.coordinates} ${star.minimumOrbit} ${newO}`)
        orbit = newO;
      } else
        orbit = twoD6() - 2 + d10()/10;
      count++;
      if (count > 100) {
        console.log(JSON.stringify(this.stars, null, 2));
        throw('bad');
      }

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
      if (star === null) {
        planets = 0;
        continue;
      }
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
    if (star.companion)
      total += this.countObjects(star.companion);
    for (const obj of star.stellarObjects)
      if (obj instanceof Star)
        total += this.countObjects(obj);
    return total;
  }

  addLocations(star, locations) {
    // if (star.companion)
    //   locations.push(orbitPosition(star.companion, star));

    for (const obj of star.stellarObjects) {
      locations.push(orbitPosition(obj, star));
      if (obj instanceof Star)
        this.addLocations(obj, locations);
    }
  }

  systemMap() {
    const locations = [];
    this.addLocations(this.primaryStar, locations);

    const svg = [];
    const maxSize = Math.ceil(locations.reduce((m, l) => {
      return Math.max(l.radius + l.parentRadius, m);
    }, 0));
    const scale = 1000 / maxSize;
    const midPoint = 1025;
    const primary = `<circle cx="${midPoint}" cy="${midPoint}" r="25" fill="${starColour(this.primaryStar)}" />`;
    svg.push('<svg width="2050" height="2050" xmlns="http://www.w3.org/2000/svg">');
    const jsize = this.primaryStar.jumpShadow*AU*scale;
    const jumpShadow = `<circle cx="${midPoint}" cy="${midPoint}" r="${jsize}" fill="#DDDDDD" />`;
    svg.push(jumpShadow);
    svg.push(primary);
    for (const l of locations) {
      let size = 10;
      let colour;
      if (l.stellarObject.orbitType <= ORBIT_TYPES.COMPANION) {
        size = 20;
        colour = starColour(l.stellarObject);
      } else if (l.stellarObject.orbitType === ORBIT_TYPES.GAS_GIANT) {
        if (l.stellarObject.code === 'GS')
          size = 15;
        else if (l.stellarObject.code === 'GM')
          size = 17;
        else
          size = 19;
        colour = "purple";
      } else if (l.stellarObject.orbitType === ORBIT_TYPES.PLANETOID_BELT) {
        size = 0;
        colour = "black";
      } else if (l.stellarObject.orbitType === ORBIT_TYPES.PLANETOID_BELT_OBJECT) {
        if (l.stellarObject.size === 'S' || l.stellarObject.size === 'R')
          size = 2;
        else
          size = 3 + l.stellarObject.size;
        colour = "grey";
      } else {
        size = 3 + l.stellarObject.size;
        if (l.stellarObject.hydrographics.code === 0)
          colour = '#933A16';
        else
          colour = `hsl(210, ${parseInt(l.stellarObject.hydrographics.code)*10}%, 50%)`;
      }

      if (size !== 0) {
        const circle = `<circle cx="${midPoint + l.x * scale}" cy="${midPoint + l.y * scale}" r="${size}" fill="${colour}" />`;
        svg.push(circle)
      }
      const strokeWidth = size === 0 ? 3 : l.habitableZone ? 2 : 1;
      const strokeColour = l.habitableZone ? '#008800' : 'grey';
      const orbit = `<circle cx="${midPoint + l.orbitCentreX * scale}" cy="${midPoint + l.orbitCentreY * scale}" r="${l.radius * scale}" fill="none" stroke="${strokeColour}" stroke-width="${strokeWidth}" stroke-dasharray="9, 15"/>`;
      svg.push(orbit)
    }
    svg.push('</svg>');
    return svg.join('\n');
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
    const planetoidBelt = /^.000.../;
    let newBody;
    if (planetoidBelt.test(body)) {
      newBody = this.addPlanetoidBelt(star, orbitIndex);
      this.planetoidBelts++;
    } else if (body.uwp === 'Small Gas Giant') {
      this.gasGiants++;
      newBody = this.addGasGiant({star: star, orbitIndex: orbitIndex, size: 'GS'});
    } else if (body.uwp === 'Gas Giant') {
      this.gasGiants++;
      newBody = this.addGasGiant({star: star, orbitIndex: orbitIndex, size: 'GM'});
    } else if (body.uwp === 'Large Gas Giant') {
      this.gasGiants++;
      newBody = this.addGasGiant({star: star, orbitIndex: orbitIndex, size: 'GL'});
    } else if (body.uwp === 'Super-Earth') {
      newBody = this.addTerrestrialPlanet({
        star: star,
        orbitIndex: orbitIndex,
        size: superEarthWorldSize()
      });
      this.terrestrialPlanets++;
    } else if (body.uwp === 'terrestrial') {
      newBody = this.addTerrestrialPlanet({star: star, orbitIndex: orbitIndex,});
      this.terrestrialPlanets++;
    } else {
      newBody = this.addTerrestrialPlanet({star: star, orbitIndex: orbitIndex, uwp: body.uwp});
      this.terrestrialPlanets++;
    }

    return newBody;
  }

  getPossibleMainWorlds(star, possibleMainWorlds) {
    for (const stellarObject of star.stellarObjects)
      if (stellarObject instanceof Star)
        this.getPossibleMainWorlds(stellarObject, possibleMainWorlds);
      else if (!(stellarObject instanceof GasGiant))
        possibleMainWorlds.push([Math.abs(stellarObject.effectiveHZCODeviation), stellarObject])
  }

  getPossibleGGMainWorlds(star, possibleMainWorlds) {
    for (const stellarObject of star.stellarObjects)
      if (stellarObject instanceof Star)
        this.getPossibleGGMainWorlds(stellarObject, possibleMainWorlds);
      else if (stellarObject instanceof GasGiant)
        for (const moon of stellarObject.moons)
          possibleMainWorlds.push([Math.abs(stellarObject.effectiveHZCODeviation), moon])
  }

  get mainWorld() {
    if (this._mainWorld !== null)
      return this._mainWorld;
    const possibleMainWorlds = [];
    for (const star of this.stars)
      this.getPossibleMainWorlds(star, possibleMainWorlds)
    possibleMainWorlds.sort((a,b) => {
      if (b[1].population.code === a[1].population.code) {
        if (Math.abs(a[0] - b[0]) > 0.1)
          return a[0] - b[0];
        else {
          const bSize = b[1].size === 'S' ? -1 : b[1].size;
          const aSize = a[1].size === 'S' ? -1 : a[1].size;
          return bSize - aSize;
        }
      } else
        return b[1].population.code - a[1].population.code;
    });
    if (possibleMainWorlds.length === 0) {
      for (const star of this.stars)
        this.getPossibleGGMainWorlds(star, possibleMainWorlds);
      possibleMainWorlds.sort((a,b) => {
        if (Math.abs(a[0] - b[0]) > 0.1)
          return a[0] - b[0];

        const bSize = b[1].size === 'S' ? '-1' : b[1].size;
        const aSize = a[1].size === 'S' ? '-1' : a[1].size;
        return bSize - aSize;
      });
    }
    try {
      this._mainWorld = possibleMainWorlds[0][1];
    } catch(err) {
      if (err instanceof TypeError) {
        this._mainWorld = null;
        console.log(`  ${this.sector.name} ${this.coordinates} has no main world`);
      }
    }
    return this._mainWorld;
  }

  assignOrbitSequences() {
    this.primaryStar.assignOrbitSequences([1]);
  }

}

module.exports = SolarSystem;
