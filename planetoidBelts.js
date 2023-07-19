const {twoD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const planetoidBeltQuantity = (solarSystem) => {
  let planetoidBelts = 0;
  if (twoD6() >= 8) {
    let dm = 0;
    if (solarSystem.gasGiants > 0)
      dm += 1;
    if (solarSystem.starCount > 2)
      dm += 1;

    const roll = twoD6() + dm;
    if (roll <= 6 )
      planetoidBelts = 1;
    else if (roll <= 11 )
      planetoidBelts = 2;
    else
      planetoidBelts = 3;
  }
  return planetoidBelts;
}

module.exports = {
  planetoidBeltQuantity: planetoidBeltQuantity,
};
