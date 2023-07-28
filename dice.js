const Random = require("random-js").Random;

const rng = new Random();

const ROLL_CACHE = [];

const d6 = () => {
  if (ROLL_CACHE.length)
    return ROLL_CACHE.shift();
  else
    return rng.die(6);
}

const d3 = () => {
  return rng.die(3);
}

const d2 = () => {
  return rng.die(2);
}

const fluxRoll = () => {
  return d6() - d6();
}

const threeD6 = () => {
  return d6() + d6() + d6();
}

const twoD6 = () => {
  return d6() + d6();
}

const die = (sides, number=1) => {
  let total = 0;

  for (let i=0; i < number; i++)
    total += rng.die(sides);

  return total;
}

module.exports = {
  die: die,
  d2: d2,
  d3: d3,
  d6: d6,
  twoD6: twoD6,
  threeD6: threeD6,
  fluxRoll: fluxRoll,
  ROLL_CACHE: ROLL_CACHE,
}
