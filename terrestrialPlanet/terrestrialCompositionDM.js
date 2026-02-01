const terrestrialCompositionDM = (star, planet) => {
  let dm = 0;
  if (planet.size < 5)
    dm -= 1;
  else if (planet.size >= 6 && planet.size <= 9)
    dm += 1;
  else if (planet.size >= 10)
    dm += 3;

  if (planet.hzcoDeviation <= 0)
    dm += 1;

  if (planet.hzcoDeviation > 0)
    dm -= 1 + Math.floor(planet.hzcoDeviation);

  if (star.age > 10)
    dm -= 1;

  return dm;
};

module.exports = terrestrialCompositionDM;
