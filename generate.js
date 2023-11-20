const Random = require("random-js").Random;
const commander= require('commander');
const yaml= require('js-yaml');
const fs= require('fs');
const {twoD6, d6} = require("./dice");
const {gasGiantQuantity} = require("./gasGiants");
const {planetoidBeltQuantity} = require("./planetoidBelts");
const {terrestrialPlanetQuantity} = require("./terrestrialPlanets");
const {calculatePeriod, additionalStarDM, ORBIT_TYPES} = require("./utils");
const {generateStar, addCompanion, generateCloseCompanion, generateNearCompanion, generateFarCompanion} = require("./stars");
const {SolarSystem} = require("./solarSystems");
const {createMap} = require("./travellerMap");
const TravellerMap = require("./utils/travellerMap");
const generateBaseStar = require("./stars/generateBaseStar");
const giantsLookup = require("./stars/giantsLookup");

const SUBSECTOR_TYPES = {
  DENSE: { chance: 0.60},
  STANDARD: { chance: 0.5},
  MODERATE: { chance: 0.4},
  LOW: { chance: 0.30},
  SPARSE: { chance: 0.20},
  MINIMAL: { chance: 0.12},
  RIFT: { chance: 0.05},
  RIFT_FADE: { chance: 0.02},
  DEEP_RIFT: { chance: 0.01},
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
    case "DENSE":
    case "STANDARD":
    case "MOEDERATE":
    case "LOW":
    case "SPARSE":
    case "MINIMAL":
    case "RIFT":
    case "RIFT_FADE":
    case "DEEP_RIFT":
    case "EMPTY":
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

const COL_OFFSETS = [24, 0, 8, 16];
const ROW_OFFSETS = [0, 0, 10, 20, 30];

const generateSubsector = (outputDir, sector, subsector, index, travellerMap, scanPoints) => {
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
      if (r.bool(chance)) {
        let star;
        const systemName = (defined && defined.name) ? defined.name : `${coordinate(row, col)}`;
        const solarSystem = new SolarSystem(systemName);
        solarSystem.sector = sector.name;
        solarSystem.coordinates = coordinate(row+rowOffset, col+colOffset);
        solarSystem.name = `${solarSystem.coordinates}`
        if (defined) {
          if (defined.name)
            solarSystem.name = defined.name;
          if (defined.remarks)
            solarSystem.remarks = defined.remarks;
          solarSystem.known = defined.known ? defined.known : false;
          if (defined.star) {
            const tokens = defined.star.type.split('');
            let stellarClass = null;
            if (defined.star.class)
              if (defined.star.class === 'Giant')
                stellarClass = giantsLookup(0);
              else
                stellarClass = defined.star.class;
            const star = generateBaseStar({
                dm: 0,
                orbitType: ORBIT_TYPES.PRIMARY,
                stellarType: tokens[0],
                stellarClass: stellarClass,
                subtype: parseInt(tokens[1])
              }
            );
            if (defined.star.companion)
              addCompanion(star);
            solarSystem.addPrimary(star);
            if (defined.star.secondaries)
              for (const secondary of defined.star.secondaries) {
                let companion;
                if (secondary.near)
                  companion = generatenearCompanion(star);
                else if (secondary.far)
                  companion = generateFarCompanion(star);
                if (secondary.close)
                  companion = generateCloseCompanion(star);
                if (companion)
                  solarSystem.addStar(companion);
              }
          } else
            solarSystem.addPrimary(generateStar(null, 0, ORBIT_TYPES.PRIMARY));
          if (defined.bases)
            solarSystem.bases = defined.bases;
        } else
          solarSystem.addPrimary(generateStar(null, 0, ORBIT_TYPES.PRIMARY));
        const primary = solarSystem.primaryStar;
        if (!defined || !defined.bodies) {
          let dm = additionalStarDM(primary);
          if (twoD6() + dm >= 10) {
            star = generateStar(primary, 0, ORBIT_TYPES.COMPANION);
            star.orbit = d6() / 10 + (twoD6() - 7) / 100;
            star.period = calculatePeriod(star, primary);
            primary.companion = star;
          }
          if (twoD6() + dm >= 10) {
            star = generateCloseCompanion(primary);
            if (twoD6() + companionDM(star) >= 10)
              addCompanion(star);
            solarSystem.addStar(star);
          }
          if (twoD6() + dm >= 10) {
            star = generateNearCompanion(primary);
            if (twoD6() + companionDM(star) >= 10)
              addCompanion(star);
            solarSystem.addStar(star);
          }
          if (twoD6() + dm >= 10) {
            star = generateFarCompanion(primary);
            if (twoD6() + companionDM(star) >= 10)
              addCompanion(star);
            solarSystem.addStar(star);
          }
        }
        solarSystem.determineAvailableOrbits();
        if (defined && defined.bodies) {
          primary.totalObjects = 20;
          primary.assignOrbits();
          primary.totalObjects = defined.bodies.length;
          let orbitIndex = 0;
          for (const body of defined.bodies) {
            if (body !== 'empty') {
              if (body.habitable) {
                if (body.habitable === 'outer')
                  while (primary.occupiedOrbits[orbitIndex] <= primary.hzco)
                    orbitIndex++;
                else if (body.habitable === 'inner')
                  while (primary.occupiedOrbits[orbitIndex+1] < primary.hzco)
                    orbitIndex++;
                else
                  while (primary.occupiedOrbits[orbitIndex] < primary.hzco)
                    orbitIndex++;
              }
              solarSystem.preassignedBody({star: solarSystem.primaryStar, body: body, orbitIndex: orbitIndex});
           } else
              solarSystem.primaryStar.totalObjects--;
            orbitIndex++;
          }
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
        solarSystem.calculateScanPoints();
        const text = `${sector.name} ${solarSystem.coordinates} ${solarSystem.primaryStar.textDump(0, '', '', 0, [1])}`;
        fs.writeFileSync(`${outputDir}/${subsector.name}-${solarSystem.coordinates}.txt`, text);
        const json = JSON.stringify(solarSystem.primaryStar, null, 2);
        fs.writeFileSync(`${outputDir}/${subsector.name}-${solarSystem.coordinates}.json`, json);
        fs.writeFileSync(`${outputDir}/${subsector.name}-${solarSystem.coordinates}-travel.html`, solarSystem.travelGrid());
        travellerMap.addSystem(solarSystem);
        scanPoints.push(`${subsector.name} ${solarSystem.coordinates},${solarSystem.scanPoints}`)
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

(async () => {
  const options = commander.opts()
  const sector = yaml.load(fs.readFileSync(options.sector, 'utf8'));

  console.log(`${sector.name}`);

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

  const scanPoints = [];
  let index = 0;
  const travellerMap = new TravellerMap(sector.name);
  travellerMap.X = sector.X;
  travellerMap.Y = sector.Y;
  travellerMap.regions = sector.regions ? sector.regions : [];
  for (const subsector of sector.subsectors) {
    index++;
    travellerMap.subSectors[subsector.index] = subsector.name;
    generateSubsector(outputDir, sector, subsector, index, travellerMap, scanPoints);
  }
  fs.writeFileSync(`${outputDir}/systems.csv`, travellerMap.systemDump());
  fs.writeFileSync(`${outputDir}/referee-systems.csv`, travellerMap.systemDump(true));
  fs.writeFileSync(`${outputDir}/meta.xml`, travellerMap.metaDataDump());
  fs.writeFileSync(`${outputDir}/scanPoints.csv`, scanPoints.join('\n'));
  await createMap({
    systems: travellerMap.systemDump(true),
    meta: travellerMap.metaDataDump(),
    mapDir: refereeMapDir,
    sectorName: sector.name,
    forReferee: true
  });
  await createMap({
    systems: travellerMap.systemDump(),
    meta: travellerMap.metaDataDump(),
    mapDir: mapDir,
    sectorName: sector.name,
    forReferee: false
  });
  console.log('done');
})()
.then(() => process.exit(0))
.catch(err => {
  console.log(err.stack);
  process.exit(0);
});
