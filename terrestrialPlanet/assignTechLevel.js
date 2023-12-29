const {d6} = require("../dice");

function techLevelDMs(planet) {
  let dm = 0;
  if (planet.size < 2)
    dm += 2;
  else if (planet.size <= 4)
    dm += 1;

  if (planet.atmosphere.code <=3)
    dm += 1;
  else if (planet.atmosphere.code >= 10 && planet.atmosphere.code <= 17)
    dm += 1;

  if (planet.hydrographics.code === 0)
    dm += 1;
  else if (planet.hydrographics.code === 9)
    dm += 1;
  else if (planet.hydrographics.code === 10)
    dm += 2;

  if (planet.populationCode >=1 && planet.populationCode <= 5)
    dm +=1;
  else if (planet.populationCode === 8)
    dm +=1;
  else if (planet.populationCode === 9)
    dm +=2;
  else if (planet.populationCode >= 10)
    dm +=4;

  if (planet.governmentCode === 0)
    dm += 1;
  else if (planet.governmentCode === 5)
    dm += 1;
  else if (planet.governmentCode === 7)
    dm += 2;
  else if (planet.governmentCode === 13)
    dm -= 2;
  else if (planet.governmentCode === 14)
    dm -= 2;

  return dm;
}

function assignTechLevel(planet) {
  planet.techLevel = d6() + techLevelDMs(planet);
}

module.exports = {
  assignTechLevel: assignTechLevel,
  techLevelDMs: techLevelDMs,
};
