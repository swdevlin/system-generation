const Random = require("random-js").Random;
const commander= require('commander');
const yaml= require('js-yaml');
const fs= require('fs');
const {twoD6, d6} = require("./dice");
const {gasGiantQuantity} = require("./gasGiants");
const {planetoidBeltQuantity} = require("./planetoidBelts");
const {terrestrialPlanetQuantity} = require("./terrestrialPlanets");
const {calculatePeriod, companionOrbit, additionalStarDM, ORBIT_TYPES} = require("./utils");
const {generateStar} = require("./stars");
const {SolarSystem} = require("./solarSystems");
const TravellerMap = require("./utils/travellerMap");

const SUBSECTOR_TYPES = {
  DENSE: { chance: 0.60},
  STANDARD: { chance: 0.5},
  LOW: { chance: 0.35},
  SPARSE: { chance: 0.20},
  RIFT: { chance: 0.08},
  DEEP_RIFT: { chance: 0.04},
  EMPTY: { chance: 0.0},
  RIFT_TOPEDGE: { chance: 0.5},
  RIFT_BOTTOMEDGE: { chance: 0.5},
  RIFT_LEFTEDGE: { chance: 0.5},
  RIFT_RIGHTEDGE: { chance: 0.5},
}

const r = new Random();

const coordinate = (row, col) => {
  return ('0' + col).slice(-2) + ('0' + row).slice(-2);
}

const parseChance = (row, col, subsector_type) => {
  switch (subsector_type) {
    case "SPARSE":
    case "DENSE":
    case "LOW":
    case "RIFT":
    case "DEEP_RIFT":
    case "EMPTY":
    case "STANDARD":
      return SUBSECTOR_TYPES[subsector_type].chance;
    case 'RIFT_TOPEDGE':
      return (row > 4) ? SUBSECTOR_TYPES.RIFT.chance : SUBSECTOR_TYPES.SPARSE.chance;
    case 'RIFT_BOTTOMEDGE':
      return (row < 7) ? SUBSECTOR_TYPES.RIFT.chance : SUBSECTOR_TYPES.SPARSE.chance;
    case 'RIFT_LEFTEDGE':
      return (col > 2) ? SUBSECTOR_TYPES.RIFT.chance : SUBSECTOR_TYPES.SPARSE.chance;
    case 'RIFT_RIGHTEDGE':
      return (col < 7) ? SUBSECTOR_TYPES.RIFT.chance : SUBSECTOR_TYPES.SPARSE.chance;
  }
  return undefined;
}

const companionDM = (star) => {
  let dm = 0;
  switch (star.stellarClass) {
    case 'Ia':
    case 'Ib':
    case 'II':
    case 'III':
    case 'IV':
      dm = 1;
      break;
    case 'V':
    case 'VI':
      if (['O', 'B', 'A', 'F'].includes(star.stellarType))
        dm = 1;
      else if (star.stellarType === 'M')
        dm = -1
      break;
  }
  return dm;
}

const addCompanion = (star) => {
  star.companion = generateStar(star, 0, ORBIT_TYPES.COMPANION);
  star.companion.orbit = companionOrbit();
  star.companion.period = calculatePeriod(star.companion, star);
}

const COL_OFFSETS = [24, 0, 8, 16];
const ROW_OFFSETS = [0, 0, 10, 20, 30];

