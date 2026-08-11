const { twoD6, randomInt } = require('../dice');

const rollGovernmentCode = (populationCode, { allowCaptiveGovernment = true, governmentTypes } = {}) => {
  const isPermitted = (code) => !governmentTypes || governmentTypes.includes(code);

  let code;
  let attempts = 0;
  do {
    code = Math.max(twoD6() - 7 + populationCode, 0);
    attempts++;
  } while (((code === 6 && !allowCaptiveGovernment) || !isPermitted(code)) && attempts < 100);

  if (!isPermitted(code) && governmentTypes?.length) {
    code = governmentTypes[randomInt(0, governmentTypes.length - 1)];
  }

  return code;
};

module.exports = { rollGovernmentCode };