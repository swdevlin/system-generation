const TravellerMap = require('../travellerMap/travellerMap');
const SolarSystem = require('../solarSystems/solarSystem');
const loadStarsFromDefinition = require('../solarSystems/loadStarsFromDefinition');
const assignStars = require('../solarSystems/assignStars');
const loadPlanetsFromDefinition = require('../solarSystems/loadPlanetsFromDefinition');
const { gasGiantQuantity } = require('../gasGiants');
const { planetoidBeltQuantity } = require('../planetoidBelts');
const terrestrialPlanetQuantity = require('../terrestrialPlanet/terrestrialPlanetQuantity');
const fs = require('fs');
const toJSON = require('../utils/toJSON');
const { Random } = require('random-js');
const Populated = require('../solarSystems/populated');

const r = new Random();

const parseChance = (subsector_type) => {
  return SUBSECTOR_TYPES[subsector_type].chance;
};

const COL_OFFSETS = [24, 0, 8, 16];
const ROW_OFFSETS = [0, 0, 10, 20, 30];

const SUBSECTOR_TYPES = {
  DENSE: { chance: 0.6 },
  STANDARD: { chance: 0.5 },
  MODERATE: { chance: 0.4 },
  LOW: { chance: 0.3 },
  SPARSE: { chance: 0.2 },
  MINIMAL: { chance: 0.1 },
  RIFT: { chance: 1 / 36 },
  RIFT_FADE: { chance: 0.02 },
  DEEP_RIFT: { chance: 0.01 },
  EMPTY: { chance: 0.0 },
};

const coordinate = (row, col) => {
  return ('0' + col).slice(-2) + ('0' + row).slice(-2);
};

const defaultSI = (sector) => {
  if (sector.defaultSI) return sector.defaultSI;

  const distance = Math.abs(sector.x) + Math.abs(sector.y);
  if (distance < 15) return 3;
  else if (distance < 22) return 2;
  else return 1;
};

const hasSolarSystem = (subsector) => {
  let chance = parseChance(subsector.type);
  return r.bool(chance);
};

const getPredefined = (subsector, col, row) => {
  if (subsector.systems)
    for (const s of subsector.systems) if (s.x === col && s.y === row) return s;

  if (subsector.required)
    for (const s of subsector.required) if (s.x === col && s.y === row) return s;

  return null;
};

const getPopulated = (sector, subsector) => {
  if (subsector.populated) return new Populated(subsector.populated);
  else if (sector.populated) return new Populated(subsector.populated);
  else return null;
};

const generateSubsector = (outputDir, sector, subsector, index, travellerMap) => {
  const rowOffset = ROW_OFFSETS[Math.ceil(index / 4)];
  const colOffset = COL_OFFSETS[index % 4];
  const populated = getPopulated(sector, subsector);
  const subsectorSI = defaultSI(sector);

  for (let col = 1; col <= 8; col++)
    for (let row = 1; row <= 10; row++) {
      let si = subsectorSI;
      let hasSystem = false;
      let defined = getPredefined(subsector, col, row);
      if (defined) hasSystem = true;
      else {
        if (subsector.systems) hasSystem = false;
        else if (subsector.exclude && subsector.exclude.some((e) => e.x === col && e.y === row))
          hasSystem = false;
        else hasSystem = hasSolarSystem(subsector);
      }

      if (!hasSystem) continue;

      const systemName = defined && defined.name ? defined.name : null;
      const solarSystem = new SolarSystem(systemName);
      solarSystem.sector = sector.name;
      solarSystem.coordinates = coordinate(row + rowOffset, col + colOffset);

      let unusualChance = sector.unusualChance / 100;
      if (defined) {
        if (defined.surveyIndex !== undefined) si = defined.surveyIndex;
        if (defined.name) solarSystem.name = defined.name;
        if (defined.remarks) solarSystem.remarks = defined.remarks;
        if (defined.allegiance) solarSystem.allegiance = defined.allegiance;
        solarSystem.known = defined.known ? defined.known : false;
        if (defined.bases) {
          solarSystem.bases = defined.bases;
        }
        loadStarsFromDefinition({
          sector: sector,
          subsector: subsector,
          definition: defined,
          solarSystem: solarSystem,
        });
      } else {
        assignStars({ solarSystem: solarSystem, unusualChance: unusualChance });
      }
      if (solarSystem.onlyBrownDwarfs()) solarSystem.surveyIndex = 0;
      else solarSystem.surveyIndex = si;

      solarSystem.determineAvailableOrbits();

      if (defined) {
        loadPlanetsFromDefinition({
          sector: sector,
          subsector: subsector,
          definition: defined,
          solarSystem: solarSystem,
        });
      } else {
        solarSystem.gasGiants = gasGiantQuantity(solarSystem);
        solarSystem.planetoidBelts = planetoidBeltQuantity(solarSystem);
        solarSystem.terrestrialPlanets = terrestrialPlanetQuantity(solarSystem);

        solarSystem.distributeObjects();
        solarSystem.assignOrbits();
        solarSystem.addAnomalousPlanets();
      }
      solarSystem.addMoons();
      solarSystem.assignAtmospheres();
      solarSystem.assignBiomass();
      solarSystem.assignResourceRatings();
      solarSystem.assignHabitabilityRatings();
      const p = populated?.getAllegiance(row, col);
      if (p && p.allegiance) solarSystem.assignMainWorldSocialCharacteristics(p);
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-map.svg`, solarSystem.systemMap());
      const text = `${sector.name} ${solarSystem.coordinates} ${solarSystem.primaryStar.textDump(0, '', '', 0, [1])}`;
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}.txt`, text);
      let asJson = toJSON(solarSystem.primaryStar);
      asJson.surveyIndex = solarSystem.surveyIndex;
      asJson.scanPoints = solarSystem.scanPoints;
      asJson = JSON.stringify(asJson, null, 2);
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}.json`, asJson);
      fs.writeFileSync(
        `${outputDir}/${solarSystem.coordinates}-travel.html`,
        solarSystem.travelGrid()
      );
      travellerMap.addSystem(solarSystem);
      sector.solarSystems.push(solarSystem);
    }
};

const generateSector = async (sector, outputDir) => {
  let index = 0;
  const travellerMap = new TravellerMap(sector.name);
  travellerMap.X = sector.X;
  travellerMap.Y = sector.Y;
  travellerMap.regions = sector.regions ? sector.regions : [];
  for (const subsector of sector.subsectors) {
    index++;
    travellerMap.subSectors[subsector.index] = subsector.name;
    generateSubsector(outputDir, sector, subsector, index, travellerMap);
  }
  return travellerMap;
};

module.exports = generateSector;
