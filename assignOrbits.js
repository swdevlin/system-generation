const {shuffleArray} = require("./utils");

const assignOrbits = (solarSystem) => {
  for (const star of solarSystem.stars)
    star.assignOrbits();

  let allOrbits = [];
  for (const star of solarSystem.stars) {
    let starOrbits = [...Array(star.orbitNumbers.length).keys()].map(x => [star, x])
    shuffleArray(starOrbits);
    for (let i=0; i < star.emptyOrbits; i++)
      starOrbits.pop();
    allOrbits = allOrbits.concat(starOrbits);
  }
  shuffleArray(allOrbits);

  for (let i=0; i < solarSystem.gasGiants; i++) {
    const p = allOrbits.pop();
    solarSystem.addGasGiant(p[0], p[1]);
  }

  for (let i=0; i < solarSystem.planetoidBelts; i++) {
    const p = allOrbits.pop();
    solarSystem.addPlanetoidBelt(p[0], p[1]);
  }

  for (let i=0; i < solarSystem.terrestrialPlanets; i++) {
    const p = allOrbits.pop();
    if (p === undefined)
      console.log('not enough orbits');
    solarSystem.addTerrestrialPlanet(p[0], p[1]);
  }

}

module.exports = {
  assignOrbits: assignOrbits,
};
