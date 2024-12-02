require('dotenv').config();
const Random = require("random-js").Random;
const commander= require('commander');
const yaml= require('js-yaml');
const fs= require('fs');
const {gasGiantQuantity} = require("./gasGiants");
const {planetoidBeltQuantity} = require("./planetoidBelts");
const SolarSystem = require("./solarSystems/solarSystem");
const createMap = require("./travellerMap/createMap");
const TravellerMap = require("./travellerMap/travellerMap");
const computeStats = require("./solarSystems/computeStats");
const refereeReference = require("./solarSystems/refereeReference");
const terrestrialPlanetQuantity = require("./terrestrialPlanet/terrestrialPlanetQuantity");
const toJSON = require("./utils/toJSON");
const loadStarsFromDefinition = require("./solarSystems/loadStarsFromDefinition");
const assignStars = require("./solarSystems/assignStars");
const loadPlanetsFromDefinition = require("./solarSystems/loadPlanetsFromDefinition");
const {STELLAR_TYPES} = require("./utils");
const knex = require("./db/connection");

const SUBSECTOR_TYPES = {
  DENSE: { chance: 0.60},
  STANDARD: { chance: 0.50},
  MODERATE: { chance: 0.40},
  LOW: { chance: 0.30},
  SPARSE: { chance: 0.20},
  MINIMAL: { chance: 0.10},
  RIFT: { chance: 1/36},
  RIFT_FADE: { chance: 0.02},
  DEEP_RIFT: { chance: 0.01},
  EMPTY: { chance: 0.0},
}

const r = new Random();

const coordinate = (row, col) => {
  return ('0' + col).slice(-2) + ('0' + row).slice(-2);
}

const parseChance = (row, col, subsector_type) => {
  return SUBSECTOR_TYPES[subsector_type].chance;
}

const COL_OFFSETS = [24, 0, 8, 16];
const ROW_OFFSETS = [0, 0, 10, 20, 30];

const dumpStats = async (sector, outputDir) => {
  const stats = computeStats(sector);
  fs.writeFileSync(`${outputDir}/stats.yaml`, yaml.dump(stats));
}

const dumpSurveyIndex = async (sector, outputDir) => {
  const surveyIndex = {};
  for (const solarSystem of sector.solarSystems) {
    const key = sector.X + '.' + sector.Y + '.' + solarSystem.coordinates;
    surveyIndex[key] = solarSystem.surveyIndex;
  }
  fs.writeFileSync(`${outputDir}/surveyIndex.json`, JSON.stringify(surveyIndex));
}

const dumpRefereeReference = async (sector, outputDir) => {
  const reference = refereeReference(sector);
  fs.writeFileSync(`${outputDir}/referee.csv`, reference.join('\n'));

  let asJson = toJSON(sector);
  asJson = JSON.stringify(asJson, null, 2);
  fs.writeFileSync(`${outputDir}/${sector.name}.json`, asJson);
}

const defaultSI = (sector) => {
  if (sector.defaultSI)
    return sector.defaultSI;

  const distance = Math.abs(sector.x) + Math.abs(sector.y);
  if (distance < 15)
    return 3;
  else if (distance < 22)
    return 2;
  else
    return 1;
}

const generateSubsector = (outputDir, sector, subsector, index, travellerMap) => {
  const rowOffset = ROW_OFFSETS[Math.ceil(index/4)];
  const colOffset = COL_OFFSETS[index % 4];
  let si = defaultSI(sector);
  for (let col=1; col <= 8; col++)
    for (let row=1; row <= 10; row++) {
      let chance = 0;
      let defined = null;
      if (subsector.systems) {
        for (const s of subsector.systems)
          if (s.x === col && s.y === row) {
            defined = s;
            chance = 1;
            break;
          }
      } else {
        chance = parseChance(row, col, subsector.type);
        if (subsector.required)
          for (const s of subsector.required)
            if (s.x === col && s.y === row) {
              defined = s;
              chance = 1;
              break;
            }
      }
      if (!r.bool(chance))
        continue;

      const systemName = (defined && defined.name) ? defined.name : null;
      const solarSystem = new SolarSystem(systemName);
      solarSystem.sector = sector.name;
      solarSystem.coordinates = coordinate(row+rowOffset, col+colOffset);

      let unusualChance = sector.unusualChance / 100;
      if (defined) {
        if (defined.surveyIndex)
          si = defined.surveyIndex;
        if (defined.name)
          solarSystem.name = defined.name;
        if (defined.remarks)
          solarSystem.remarks = defined.remarks;
        solarSystem.known = defined.known ? defined.known : false;
        if (defined.bases) {
          solarSystem.bases = defined.bases;
        }
        loadStarsFromDefinition({
          sector: sector,
          subsector: subsector,
          definition: defined,
          solarSystem: solarSystem,
        })
      } else {
        assignStars({solarSystem: solarSystem, unusualChance: unusualChance});
      }
      if (solarSystem.onlyBrownDwarfs() || solarSystem.primaryStar.stellarType === STELLAR_TYPES.Anomaly)
        solarSystem.surveyIndex = 0;
      else
        solarSystem.surveyIndex = si;

      const primary = solarSystem.primaryStar;

      solarSystem.determineAvailableOrbits();

      if (defined) {
        loadPlanetsFromDefinition({
          sector: sector,
          subsector: subsector,
          definition: defined,
          solarSystem: solarSystem
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
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-map.svg`, solarSystem.systemMap());
      const text = `${sector.name} ${solarSystem.coordinates} ${solarSystem.primaryStar.textDump(0, '', '', 0, [1])}`;
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}.txt`, text);
      let asJson = toJSON(solarSystem.primaryStar);
      asJson = JSON.stringify(asJson, null, 2);
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}.json`, asJson);
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-travel.html`, solarSystem.travelGrid());
      travellerMap.addSystem(solarSystem);
      sector.solarSystems.push(solarSystem);
    }
}

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
}