const generateSubsector = (outputDir, sectorName, subsectorName, frequency, index, travellerMap) => {
  const rowOffset = ROW_OFFSETS[Math.ceil(index/4)];
  const colOffset = COL_OFFSETS[index % 4];
  for (let col=1; col <= 8; col++)
    for (let row=1; row <= 10; row++) {
      const chance = parseChance(row, col, frequency);
      if (r.bool(chance)) {
        let star;
        const solarSystem = new SolarSystem();
        solarSystem.sector = sectorName;
        solarSystem.coordinates = coordinate(row+rowOffset, col+colOffset);
        solarSystem.addPrimary(generateStar(null, 0, ORBIT_TYPES.PRIMARY));
        const primary = solarSystem.primaryStar;
        let dm = additionalStarDM(primary);
        if (twoD6() + dm >= 10) {
          star = generateStar(primary, 0, ORBIT_TYPES.COMPANION);
          primary.companion = star;
          star.orbit = d6()/10+(twoD6()-7)/100;
          star.period = calculatePeriod(star, primary);
        }
        if (twoD6() + dm >= 10) {
          star = generateStar(primary, 0, ORBIT_TYPES.CLOSE);
          star.orbit = d6()-1;
          if (star.orbit === 0)
            star.orbit = 0.5;
          else
            star.orbit += r.integer(0,9)/10 - 0.5;
          star.period = calculatePeriod(star, primary);
          if (twoD6() + companionDM(star) >= 10)
            addCompanion(star);
          solarSystem.addStar(star);
        }
        if (twoD6() + dm >= 10) {
          star = generateStar(primary, 0, ORBIT_TYPES.NEAR);
          star.orbit = d6()+5 + r.integer(0,9)/10 - 0.5;
          star.period = calculatePeriod(star, primary);
          if (twoD6() + companionDM(star) >= 10)
            addCompanion(star);
          solarSystem.addStar(star);
        }
        if (twoD6() + dm >= 10) {
          star = generateStar(primary, 0, ORBIT_TYPES.FAR);
          star.orbit = d6()+11 + r.integer(0,9)/10 - 0.5;
          star.period = calculatePeriod(star, primary);
          if (twoD6() + companionDM(star) >= 10)
            addCompanion(star);
          solarSystem.addStar(star);
        }
        solarSystem.determineAvailableOrbits();
        solarSystem.gasGiants = gasGiantQuantity(solarSystem);
        solarSystem.planetoidBelts = planetoidBeltQuantity(solarSystem);
        solarSystem.terrestrialPlanets = terrestrialPlanetQuantity(solarSystem);

        solarSystem.distributeObjects();
        solarSystem.assignOrbits();
        solarSystem.addAnomalousPlanets();
        solarSystem.addMoons();
        solarSystem.assignAtmospheres();
        const text = `${sectorName} ${solarSystem.coordinates} ${solarSystem.primaryStar.textDump(0, '', '')}`;
        const json = JSON.stringify(solarSystem.primaryStar, null, 2);
        fs.writeFileSync(`${outputDir}/${subsectorName}-${solarSystem.coordinates}.txt`, `${text}\n\n${json}`);
        travellerMap.addSystem(solarSystem);
      }
    }
 }

// noinspection HtmlDeprecatedTag,XmlDeprecatedElement
commander
  .version('0.0.1', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-s, --sector <filname>', 'File with sector definition', '')
  .option('-o, --output <dir>', 'Directory for the output', 'output')
  .parse(process.argv);

;(async () => {
  const options = commander.opts()
  const sector = yaml.load(fs.readFileSync(options.sector, 'utf8'));
  const outputDir = options.output;
  console.log(`${sector.name}`);
  if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir);
  else
    fs.readdirSync(outputDir).forEach(f => fs.rmSync(`${outputDir}/${f}`));
  let index = 0;
  const travellerMap = new TravellerMap(sector.name);
  travellerMap.X = sector.X;
  travellerMap.Y = sector.Y;
  for (const subsector of sector.subsectors) {
    index++;
    travellerMap.subSectors[subsector.index] = subsector.name;
    generateSubsector(outputDir, sector.name, subsector.name, subsector.type, index, travellerMap);
  }
  fs.writeFileSync(`${outputDir}/systems.csv`, travellerMap.systemDump());
  fs.writeFileSync(`${outputDir}/meta.xml`, travellerMap.metaDataDump());
  console.log(travellerMap.systemDump());
  console.log(travellerMap.metaDataDump());
  console.log('done');
})()
.then(() => process.exit(0))
.catch(err => {
  console.log(err.stack);
  process.exit(0);
});
