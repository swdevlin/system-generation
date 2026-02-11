const express = require('express');
const router = express.Router();
const {Random} = require('random-js');
const SolarSystem = require("../solarSystems/solarSystem");
const loadStarsFromDefinition = require("../solarSystems/loadStarsFromDefinition");
const loadPlanetsFromDefinition = require("../solarSystems/loadPlanetsFromDefinition");
const toJSON = require("../utils/toJSON");
const assignStars = require("../solarSystems/assignStars");
const {gasGiantQuantity} = require("../gasGiants");
const {planetoidBeltQuantity} = require("../planetoidBelts");
const terrestrialPlanetQuantity = require("../terrestrialPlanet/terrestrialPlanetQuantity");
const Populated = require("../solarSystems/populated");
const {assignTradeCodes} = require("../economics/assignTradeCodes");
const generateStarSystem = require("./generateStarSystem");

const r = new Random();

const SUBSECTOR_TYPES = {
  DENSE: {chance: 0.60},
  STANDARD: {chance: 0.50},
  MODERATE: {chance: 0.40},
  LOW: {chance: 0.30},
  SPARSE: {chance: 0.20},
  MINIMAL: {chance: 0.10},
  RIFT: {chance: 1 / 36},
  RIFT_FADE: {chance: 0.02},
  DEEP_RIFT: {chance: 0.01},
  EMPTY: {chance: 0.0},
}

const getPredefined = (subsector, col, row) => {
  if (subsector.systems)
    for (const s of subsector.systems)
      if (s.x === col && s.y === row)
        return s;

  if (subsector.required)
    for (const s of subsector.required)
      if (s.x === col && s.y === row)
        return s;

  return null;
}

const hasSolarSystem = (subsector) => {
  let chance = parseChance(subsector.type);
  return r.bool(chance);
}

const parseChance = (subsector_type) => {
  return SUBSECTOR_TYPES[subsector_type.toUpperCase()].chance;
}

const coordinate = (col, row) => {
  return ('0' + col).slice(-2) + ('0' + row).slice(-2);
}

router.post('/', (req, res) => {
  const subsector = req.body;
  const systems = [];
  const subsectorSI = subsector.defaultSI || 0;

  for (let col = 1; col <= 8; col++)
    for (let row = 1; row <= 10; row++) {
      let si = subsectorSI;
      let hasSystem = false;
      let defined = getPredefined(subsector, col, row);
      if (defined)
        hasSystem = true;
      else {
        if (subsector.systems?.length)
          hasSystem = false;
        else if (subsector.exclude?.some(e => e.x === col && e.y === row))
          hasSystem = false;
        else
          hasSystem = hasSolarSystem(subsector);
      }

      if (!hasSystem)
        continue;

      const starSystem = generateStarSystem(defined, subsector);
      starSystem.coordinates = coordinate(col, row);
      // fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-map.svg`, solarSystem.systemMap());
      // const text = `${sector.name} ${solarSystem.coordinates} ${solarSystem.primaryStar.textDump(0, '', '', 0, [1])}`;
      // fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}.txt`, text);
      // let asJson = toJSON(solarSystem.primaryStar);
      // asJson.surveyIndex = solarSystem.surveyIndex;
      // asJson.scanPoints = solarSystem.scanPoints;
      // asJson = JSON.stringify(asJson, null, 2);
      // fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}.json`, asJson);
      // fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-travel.html`, solarSystem.travelGrid());
      // travellerMap.addSystem(solarSystem);
      systems.push(starSystem);
    }

  const tenant = req.tenantId;
  req.logger.info(`Generated subsector`, {tenant});
  res.json(toJSON(systems));
});

module.exports = router;