const createAndEmptySectorDirectories = (outputFolder, sectorName) => {
  const mapDir = `${outputFolder}/maps`;
  if (!fs.existsSync(mapDir))
    fs.mkdirSync(mapDir, { recursive: true });

  const refereeMapDir = `${outputFolder}/referee-maps`;
  if (!fs.existsSync(refereeMapDir))
    fs.mkdirSync(refereeMapDir, { recursive: true });

  const outputDir = `${outputFolder}/${sectorName}`;
  if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir, { recursive: true });
  else
    fs.readdirSync(outputDir).forEach(f => fs.rmSync(`${outputDir}/${f}`));

  return {
    mapDir,
    outputDir,
    refereeMapDir
  }
}

async function setUpSectorInDatabase(sector) {
  await knex('solar_system')
    .whereIn('sector_id', function () {
      this.select('id')
        .from('sector')
        .where({
          x: sector.X,
          y: sector.Y
        });
    })
    .del();
  const inserted = await knex('sector').insert({
    x: sector.X,
    y: sector.Y,
    name: sector.name,
    abbreviation: sector.abbreviation,
  }).onConflict(['x', 'y'])
    .merge()
    .returning("*");
  return inserted[0];
}


// noinspection HtmlDeprecatedTag,XmlDeprecatedElement
commander
  .version('0.4', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-s, --sector <filname>', 'File with sector definition', '')
  .option('-o, --output <dir>', 'Directory for the output', 'output')
  .parse(process.argv);

(async () => {
  const options = commander.opts()
  const sector = yaml.load(fs.readFileSync(options.sector, 'utf8'));
  sector.unusualChance = Math.sqrt(Math.abs(sector.X) + Math.abs(sector.Y));
  sector.solarSystems = [];

  console.log(`Generating ${sector.name}`);

  const db_sector = await setUpSectorInDatabase(sector);

  const {mapDir, refereeMapDir, outputDir} = createAndEmptySectorDirectories(options.output, sector.name)

  const travellerMap = await generateSector(sector, outputDir);

  for (const solar_system of sector.solarSystems) {
    await knex('solar_system').insert({
      sector_id: db_sector.id,
      x: solar_system.x,
      y: solar_system.y,
      name: solar_system.name,
      scan_points: solar_system.scanPoints,
      survey_index: solar_system.surveyIndex,
      star_count: solar_system.starCount,
      gas_giant_count: solar_system.gasGiants,
      planetoid_belt_count: solar_system.planetoidBelts,
      terrestrial_planet_count: solar_system.terrestrialPlanets,
      bases: solar_system.bases,
      remarks: solar_system.remarks,
      native_sophont: solar_system.hasNativeSophont,
      extinct_sophont: solar_system.hasExtinctSophont,
      primary_star: toJSON(solar_system.primaryStar),
      main_world: solar_system.mainWorld,
      stars: JSON.stringify(solar_system.starsSummary()),
    });
  }

  await dumpStats(sector, outputDir);

  await dumpRefereeReference(sector, outputDir);

  fs.writeFileSync(`${outputDir}/systems.csv`, travellerMap.systemDump());

  fs.writeFileSync(`${outputDir}/referee-systems.csv`, travellerMap.systemDump(true));

  fs.writeFileSync(`${outputDir}/meta.xml`, travellerMap.metaDataDump());

  fs.writeFileSync(`${outputDir}/referee-meta.xml`, travellerMap.metaDataDump(true));

  await dumpSurveyIndex(sector, outputDir);

  await createMap({
    systems: travellerMap.systemDump(true),
    meta: travellerMap.metaDataDump(true),
    mapDir: refereeMapDir,
    sectorDir: outputDir,
    sectorName: sector.name,
    forReferee: true
  });

  await createMap({
    systems: travellerMap.systemDump(),
    meta: travellerMap.metaDataDump(),
    mapDir: mapDir,
    sectorDir: outputDir,
    sectorName: sector.name,
    forReferee: false
  });
})()
.then(() => process.exit(0))
.catch(err => {
  console.log(err.stack);
  process.exit(0);
});
