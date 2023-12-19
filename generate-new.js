const fs = require('fs');
const path = require('path');
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

fs.readdirSync(sectorsDir).forEach((yamlFile) => {
  if (yamlFile.endsWith('.yaml')) {
    const svgFile = path.join(outputDir, svgName(yamlFile));

    let needToGenerate = true;
    if (fs.existsSync(svgFile)) {
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
