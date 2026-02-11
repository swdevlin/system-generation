const commander = require('commander');
const fs = require('fs');
const path = require('path');

commander
  .version('1', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-s, --sectors :dir', 'Path to the outputted sector data', 'sectors')
  .parse(process.argv);

const KEYS_TO_RETAIN = [
  'primaryStar',
  'gasGiants',
  'planetoidBelts',
  'terrestrialPlanets',
  'coordinates',
  'name',
  'scanPoints',
  'starCount',
];
(async () => {
  const options = commander.opts();
  fs.readdirSync(options.sectors).forEach((sectorDir) => {
    const dirPath = path.join(options.sectors, sectorDir);
    if (!fs.statSync(dirPath).isDirectory()) return;
    if (sectorDir.includes('maps')) return;
    console.log(`Extracting ${sectorDir}`);
    const fullPath = path.join(dirPath, `${sectorDir}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(fileContents);
    for (const solarSystem of data.solarSystems) {
      Object.keys(solarSystem).forEach((key) => {
        if (!KEYS_TO_RETAIN.includes(key)) delete solarSystem[key];
      });
    }
    const coreFile = path.join(dirPath, `${sectorDir}-core.json`);

    fs.writeFileSync(coreFile, JSON.stringify(data, null, 2));
  });
  console.log('And done');
})()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err.stack);
    process.exit(0);
  });
