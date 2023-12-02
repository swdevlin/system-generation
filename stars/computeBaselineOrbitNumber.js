const {twoD6} = require("../dice");

const computeBaselineOrbitNumber = (star) => {
  let baselineOrbitNumber;
  if (star.baseline >= 1 && star.baseline <= star.totalObjects) {
    const div = (star.hzco < 1.0) ? 100 : 10;
    baselineOrbitNumber = star.hzco + (twoD6() - 7) / div;
  } else if (star.baseline < 1) {
    if (star.minimumAllowableOrbit >= 1.0)
      baselineOrbitNumber = star.hzco - star.baseline + star.totalObjects + (twoD6() - 2) / 10;
    else
      baselineOrbitNumber = star.minimumAllowableOrbit - star.baseline / 10 + (twoD6() - 2) / 100;
  } else if (star.baseline > star.totalObjects) {
    if (star.hzco - star.baseline + star.totalObjects >= 1.0)
      baselineOrbitNumber = star.hzco - star.baseline + star.totalObjects + (twoD6() - 7) / 5;
    else
      baselineOrbitNumber = star.hzco - (star.baseline + star.totalObjects + (twoD6() - 7) / 5) / 10;
    if (baselineOrbitNumber < 0)
      baselineOrbitNumber = Math.max(star.hzco - 0.1, star.minimumAllowableOrbit + star.totalObjects / 100);
  }
  return baselineOrbitNumber;
};

module.exports = computeBaselineOrbitNumber;
