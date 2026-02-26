const {toHex} = require("../utils");

const moonTextDump = (moon, spacing) => {
  let description;
  if ( moon.size === 0)
    description = 'Ring';
  else
    description = `Moon ${moon.starPort}${toHex(moon.size)}${toHex(moon.atmosphere.code)}${toHex(moon.hydrographics.code)}${toHex(moon.population.code)}${toHex(moon.governmentCode)}${toHex(moon.lawLevelCode)}-${toHex(moon.techLevel)}`;
  return `${' '.repeat(spacing)}${moon.satelliteOrbit.orbit.toFixed(2)} ${description}\n`;
}

module.exports = moonTextDump;
