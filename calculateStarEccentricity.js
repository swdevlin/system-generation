const {twoD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const calculateStarEccentricity = (star) => {
  let eccentricity = 0;
  let roll = twoD6() + 2;
  if (roll <= 5)
    eccentricity = r.real(0.0,0.005,true);
  else if (roll <= 7)
    eccentricity = r.real(0.005,0.03,true);
  else if (roll <= 9)
    eccentricity = r.real(0.04,0.09,true);
  else if (roll <= 10)
    eccentricity = r.real(0.1,0.35,true);
  else if (roll <= 11)
    eccentricity = r.real(0.15,0.65,true);
  else
    eccentricity = r.real(0.4,0.90,true);

  return eccentricity;
}

module.exports = calculateStarEccentricity;
