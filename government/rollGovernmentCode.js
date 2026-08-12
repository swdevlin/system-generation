const { twoD6, randomInt } = require('../dice');

const rollGovernmentCode = (populationCode, { allowCaptiveGovernment = true, governmentTypes } = {}) => {
  const allowedTypes = governmentTypes && !allowCaptiveGovernment
    ? governmentTypes.filter((c) => c !== 6)
    : governmentTypes;

  const isValid = (code) =>
    (allowedTypes ? allowedTypes.includes(code) : allowCaptiveGovernment || code !== 6);

  let code;
  let attempts = 0;
  do {
    code = Math.max(twoD6() - 7 + populationCode, 0);
    attempts++;
  } while (!isValid(code) && attempts < 100);

  if (!isValid(code) && allowedTypes) {
    if (!allowedTypes.length) {
      throw new Error('governmentTypes has no code satisfying allowCaptiveGovernment: false');
    }
    code = allowedTypes[randomInt(0, allowedTypes.length - 1)];
  }

  return code;
};

module.exports = { rollGovernmentCode };