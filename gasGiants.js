const {twoD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const gasGiantQuantity = (parsec) => {
  let gasGiants = 0;
  let dm;
  if (r.die(6) > 1) {
    if (parsec.starCount === 1 && parsec.primaryStar.stellarClass === 'V')
      dm = 1;
    else if (parsec.starCount > 3)
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

module.exports = {
  gasGiantQuantity: gasGiantQuantity,
};
