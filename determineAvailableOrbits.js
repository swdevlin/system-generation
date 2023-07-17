const determineAvailableOrbits = (parsec) => {
  let minOrbit = parsec.primaryStar.minimumAllowableOrbit;
  let maxOrbit;
  parsec.primaryStar.availableOrbits = [];
  if (parsec.starCount > 1)
    for (const star of parsec.otherStars) {
      maxOrbit = star.orbit - 1.0;
      parsec.primaryStar.availableOrbits.push([minOrbit, maxOrbit]);
      minOrbit = star.orbit + 1.0
    }

  parsec.primaryStar.availableOrbits.push([minOrbit, 20]);
}

module.exports = determineAvailableOrbits;
