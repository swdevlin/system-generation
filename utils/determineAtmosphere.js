const {twoD6, d6} = require("../dice");
const {toHex} = require("../utils");

const typeChange = (atmosphere, dm) => {
  const roll = d6() + dm;
  if (roll >= 6)
    atmosphere.code = 'C';
  else
    switch (roll) {
      case 1:
        atmosphere.code = 1;
        break;
      case 3:
      case 4:
      case 5:
        atmosphere.code = 'B';
        break;
      default:
        break;
    }
}

const cold3Atmosphere = (orbitOffset, planetSize) => {
  const roll = twoD6() - planetSize;
  const atmosphere = {
    code: 0,
    irritant: false,
    characteristic: '',
  };

  if (roll < 1)
    return atmosphere;

  if (roll < 3)
    atmosphere.code = '1';
  else if (roll === 3) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Thin';
    if (d6() >= 4)
      atmosphere.irritant = true;
  } else if (roll === 4) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Thin';
  } else if (roll === 5) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
  } else if (roll === 6) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
  } else if (roll === 7) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
    atmosphere.irritant = true;
  } else if (roll === 8) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Dense';
  } else if (roll === 9) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Dense';
    atmosphere.irritant = true;
  } else if (roll === 10) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Dense';
    if (d6() >= 4)
      atmosphere.irritant = true;
  } else if (roll === 11)
    atmosphere.code = 'B';
  else if (roll === 12)
    atmosphere.code = 'C';
  else if (roll === 13)
    atmosphere.code = 'G';
  else if (roll === 14 || roll === 16 || roll >= 17)
    atmosphere.code = 'H';
  else if (roll === 15)
    atmosphere.code = 'F';

  return atmosphere;
}

const cold1Atmosphere = (orbitOffset, planetSize) => {
  const roll = twoD6() - planetSize;
  const atmosphere = {
    code: 0,
    irritant: false,
    characteristic: '',
  };

  if (roll < 1)
    return atmosphere;

  if (roll < 3)
    atmosphere.code = '1';
  else if (roll === 3) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Thin';
    if (d6() >= 4)
      atmosphere.irritant = true;
  } else if (roll === 4) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Thin';
  } else if (roll === 5) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
  } else if (roll === 6) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
  } else if (roll === 7) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
    atmosphere.irritant = true;
  } else if (roll === 8) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Dense';
  } else if (roll === 9) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Dense';
    atmosphere.irritant = true;
  } else if (roll === 10) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Dense';
    if (d6() >= 4)
      atmosphere.irritant = true;
  } else if (roll === 11)
    atmosphere.code = 'B';
  else if (roll === 12)
    atmosphere.code = 'C';
  else if (roll === 13)
    atmosphere.code = 'D';
  else if (roll === 14)
    atmosphere.code = 'B';
  else if (roll === 15)
    atmosphere.code = 'F';
  else if (roll === 16)
    atmosphere.code = 'G';
  else
    atmosphere.code = 'H';

  return atmosphere;
}

const hot2Atmosphere = (orbitOffset, planetSize) => {
  const roll = twoD6() - planetSize;
  const atmosphere = {
    code: 0,
    irritant: false,
    characteristic: '',
  };
  if (roll < 2)
    return atmosphere;

  if (roll < 4)
    atmosphere.code = 1;
  else if (roll === 4) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Thin';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset <= 3)
      typeChange(atmosphere, 0);
  } else if (roll === 5) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Thin';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset <= 3)
      typeChange(atmosphere, 0);
  } else if (roll === 6) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset <= 3)
      typeChange(atmosphere, 0);
  } else if (roll === 7) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Dense';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset <= 3)
      typeChange(atmosphere, 1);
  } else if (roll === 8) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Dense';
    if (d6() >= 4)
      atmosphere.irritant = true;
    if (orbitOffset <= 3)
      typeChange(atmosphere, 1);
  }
  else if (roll < 12 || roll === 13)
    atmosphere.code = 'B';
  else if (roll === 12 || roll === 14)
    atmosphere.code = 'C';
  else if (roll === 15)
    atmosphere.code = 'F';
  else if (roll === 16)
    atmosphere.code = 'G';
  else
    atmosphere.code = 'H';

  return atmosphere;
}

const hot1Atmosphere = (orbitOffset, planetSize) => {
  const roll = twoD6() - planetSize;
  const atmosphere = {
    code: 0,
    irritant: false,
    characteristic: '',
  };
  if (roll < 1)
    return atmosphere;

  if (roll === 1)
    atmosphere.code = 1;
  else if (roll === 2) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Thin';
    atmosphere.irritant = true;
  } else if (roll === 3) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Thin';
  } else if (roll === 4) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Thin';
    atmosphere.irritant = true;
  } else if (roll === 5) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Thin';
  } else if (roll === 6) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
  } else if (roll === 7) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Standard';
    atmosphere.irritant = true;
  } else if (roll === 8) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Dense';
  } else if (roll === 9) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Dense';
    atmosphere.irritant = true;
  } else if (roll === 10) {
    atmosphere.code = 'A';
    atmosphere.characteristic = 'Very Dense';
    if (d6() >= 4)
      atmosphere.irritant = true;
  } else if (roll === 11 || roll === 13)
    atmosphere.code = 'B';
  else if (roll === 12 || roll === 14)
    atmosphere.code = 'C';
  else if (roll === 15)
    atmosphere.code = 'F';
  else if (roll === 16)
    atmosphere.code = 'G';
  else
    atmosphere.code = 'H';

  return atmosphere;
}

determineAtmosphere = (star, planet) => {
  if (planet.size === 'R' || planet.size === 'S' || planet.size < 2)
    return {
      code: 0,
      irritant: false,
      characteristic: '',
    };
  const orbitOffset = planet.orbit - star.hzco;
  if (orbitOffset < -2)
    return hot2Atmosphere(orbitOffset, planet.size);
  else if (orbitOffset < -1)
    return hot1Atmosphere(orbitOffset, planet.size);
  else if (orbitOffset > 2)
    return cold3Atmosphere(orbitOffset, planet.size);
  else if (orbitOffset > 1)
    return cold1Atmosphere(orbitOffset, planet.size);
  else {
    const roll = twoD6() - 7 + planet.size;
    return {
      code: Math.max(roll, 0),
      irritant: false,
      characteristic: '',
    };
  }
}

module.exports = determineAtmosphere;
