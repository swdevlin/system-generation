const Random = require("random-js").Random;
const commander = require('commander');
const yaml = require('js-yaml');
const fs   = require('fs');
const generateStar = require("./generateStar");
const {twoD6} = require("./dice");
const {gasGiantQuantity} = require("./gasGiants");
const {planetoidBeltQuantity} = require("./planetoidBelts");
const {terrestrialPlanetQuantity} = require("./terrestrialPlants");
const determineAvailableOrbits = require("./determineAvailableOrbits");
const {companionOrbit, additionalStarDM, ORBIT_TYPES} = require("./utils");
const calculatePeriod = require("./calculatePeriod");

const STANDARD_CHANCE = 0.5;
const SPARSE_CHANCE = 0.33;
const DENSE_CHANCE = 0.66;
const RIFT_CHANCE = 0.16;
const EMPTY_CHANCE = 0.0;

const SUBSECTOR_TYPES = {
  STANDARD: 0,
  SPARSE: 1,
  DENSE: 2,
  EMPTY: 3,
  RIFT: 5,
  RIFT_TOPEDGE: 6,
  RIFT_BOTTOMEDGE: 7,
  RIFT_LEFTEDGE: 8,
  RIFT_RIGHTEDGE: 9,
}

const r = new Random();

const coordinate = (row, col) => {
  return '0' + col + ('0' + row).slice(-2);
}

const parseChance = (row, col, subsector_type) => {
  switch (subsector_type) {
    case SUBSECTOR_TYPES.STANDARD:
      return STANDARD_CHANCE;
    case SUBSECTOR_TYPES.SPARSE:
      return SPARSE_CHANCE;
    case SUBSECTOR_TYPES.DENSE:
      return DENSE_CHANCE;
    case SUBSECTOR_TYPES.EMPTY:
      return EMPTY_CHANCE;
    case SUBSECTOR_TYPES.RIFT:
      return RIFT_CHANCE;
    case SUBSECTOR_TYPES.RIFT_TOPEDGE:
      return (row > 4) ? RIFT_CHANCE : SPARSE_CHANCE;
    case SUBSECTOR_TYPES.RIFT_BOTTOMEDGE:
      return (row < 7) ? RIFT_CHANCE : SPARSE_CHANCE;
    case SUBSECTOR_TYPES.RIFT_LEFTEDGE:
      return (col > 2) ? RIFT_CHANCE : SPARSE_CHANCE;
    case SUBSECTOR_TYPES.RIFT_RIGHTEDGE:
      return (col < 7) ? RIFT_CHANCE : SPARSE_CHANCE;
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
  star.companion = generateStar(star, 0, true);
  star.companion.orbit = companionOrbit();
  star.companion.period = calculatePeriod(star.companion, star);
}

const generateSubsector = (frequency) => {
  let tm = 'Hex\tName\tUWP\tBases\tRemarks\tZone\tPBG\tAllegiance\tStars\t{Ix}\t(Ex)\t[Cx]\tNobility\tW\n';
  for (let col=1; col <= 8; col++)
    for (let row=1; row <= 10; row++) {
      const chance = parseChance(row, col, frequency);
      if (r.bool(chance)) {
        let star;
        const solarSystem = {
          primaryStar: generateStar(null, 0, false),
          stars: [],
          starCount: 1,
        };
        const primary = solarSystem.primaryStar;
        let dm = additionalStarDM(primary);
        if (twoD6() + dm >= 10) {
          star = generateStar(primary, 0, true);
          primary.companion = star;
          star.orbit = r.die(6)/10+(twoD6()-7)/100;
          star.period = calculatePeriod(star, primary);
          solarSystem.starCount++;
        }
        if (twoD6() + dm >= 10) {
          solarSystem.starCount++;
          star = generateStar(primary, 0, false);
          star.orbitType = ORBIT_TYPES.CLOSE;
          solarSystem.stars.push(star);
          star.orbit = r.die(6)-1;
          if (star.orbit === 0)
            star.orbit = 0.5;
          else
            star.orbit += r.integer(0,9)/10 - 0.5;
          star.period = calculatePeriod(star, primary);
          if (twoD6() + companionDM(star) >= 10) {
            solarSystem.starCount++;
            addCompanion(star);
          }
        }
        if (twoD6() + dm >= 10) {
          solarSystem.starCount++;
          star = generateStar(primary, 0, false);
          star.orbitType = ORBIT_TYPES.NEAR;
          solarSystem.stars.push(star);
          star.orbit = r.die(6)+5 + r.integer(0,9)/10 - 0.5;
          star.period = calculatePeriod(star, primary);
          if (twoD6() + companionDM(star) >= 10) {
            solarSystem.starCount++;
            addCompanion(star);
          }
        }
        if (twoD6() + dm >= 10) {
          solarSystem.starCount++;
          star = generateStar(star, 0, false);
          star.orbitType = ORBIT_TYPES.FAR;
          solarSystem.stars.push(star);
          star.orbit = r.die(6)+11 + r.integer(0,9)/10 - 0.5;
          star.period = calculatePeriod(star, primary);
          if (twoD6() + companionDM(star) >= 10) {
            solarSystem.starCount++;
            addCompanion(star);
          }
        }
        determineAvailableOrbits(solarSystem);
        solarSystem.gasGiants = gasGiantQuantity(solarSystem);
        solarSystem.planetoidBelts = planetoidBeltQuantity(solarSystem);
        solarSystem.terrestrialPlanets = terrestrialPlanetQuantity(solarSystem);
        solarSystem.totalObjects = solarSystem.terrestrialPlanets + solarSystem.planetoidBelts + solarSystem.gasGiants;

        allocateObjects(solarSystem);

        console.log(coordinate(row, col), solarSystem);
        tm += `${coordinate(row, col)}\t${coordinate(row, col)}\tC777777-7\t\t\t\t\t\t\t\t\t\t\t\n`;
        // console.log(coordinate(row, col));
      }
    }
  fs.writeFileSync('tm.txt', tm);
}

commander
  .version('0.0.1', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-s, --sector <filname>', 'File with sector definition', '')
  .parse(process.argv);

;(async () => {
  const options = commander.opts()
  const sector = yaml.load(fs.readFileSync(options.sector, 'utf8'));
  for (const subsector of sector.subsectors) {
    console.log(subsector.name);
    generateSubsector(subsector.type);
  }
  console.log('done');
})()
.then(res => process.exit(0))
.catch(err => {
  console.log(err.stack);
  process.exit(0);
});
