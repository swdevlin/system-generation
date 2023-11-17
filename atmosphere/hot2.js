const {twoD6, d6} = require("../dice");
const Atmosphere = require("./Atmosphere");
const typeChange = require("./typeChange");

const hot2 = (orbitOffset, planetSize) => {
  const atmosphere = new Atmosphere();

  const roll = twoD6() - 7 + planetSize;

  if (roll < 2)
    return atmosphere;

  if (roll < 4)
    atmosphere.code = 1;
  else if (roll === 4) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Very Thin';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset < -2)
      typeChange(atmosphere, 0);
  } else if (roll === 5) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Thin';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset < -2)
      typeChange(atmosphere, 0);
  } else if (roll === 6) {
    atmosphere.code = 10;
    atmosphere.characteristic = '';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset < -2)
      typeChange(atmosphere, 0);
  } else if (roll === 7) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Dense';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset < -2)
      typeChange(atmosphere, 1);
  } else if (roll === 8) {
    atmosphere.code = 10;
    atmosphere.characteristic = 'Very Dense';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset < -2)
      typeChange(atmosphere, 1);
  }
  else if (roll < 12 || roll === 13)
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

module.exports = hot2;
