const terrestrialCompositionDM = (star, planet) => {
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
    dm -= 1 + Math.floor(planet.orbit - star.hzco);

  if (star.age > 10)
    dm -= 1;

  return dm;
};

module.exports = terrestrialCompositionDM;
