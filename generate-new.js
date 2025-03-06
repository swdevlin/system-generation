const fs = require('fs');
const path = require('path');
const commander= require('commander');
const { execSync } = require('child_process');
const yaml = require("js-yaml");

const sectorsDir = './sectors';

const generateScript = './generate.js';

const svgName = (yamlName) => {
  const yfile = path.join(sectorsDir, yamlName);
  const sector = yaml.load(fs.readFileSync(yfile, 'utf8'));
  return `${sector.name}.svg`;
}

commander
  .version('0.4', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-o, --output <dir>', 'Directory for the output', 'output')
  .option('-f, --force', 'Generate even if not new', false)
  .option('-e, --exclude <file>', 'path to file of sectors to exclude')
  .parse(process.argv);

const options = commander.opts();
let excludeList = [];

if (options.exclude) {
  try {
    excludeList = fs
      .readFileSync(options.exclude, 'utf8')
      .split('\n')
      .map(line => line.trim());
  } catch (err) {
    console.error("Error reading exclude file:", err.message);
  }
}

fs.readdirSync(sectorsDir).forEach((yamlFile) => {
  if (yamlFile.endsWith('.yaml')) {
    const svgFile = path.join(options.output, 'maps', svgName(yamlFile));

    let needToGenerate = true;
    if (fs.existsSync(svgFile) && !options.force) {
      const yamlFileStats = fs.statSync(path.join(sectorsDir, yamlFile));
      const svgFileStats = fs.statSync(svgFile);
      needToGenerate = yamlFileStats.mtime > svgFileStats.mtime;
    }

    if (needToGenerate && excludeList.length > 0) {
      const sectorName = path.basename(yamlFile, '.yaml');
      needToGenerate = !excludeList.includes(sectorName);
    }

    if (needToGenerate) {
      const command = `node ${generateScript} --output "${options.output}" --sector "${path.join(sectorsDir, yamlFile)}"`;
      execSync(command, { stdio: 'inherit' });
    }
  }
});
