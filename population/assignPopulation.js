const {d3, twoD6} = require("../dice");
const {assignConcentrationRating} = require("./assignConcentrationRating");

// page 147
const assignPopulation = (star, planet) => {
  if (planet.nativeSophont)
    planet.population.code = d3() + d3() + 4;
  else
    planet.population.code = twoD6() - 2;
  assignConcentrationRating(star, planet);
};

module.exports = assignPopulation;
