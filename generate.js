require('dotenv').config();
const Random = require("random-js").Random;
const commander= require('commander');
const yaml= require('js-yaml');
const fs= require('fs');
const {twoD6, d6} = require("./dice");
const {gasGiantQuantity} = require("./gasGiants");
const {planetoidBeltQuantity} = require("./planetoidBelts");
const {calculatePeriod, additionalStarDM, ORBIT_TYPES, companionOrbit} = require("./utils");
const Star = require("./stars/star");
const {determineStarClassification} = require("./stars/determineStarClassification");
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

const dumpRefereeReference = async (sector, outputDir) => {
  const reference = refereeReference(sector);
  fs.writeFileSync(`${outputDir}/referee.csv`, reference.join('\n'));
}

const generateSubsector = (outputDir, sector, subsector, index, travellerMap) => {
  const rowOffset = ROW_OFFSETS[Math.ceil(index/4)];
  const colOffset = COL_OFFSETS[index % 4];
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

      let star;
      const systemName = (defined && defined.name) ? defined.name : null;
      const solarSystem = new SolarSystem(systemName);
      solarSystem.sector = sector.name;
      solarSystem.coordinates = coordinate(row+rowOffset, col+colOffset);
      let unusualChance = sector.unusualChance / 100;
      if (defined) {
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
      } else
        assignStars({solarSystem: solarSystem, unusualChance: unusualChance});

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
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-${subsector.name}-map.svg`, solarSystem.systemMap());
      const text = `${sector.name} ${solarSystem.coordinates} ${solarSystem.primaryStar.textDump(0, '', '', 0, [1])}`;
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-${subsector.name}.txt`, text);
      let asJson = toJSON(solarSystem.primaryStar);
      asJson = JSON.stringify(asJson, null, 2);
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-${subsector.name}.json`, asJson);
      fs.writeFileSync(`${outputDir}/${solarSystem.coordinates}-${subsector.name}-travel.html`, solarSystem.travelGrid());
      travellerMap.addSystem(solarSystem);
      sector.solarSystems.push(solarSystem);
    }
}

// noinspection HtmlDeprecatedTag,XmlDeprecatedElement
commander
  .version('0.0.1', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-s, --sector <filname>', 'File with sector definition', '')
  .option('-o, --output <dir>', 'Directory for the output', 'output')
  .parse(process.argv);

(async () => {
  const options = commander.opts()
  const sector = yaml.load(fs.readFileSync(options.sector, 'utf8'));
  sector.solarSystems = [];

  console.log(`Generating ${sector.name}`);

  const mapDir = `${options.output}/maps`;
  if (!fs.existsSync(mapDir))
    fs.mkdirSync(mapDir, { recursive: true });

  const refereeMapDir = `${options.output}/referee-maps`;
  if (!fs.existsSync(refereeMapDir))
    fs.mkdirSync(refereeMapDir, { recursive: true });

  const outputDir = `${options.output}/${sector.name}`;
  if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir, { recursive: true });
  else
    fs.readdirSync(outputDir).forEach(f => fs.rmSync(`${outputDir}/${f}`));

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
  await dumpStats(sector, outputDir);
  await dumpRefereeReference(sector, outputDir);
  fs.writeFileSync(`${outputDir}/systems.csv`, travellerMap.systemDump());
  fs.writeFileSync(`${outputDir}/referee-systems.csv`, travellerMap.systemDump(true));
  fs.writeFileSync(`${outputDir}/meta.xml`, travellerMap.metaDataDump());
  fs.writeFileSync(`${outputDir}/referee-meta.xml`, travellerMap.metaDataDump(true));
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
