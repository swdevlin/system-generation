const {twoD6, twoD6InRange} = require("../dice");

const Random = require("random-js").Random;
const r = new Random();

const eccentricity = (dm, low = false) => {
  let ecc = 0;
  let roll;
  if (low) {
    roll = twoD6InRange(2, 9) + dm;
    roll = Math.min(roll, 9); // dm can push it back out of range; cap handles that
  } else {
    roll = twoD6() + dm;
  }

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
