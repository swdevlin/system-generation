const {twoD6} = require("../dice");
const {Random} = require("random-js");
const Atmosphere = require("./Atmosphere");
const hot2 = require("./hot2");
const hot1 = require("./hot1");
const cold3 = require("./cold3");
const cold1 = require("./cold1");

const r = new Random();

// Page 78
determineAtmosphere = (star, planet) => {
  let atmo;
  if (planet.size === 'R' || planet.size === 'S' || planet.size < 2) {
    atmo = new Atmosphere();
  } else {
    const orbitOffset = planet.orbit - star.hzco;
    if (orbitOffset < -2)
      atmo = hot2(orbitOffset, planet.size);
    else if (orbitOffset < -1)
      atmo = hot1(orbitOffset, planet.size);
    else if (orbitOffset > 2)
      atmo = cold3(orbitOffset, planet.size);
    else if (orbitOffset > 1)
      atmo = cold1(orbitOffset, planet.size);
    else {
      const roll = twoD6() - 7 + planet.size;
      atmo = new Atmosphere();
      atmo.code = Math.max(roll, 0);
    }
  }

  switch (atmo.code) {
    case 1: atmo.bar = r.real(0.0, 0.0009, true); break;
    case 2:
    case 3: atmo.bar = r.real(0.1, 0.42, true); break;
    case 4:
    case 5: atmo.bar = r.real(0.43, 0.7, true); break;
    case 6:
    case 7: atmo.bar = r.real(0.7, 1.49, true); break;
    case 8:
    case 9: atmo.bar = r.real(1.5, 2.49, true); break;
    case 13: atmo.bar = r.real(2.5, 10, true); break;
    case 14: atmo.bar = r.real(0.1, 0.42, true); break;
    case 16: atmo.bar = 100; break;
    case 17: atmo.bar = 1000; break;
    default: atmo.bar = 0;
  }
  return atmo;
}

module.exports = determineAtmosphere;
