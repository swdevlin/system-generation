const {toHex} = require("../utils");

const moonTextDump = (moon, spacing) => {
  let description;
  if ( moon.size === 0)
    description = 'Ring';
  else
    description = `Moon X${toHex(moon.size)}${toHex(moon.atmosphere.code)}${toHex(moon.hydrographics.code)}${toHex(moon.populationCode)}${toHex(moon.governmentCode)}${toHex(moon.populationCode)}`;
  return `${' '.repeat(spacing)}${moon.orbit.orbit.toFixed(2)} ${description}\n`;
}

const moonHTMLDump = (moon, additionalClass) => {
  if (additionalClass === undefined)
    additionalClass = '';
  let description;
  if ( moon.size === 0)
    description = 'Ring';
  else
    description = `Moon X${toHex(moon.size)}${toHex(moon.atmosphere.code)}${toHex(moon.hydrographics.code)}${toHex(moon.populationCode)}${toHex(moon.governmentCode)}${toHex(moon.populationCode)}`;
  return [`<li class="moon ${additionalClass}"><span class="orbit">${moon.orbit.orbit.toFixed(2)}</span> <span class="moon">${description}</span>`];
}

module.exports.moonTextDump = moonTextDump;
module.exports.moonHTMLDump = moonHTMLDump;
module.exports.assignMoons = require('./assignMoons');
