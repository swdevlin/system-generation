const fs = require('fs');
const path = require('path');
const commander= require('commander');
const { execSync } = require('child_process');
const yaml = require("js-yaml");

const sectorsDir = './sectors';
const outputDir = './output/maps';

const generateScript = './generate.js';

const svgName = (yamlName) => {
  const yfile = path.join(sectorsDir, yamlName);
  const sector = yaml.load(fs.readFileSync(yfile, 'utf8'));
  return `${sector.name}.svg`;
}

commander
  .version('0.0.1', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-f, --force', 'Generate even if not new', false)
  .parse(process.argv);

const options = commander.opts();

fs.readdirSync(sectorsDir).forEach((yamlFile) => {
  if (yamlFile.endsWith('.yaml')) {
    const svgFile = path.join(outputDir, svgName(yamlFile));

    let needToGenerate = true;
    if (fs.existsSync(svgFile) && !options.force) {
      const yamlFileStats = fs.statSync(path.join(sectorsDir, yamlFile));
      const svgFileStats = fs.statSync(svgFile);
      needToGenerate = yamlFileStats.mtime > svgFileStats.mtime;
    }

    if (needToGenerate) {
      const command = `node ${generateScript} --sector "${path.join(sectorsDir, yamlFile)}"`;
      execSync(command, { stdio: 'inherit' });
    }
  }
});
