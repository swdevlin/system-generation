'use strict';

const express = require('express');
const router = express.Router();

const { twoD6 } = require('../dice');
const { ORBIT_TYPES, orbitToAU } = require('../utils');

const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const assignPhysicalCharacteristics = require('../terrestrialPlanet/assignPhysicalCharacteristics');
const terrestrialComposition = require('../terrestrialPlanet/terrestrialComposition');
const terrestrialDensity = require('../terrestrialPlanet/terrestrialDensity');

const {
  PlanetoidBelt,
  determineBeltComposition,
  determineBeltBulk,
  determineBeltResourceRating,
  addSignificantBodies,
} = require('../planetoidBelts');

const assignMoons = require('../moons/assignMoons');

const assignAtmosphere = require('../atmosphere/assignAtmosphere');
const { meanTemperature, determineHydrographics } = require('../utils');

const assignBiomass = require('../utils/assignBiomass');
const calcRotation = require('../utils/calcRotation');
const resourceRating = require('../utils/resourceRating');
const habitabilityRating = require('../utils/habitabilityRating');
const { assignTradeCodes } = require('../economics/assignTradeCodes');
const { assignCulture } = require('../population/assignCulture');
const { assignGovernmentDetails } = require('../government/assignGovernmentDetails');

const assignTidalLock = require('../tidalLock/assignTidalLock');
const toJSON = require('../utils/toJSON');

function validateRequest(req, res, next) {
  const { uwp, orbit, star } = req.body;

  if (typeof uwp !== 'string' || uwp.length < 9)
    return res.status(400).json({ error: 'uwp must be a string of at least 9 characters' });

  if (typeof orbit !== 'number' || orbit < 0)
    return res.status(400).json({ error: 'orbit must be a non-negative number' });

  if (!star || typeof star !== 'object' || Array.isArray(star))
    return res.status(400).json({ error: 'star must be an object' });

  for (const field of ['hzco', 'age', 'mass', 'spread']) {
    if (typeof star[field] !== 'number')
      return res.status(400).json({ error: `star.${field} must be a number` });
  }

  next();
}

function buildStarProxy(star) {
  return {
    hzco: star.hzco,
    age: star.age,
    mass: star.mass,
    spread: star.spread,
    availableOrbits: star.availableOrbits ?? [[0, 20]],
    hasFarCompanion: star.hasFarCompanion ?? false,
    stellarObjects: [],

    addStellarObject(item) {
      let i = 0;
      let mass = this.mass;
      while (i < this.stellarObjects.length && this.stellarObjects[i].orbit < item.orbit) {
        if (this.stellarObjects[i].orbitType < ORBIT_TYPES.GAS_GIANT)
          mass += this.stellarObjects[i].mass;
        i++;
      }
      this.stellarObjects.splice(i, 0, item);
      item.period = Math.sqrt(orbitToAU(item.orbit) ** 3 / mass) * 365.25;
    },

    orbitAdjacentToUnavailabilityZone(orbit) {
      for (let i = 0; i < this.availableOrbits.length; i++) {
        const [min, max] = this.availableOrbits[i];
        if (i === 0 && Math.abs(orbit - max) <= this.spread) return true;
        if (i > 0 && (Math.abs(orbit - min) <= this.spread || Math.abs(orbit - max) <= this.spread))
          return true;
      }
      return false;
    },

    orbitAdjacentToOuterMostUnavailability(orbit) {
      if (!this.hasFarCompanion || !this.availableOrbits.length) return false;
      const [, outerMax] = this.availableOrbits[this.availableOrbits.length - 1];
      return Math.abs(orbit - outerMax) <= this.spread;
    },
  };
}

function processTerrestrialPlanet(starProxy, uwp, orbit) {
  const planet = new TerrestrialPlanet(null, orbit, uwp);
  planet.setOrbit(starProxy, orbit);
  starProxy.addStellarObject(planet);

  assignPhysicalCharacteristics(starProxy, planet);
  assignMoons(starProxy);

  calcRotation(planet, starProxy.age);
  for (const moon of planet.moons) calcRotation(moon, starProxy.age);

  assignAtmosphere(starProxy, planet);
  planet.meanTemperature = meanTemperature(starProxy, planet);
  planet.hydrographics = determineHydrographics(starProxy, planet);

  for (const moon of planet.moons) {
    assignAtmosphere(starProxy, moon);
    if (moon.size === 'S' || moon.size === 'R' || moon.size === 0) {
      moon.hydrographics.code = 0;
      continue;
    }
    moon.meanTemperature = meanTemperature(starProxy, moon);
    moon.hydrographics = determineHydrographics(starProxy, moon);
    moon.composition = terrestrialComposition(starProxy, moon);
    moon.density = terrestrialDensity(moon.composition);
  }

  assignTidalLock([starProxy]);

  assignBiomass(starProxy, planet, 'standard');
  planet.resourceRating = resourceRating(planet);
  planet.habitabilityRating = habitabilityRating(planet);

  assignTradeCodes(planet);
  assignCulture(planet);
  assignGovernmentDetails(planet);

  return planet;
}

function processPlanetoidBelt(starProxy, uwp, orbit) {
  const belt = new PlanetoidBelt(orbit, uwp);
  belt.setOrbit(starProxy, orbit);
  starProxy.addStellarObject(belt);

  determineBeltComposition(starProxy, belt);
  determineBeltBulk(starProxy, belt);
  belt.span = (starProxy.spread * twoD6()) / 10;
  determineBeltResourceRating(starProxy, belt);
  addSignificantBodies(starProxy, belt);
  assignMoons(starProxy);

  for (const obj of starProxy.stellarObjects) {
    if (obj.orbitType !== ORBIT_TYPES.PLANETOID_BELT_OBJECT) continue;
    assignAtmosphere(starProxy, obj);
    obj.meanTemperature = meanTemperature(starProxy, obj);
    obj.hydrographics = determineHydrographics(starProxy, obj);
    assignBiomass(starProxy, obj, 'standard');
    obj.resourceRating = resourceRating(obj);
    obj.habitabilityRating = habitabilityRating(obj);
  }

  assignCulture(belt);
  assignGovernmentDetails(belt);

  belt.significantBodies = starProxy.stellarObjects.filter((obj) => obj.belt === belt);

  return belt;
}

router.post('/', validateRequest, (req, res) => {
  const { uwp, orbit, star } = req.body;
  const isBelt = uwp[1] === '0';
  const starProxy = buildStarProxy(star);
  const body = isBelt
    ? processPlanetoidBelt(starProxy, uwp, orbit)
    : processTerrestrialPlanet(starProxy, uwp, orbit);

  req.logger.info('Processed UWP', { tenant: req.tenantId, uwp, isBelt });
  res.json(toJSON(body));
});

module.exports = router;
