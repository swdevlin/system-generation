const {twoD6, threeD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const gasGiantQuantity = (solarSystem) => {
  let gasGiants = 0;
  let dm;
  if (r.die(6) > 1) {
    if (solarSystem.stars.length === 1 && solarSystem.primaryStar.stellarClass === 'V')
      dm = 1;
    else if (solarSystem.starCount > 3)
      dm = -1;
    else
      dm = 0;

    const roll = twoD6() + dm;
    if (roll <= 4 )
      gasGiants = 1;
    else if (roll <= 6 )
      gasGiants = 2;
    else if (roll <= 8 )
      gasGiants = 3;
    else if (roll <= 11 )
      gasGiants = 4;
    else if (roll <= 12 )
      gasGiants = 5;
    else
      gasGiants = 6;
  }
  return gasGiants;
}

const addGasGiant = (star, orbit_index, primary) => {
  let roll = r.integer(1,6);
  if (star.spread < 0.1)
    roll -= 1;
  if (primary.stellarType ==='M' && primary.stellarClass === 'V')
    roll -= 1;
  else if (primary.stellarClass === 'VI')
    roll -= 1;
  else if (['L', 'T', 'Y'].includes(primary.stellarType))
    roll -= 1;
  let gg = {
  }
  if (roll <= 2)
    gg = {
      code: 'GS',
      diameter: r.die(3) + r.die(3),
      mass: r.integer(2,7) * 5,
    }
  else if (roll < 5)
    gg = {
      code: 'GM',
      diameter: r.die(6) + 6,
      mass: 20*(threeD6()-1),
    }
  else
    gg = {
      code: 'GL',
      diameter: twoD6()+6,
      mass: r.die(3)*50*(threeD6()+4),
    }
  if (gg.mass >= 3000)
    gg.mass = 4000-200*(twoD6()-2);
  gg.orbit = star.availableorbit_index;
};

module.exports = {
  gasGiantQuantity: gasGiantQuantity,
  addGasGiant: addGasGiant,
};
