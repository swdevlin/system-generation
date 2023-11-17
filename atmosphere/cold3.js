const {twoD6, d6} = require("../dice");
const Atmosphere = require("./Atmosphere");

const cold3 = (orbitOffset, planetSize) => {
  const roll = twoD6() - 7 + planetSize;
  const atmosphere = new Atmosphere();

  if (roll < 1)
    return atmosphere;

  if (roll < 3)
    atmosphere.code = 1;
  else if (roll === 3) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Very Thin';
    if (d6() >= 4)
      atmosphere.irritant = true;
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
  } else if (roll === 11)
    atmosphere.code = 11;
  else if (roll === 12)
    atmosphere.code = 12;
  else if (roll === 13) {
    atmosphere.code = 16;
    atmosphere.gasType = 'Helium';
  } else if (roll === 14 || roll === 16 || roll >= 17) {
    atmosphere.code = 17;
    atmosphere.gasType = 'Hydrogen';
  } else if (roll === 15)
    atmosphere.code = 15;

  return atmosphere;
}

module.exports = cold3;
