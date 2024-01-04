const {toHex} = require("../utils");

const moonTextDump = (moon, spacing) => {
  let description;
  if ( moon.size === 0)
    description = 'Ring';
  else
    description = `Moon X${toHex(moon.size)}${toHex(moon.atmosphere.code)}${toHex(moon.hydrographics.code)}${toHex(moon.population.code)}${toHex(moon.governmentCode)}${toHex(moon.lawLevelCode)}`;
  return `${' '.repeat(spacing)}${moon.orbit.orbit.toFixed(2)} ${description}\n`;
}

module.exports = moonTextDump;
