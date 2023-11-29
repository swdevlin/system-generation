const {STELLAR_TYPES} = require("../utils");
const TEMPERATURE = {
  'O0': 50000,
  'O5': 40000,
  'B0': 30000,
  'B5': 15000,
  'A0': 10000,
  'A5': 8000,
  'F0': 7500,
  'F5': 6500,
  'G0': 6000,
  'G5': 5600,
  'K0': 5200,
  'K5': 4400,
  'M0': 3700,
  'M5': 3000,
  'M9': 2400,
  'L0': 2400,
  'L5': 1850,
  'T0': 1300,
  'T5': 900,
  'Y0': 550,
  'Y5': 300,
}

const starTemperature = (star) => {
  if (star.stellarType === STELLAR_TYPES.WhiteDwarf) {
    if (star.mass < 0.1)
      return 100000;
    else if (star.mass < 0.5)
      return 25000;
    else if (star.mass < 1)
      return 10000;
    else if (star.mass < 1.5)
      return 8000;
    else if (star.mass < 2.5)
      return 7000;
    else if (star.mass < 5)
      return 5500;
    else if (star.mass < 10)
      return 5000;
    else if (star.mass < 13)
      return 4000;
    else
      return 3800;
  } else if (!star.isAnomaly) {
    return TEMPERATURE[star.dataKey];
  } else
    return null;
}

module.exports = starTemperature;
