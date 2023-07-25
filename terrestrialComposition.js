const {twoD6} = require("./dice");

const TERRESTRIAL_DENSITY = {
  'Exotic Ice': 0.03,
  'Mostly Ice': 0.18,
  'Mostly Rock': 0.5,
  'Rock and Metal': 0.82,
  'Mostly Metal': 1.15,
  'Compressed Metal': 1.50,
} ;

const terrestrialComposition = (star, planet) => {
  let dm = 0;
  if (planet.size < 5)
    dm -= 1;
  else if (planet.size >= 6 && planet.size <= 9)
    dm += 1;
  else if (planet.size >= 10)
    dm += 3;
  if (planet.orbit <= star.hzco)
    dm += 1;
  if (planet.orbit > star.hzco)
    dm -= Math.ceil(planet.orbit - star.hzco);
  if (star.age > 10)
    dm -= 1;

  const roll = twoD6() + dm;

  if (roll <= -4 )
    return 'Exotic Ice';
  else if (roll <= 2 )
    return 'Mostly Ice';
  else if (roll <= 6 )
    return 'Mostly Rock';
  else if (roll <= 11 )
    return 'Rock and Metal';
  else if (roll <= 14 )
    return 'Mostly Metal';
  else
    return 'Compressed Metal';
};

const terrestrialDensity = (composition) => {
  const roll = twoD6();
  let base = TERRESTRIAL_DENSITY[composition];
  const step = (composition === 'Compressed Metal') ? 0.05 : 0.03;
  return base + step * (roll -2);
};

module.exports = {
  terrestrialComposition: terrestrialComposition,
  terrestrialDensity: terrestrialDensity,
};
