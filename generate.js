require('dotenv').config();
const commander= require('commander');
const yaml= require('js-yaml');
const fs= require('fs');
const createMap = require("./travellerMap/createMap");
const computeStats = require("./solarSystems/computeStats");
const refereeReference = require("./solarSystems/refereeReference");
const toJSON = require("./utils/toJSON");
const knex = require("./db/connection");
const generateSector = require("./sector/generateSector");
const {sectorHexToUniversal} = require("./utils/hexAddress");

const dumpStats = async (sector, outputDir) => {
  const stats = computeStats(sector);
  fs.writeFileSync(`${outputDir}/stats.yaml`, yaml.dump(stats));
}

const dumpRefereeReference = async (sector, outputDir) => {
  const reference = refereeReference(sector);
  fs.writeFileSync(`${outputDir}/referee.csv`, reference.join('\n'));

  let asJson = toJSON(sector);
  asJson = JSON.stringify(asJson, null, 2);
  fs.writeFileSync(`${outputDir}/${sector.name}.json`, asJson);
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


const saveRegions = async (sector) => {
  if (!sector.regions)
    return;
  for (const region of sector.regions) {
    const universalAddress = sectorHexToUniversal(sector, region.LabelPosition);
    let r = await knex('region')
      .where('name', region.Label)
      .first();

    if (!r) {
      const [n] = await knex('region')
        .insert({
          name: region.Label,
            colour: region.HexColour,
            label_x: universalAddress.x,
            label_y: universalAddress.y,
            hexes: '[]'
          }).returning('id');

        r = await knex('region').select()
          .where('id', n.id)
          .first();
    }

    const hexes = [];
    for (const h of region.hexes)
      hexes.push(sectorHexToUniversal(sector, h));

    await knex('region').where('id', r.id).update({
      label_x: universalAddress.x,
      label_y: universalAddress.y,
      colour: region.HexColour,
      hexes: JSON.stringify(hexes)
    });
  }
};


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

  const {mapDir, refereeMapDir, outputDir} = createAndEmptySectorDirectories(
    options.output,
    sector.name
  );

  const travellerMap = await generateSector(sector, outputDir);

  for (const solar_system of sector.solarSystems) {
    await knex('solar_system').insert({
      sector_id: db_sector.id,
      x: solar_system.x,
      y: solar_system.y,
      origin_x: sector.X * 32 + solar_system.x - 1,
      origin_y: sector.Y * 40 - solar_system.y + 1,
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
      allegiance: solar_system.allegiance,
    });
  }

  await saveRegions(sector);

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
