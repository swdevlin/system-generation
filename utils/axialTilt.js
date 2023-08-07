const {AU, orbitToAU, ORBIT_TYPES} = require("./index");
const {twoD6, d6} = require("../dice");
const Random = require("random-js").Random;
const r = new Random();

const axialTilt = () => {
  const roll = twoD6();
  if (roll < 5)
    return r.real(0,0.1);
  else if (roll === 5)
    return r.real(0.2, 1.2);
  else if (roll === 6)
    return r.real(1, 6);
  else if (roll === 7)
    return r.real(7, 12);
  else if (roll < 10)
    return r.real(10, 35);
  else {
    switch(d6()) {
      case 1:
      case 2:
        return r.real(20,70);
      case 3:
        return r.real(40,90);
      case 4:
        return r.real(91,126);
      case 5:
        return r.real(144,180);
      case 6:
        return r.real(130,180);
    }
  }
}


module.exports = axialTilt;
