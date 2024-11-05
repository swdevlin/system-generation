const Random = require("random-js").Random;

const rng = new Random();

const ROLL_CACHE = [];

const DICE_LOG = [];

const logIt = (r) => {
  DICE_LOG.push(r);
  while (DICE_LOG.length > 10) {
    DICE_LOG.shift();
  }
}

const d6 = () => {
  let r;
  if (ROLL_CACHE.length)
    r = ROLL_CACHE.shift();
  else
    r = rng.die(6);
  logIt(r);
  return r;
}

const d3 = () => {
  return rng.die(3);
}

const d4 = () => {
  return rng.die(4);
}

const d10 = () => {
  return rng.die(10);
}

const d8 = () => {
  return rng.die(8);
}

const d100 = () => {
  return rng.die(100);
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

const percentageChance = (p) => {
  return rng.bool(p);
}

const randomInt = (min, max) => {
  return rng.integer(min, max);
}

const clearCache = () => {
  ROLL_CACHE.length = 0;
}

module.exports = {
  die: die,
  d2: d2,
  d3: d3,
  d4: d4,
  d6: d6,
  d8: d8,
  d10: d10,
  d100: d100,
  twoD6: twoD6,
  threeD6: threeD6,
  fluxRoll: fluxRoll,
  percentageChance: percentageChance,
  randomInt: randomInt,
  ROLL_CACHE: ROLL_CACHE,
  clearCache: clearCache,
  DICE_LOG: DICE_LOG,
}
