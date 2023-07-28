const {twoD6} = require("../dice");

const Random = require("random-js").Random;
const r = new Random();

const eccentricity = (dm) => {
  let ecc = 0;
  let roll = twoD6() + 2;
  if (roll <= 5)
    ecc = r.real(0.0,0.005,true);
  else if (roll <= 7)
    ecc = r.real(0.005,0.03,true);
  else if (roll <= 9)
    ecc = r.real(0.04,0.09,true);
  else if (roll <= 10)
    ecc = r.real(0.1,0.35,true);
  else if (roll <= 11)
    ecc = r.real(0.15,0.65,true);
  else
    ecc = r.real(0.4,0.90,true);

  return ecc;
}

module.exports = eccentricity;
