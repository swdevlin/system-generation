const {twoD6} = require("../dice");

const computeBaselineOrbitNumber = (star) => {
  let baselineOrbitNumber;
  let log = `baseline orbit`;

  if (star.baseline >= 1 && star.baseline <= star.totalObjects) {
    const div = (star.hzco < 1.0) ? 100 : 10;
    const roll = twoD6();
    const delta = (roll - 7) / div;

    baselineOrbitNumber = star.hzco + delta;
    log += `, in range ${star.baseline}/${star.totalObjects}`;
    log += `, hzco ${star.hzco}`;
    log += `, roll ${roll}, delta ${(roll - 7)}/${div}=${delta}`;
    log += `, result ${baselineOrbitNumber}`;

  } else if (star.baseline < 1) {
    log += `, baseline < 1 (${star.baseline})`;

    if (star.minimumAllowableOrbit >= 1.0) {
      const roll = twoD6();
      const delta = (roll - 2) / 10;

      baselineOrbitNumber = star.hzco - star.baseline + star.totalObjects + delta;
      log += `, minOrbit >= 1.0 (${star.minimumAllowableOrbit})`;
      log += `, hzco ${star.hzco} - baseline ${star.baseline} + objects ${star.totalObjects}`;
      log += `, roll ${roll}, delta ${(roll - 2)}/10=${delta}`;
      log += `, result ${baselineOrbitNumber}`;

    } else {
      const roll = twoD6();
      const delta = (roll - 2) / 100;

      baselineOrbitNumber = star.minimumAllowableOrbit - star.baseline / 10 + delta;
      log += `, minOrbit < 1.0 (${star.minimumAllowableOrbit})`;
      log += `, minOrbit ${star.minimumAllowableOrbit} - baseline/10 (${star.baseline / 10})`;
      log += `, roll ${roll}, delta ${(roll - 2)}/100=${delta}`;
      log += `, result ${baselineOrbitNumber}`;
    }

  } else if (star.baseline > star.totalObjects) {
    log += `, baseline > objects (${star.baseline} > ${star.totalObjects})`;

    if (star.hzco - star.baseline + star.totalObjects >= 1.0) {
      const roll = twoD6();
      const delta = (roll - 7) / 5;

      baselineOrbitNumber = star.hzco - star.baseline + star.totalObjects + delta;
      log += `, hzco - baseline + objects >= 1.0`;
      log += `, hzco ${star.hzco} - baseline ${star.baseline} + objects ${star.totalObjects}`;
      log += `, roll ${roll}, delta ${(roll - 7)}/5=${delta}`;
      log += `, result ${baselineOrbitNumber}`;

    } else {
      const roll = twoD6();
      const delta = (roll - 7) / 5;

      baselineOrbitNumber = star.hzco - (star.baseline + star.totalObjects + delta) / 10;
      log += `, hzco - baseline + objects < 1.0`;
      log += `, hzco ${star.hzco} - (baseline ${star.baseline} + objects ${star.totalObjects} + ${delta})/10`;
      log += `, roll ${roll}, delta ${(roll - 7)}/5=${delta}`;
      log += `, result ${baselineOrbitNumber}`;
    }

    if (baselineOrbitNumber < 0) {
      const clamped = Math.max(
        star.hzco - 0.1,
        star.minimumAllowableOrbit + star.totalObjects / 100
      );
      log += `, clamp < 0, result ${clamped}`;
      baselineOrbitNumber = clamped;
    }
  }

  star.buildLog.push({ baselineOrbitNumber: log });
  return baselineOrbitNumber;
};

module.exports = computeBaselineOrbitNumber;
