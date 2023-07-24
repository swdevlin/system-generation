const Random = require("random-js").Random;

const rng = new Random();

const ROLL_CACHE = [];

const d6 = () => {
  if (ROLL_CACHE.length)
    return ROLL_CACHE.shift();
  else
    return rng.die(6);
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

module.exports = {
  threeD6: threeD6,
  twoD6: twoD6,
  fluxRoll: fluxRoll,
  d6: d6,
  ROLL_CACHE: ROLL_CACHE,
}
