const Random = require("random-js").Random;

const rng = new Random();

const fluxRoll = () => {
  return rng.die(6) - rng.die(6);
}

const threeD6 = () => {
  return rng.die(6) + rng.die(6) + rng.die(6);
}

const twoD6 = () => {
  return rng.die(6) + rng.die(6);
}

module.exports = {
  threeD6: threeD6,
  twoD6: twoD6,
  fluxRoll: fluxRoll,
}
