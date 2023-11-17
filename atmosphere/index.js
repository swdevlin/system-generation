const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;

const files = fs.readdirSync(directoryPath);

files
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const moduleName = path.parse(file).name;
    module.exports[moduleName] = require(`./${file}`);
  });
