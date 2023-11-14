const generateBaseStar = require("./generateBaseStar");
const multiStellarBase = require("./multiStellarBase");
const {ORBIT_TYPES} = require("../utils");

const generateStar = (primary, dm, orbitType) => {
  if (orbitType === ORBIT_TYPES.COMPANION)
    return generateBaseStar(dm, ORBIT_TYPES.COMPANION);
  else if (orbitType === ORBIT_TYPES.PRIMARY)
    return generateBaseStar(dm, ORBIT_TYPES.PRIMARY);
  else
    return multiStellarBase(primary, orbitType);
};

module.exports = generateStar;
