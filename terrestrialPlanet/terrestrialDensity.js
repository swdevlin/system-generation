const {Random} = require("random-js");
const r = new Random();

const TERRESTRIAL_DENSITY = {
  'Exotic Ice': 0.03,
  'Mostly Ice': 0.18,
  'Mostly Rock': 0.5,
  'Rock and Metal': 0.82,
  'Mostly Metal': 1.15,
  'Compressed Metal': 1.50,
} ;

const terrestrialDensity = (composition) => {
  let base = TERRESTRIAL_DENSITY[composition];
  const step = (composition === 'Compressed Metal') ? 0.05 : 0.03;
  return base + r.real(-1* step, step);
};

module.exports =  terrestrialDensity;

