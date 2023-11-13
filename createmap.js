const commander= require('commander');
const fs= require('fs');
const {createMap} = require("./travellerMap");


// noinspection HtmlDeprecatedTag,XmlDeprecatedElement
commander
  .version('0.0.1', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-s, --sectordir <dir>', 'Path to the sector data', '')
  .option('-n, --name <dir>', 'Name of the sector', '')
  .option('-o, --mapdir <dir>', 'Directory for the generated map', 'output/maps')
  .parse(process.argv);

;(async () => {
  const options = commander.opts()
  const systems = fs.readFileSync(`${options.sectordir}/${options.name}/systems.csv`, 'utf8');
  const meta = fs.readFileSync(`${options.sectordir}/${options.name}/meta.xml`, 'utf8');
  await createMap(systems, meta, options.mapdir, options.name);
})()
.then(() => process.exit(0))
.catch(err => {
  console.log(err.stack);
  process.exit(0);
});
