'use strict';

const { twoD6, d6, randomInt } = require('../dice');
const { ORBIT_TYPES } = require('./constants');

const calcRotation = (body, starAge, multiplierOverride) => {
  let rotation = 0;
  let r = 0;
  let multiplier = multiplierOverride ?? 4;
  if (
    body.orbitType === ORBIT_TYPES.GAS_GIANT ||
    body.size === 'S' ||
    body.size === 'R' ||
    body.size === 0
  )
    multiplier = 2;
  do {
    r = (twoD6() - 2) * multiplier + 2 + d6();
    rotation += r;
  } while (r > 40 && d6() > 4);
  rotation += Math.floor(starAge / 2);
  const hm = randomInt(0, 59) + randomInt(0, 59) / 60;
  body.rotation = rotation + hm / 60;
};

module.exports = calcRotation;
