const {twoD6, d6} = require("../dice");
const Atmosphere = require("./Atmosphere");

const hot1 = (orbitOffset, planetSize) => {
  const roll = twoD6() - 7 + planetSize;
  const atmosphere = new Atmosphere();
  if (roll < 1)
    return atmosphere;

  if (roll === 1)
    atmosphere.code = 1;
  else if (roll === 2) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Very Thin';
    atmosphere.irritant = true;
  } else if (roll === 3) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Very Thin';
  } else if (roll === 4) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Thin';
    atmosphere.irritant = true;
  } else if (roll === 5) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Thin';
  } else if (roll === 6) {
    atmosphere.code = 10;
    atmosphere.characteristic = '';
  } else if (roll === 7) {
    atmosphere.code = 10;
    atmosphere.characteristic = '';
    atmosphere.irritant = true;
  } else if (roll === 8) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Dense';
  } else if (roll === 9) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Dense';
    atmosphere.irritant = true;
  } else if (roll === 10) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Very Dense';
    if (d6() >= 4)
      atmosphere.irritant = true;
  } else if (roll === 11 || roll === 13)
    atmosphere.code = 11;
  else if (roll === 12 || roll === 14)
    atmosphere.code = 12;
  else if (roll === 15)
    atmosphere.code = 15;
  else if (roll === 16)
    atmosphere.code = 16;
  else
    atmosphere.code = 17;

  return atmosphere;
}

module.exports = hot1;
