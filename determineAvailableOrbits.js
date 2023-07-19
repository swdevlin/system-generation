const {ORBIT_TYPES} = require("./utils");
const determineAvailableOrbits = (solarSystem) => {
  const primary = solarSystem.primaryStar;
  let minOrbit = primary.minimumAllowableOrbit;
  let luminosity = primary.luminosity;
  if (primary.companion) {
    minOrbit = Math.max(minOrbit, 0.5 + primary.companion.eccentricity)
    luminosity += primary.companion.luminosity;
  }

  let maxOrbit;
  primary.availableOrbits = [];
  if (solarSystem.stars.length > 1)
    for (const star of solarSystem.stars) {
      let eccMod = star.eccentricity > 0.2 ? 1 : 0;
      if ((star.orbitType === ORBIT_TYPES.NEAR || star.orbitType === ORBIT_TYPES.CLOSE ) && star.eccentricity > 0.5)
        eccMod++;
      maxOrbit = star.orbit - 1.0 - eccMod;
      primary.availableOrbits.push([minOrbit, maxOrbit]);
      minOrbit = star.orbit + 1.0 + eccMod;
    }

  primary.availableOrbits.push([minOrbit, 20]);

  for (let i=0; i < solarSystem.stars.length; i++) {
    const star = solarSystem.stars[i];
    let minOrbit = star.minimumAllowableOrbit;
    if (star.companion)
      minOrbit = Math.max(minOrbit, 0.5+star.companion.eccentricity)

    maxOrbit = star.orbit - 3.0;
    if (i < solarSystem.stars.length-1 && solarSystem.stars[i+1].orbitType - star.orbitType === 1)
      maxOrbit -= 1;
    else if (i > 0 && star.orbitType - solarSystem.stars[i-1].orbitType === 1)
      maxOrbit -= 1;

    primary.availableOrbits.push([minOrbit, maxOrbit]);
  }

}

module.exports = determineAvailableOrbits;
