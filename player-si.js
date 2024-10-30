const commander= require('commander');
const fs= require('fs');
const path = require("path");
const yaml = require('js-yaml');

commander
  .version('1', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-s, --sectors <dir>', 'Path to the outputted sector data', 'sectors')
  .parse(process.argv);

;(async () => {
  const options = commander.opts();
  let indexes = [];
  fs.readdirSync(options.sectors).forEach((sectorDir) => {
    const dirPath = path.join(options.sectors, sectorDir);
    if (!fs.statSync(dirPath).isDirectory())
      return;
    if (sectorDir.includes('maps'))
      return;
    const fullPath = path.join(dirPath, 'surveyIndex.yaml');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const data = yaml.load(fileContents);
    indexes.push(data);
  });

  fs.writeFileSync(`${options.sectors}/surveyIndexes.json`, JSON.stringify(indexes, null, 2));
})()
.then(() => process.exit(0))
.catch(err => {
  console.log(err.stack);
  process.exit(0);
});
