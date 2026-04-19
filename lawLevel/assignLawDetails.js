const { twoD6 } = require('../dice');

const assignLawDetails = (planet) => {
  let roll = twoD6();

  if (planet.techLevel === 0) roll += 4;
  else if (planet.techLevel <= 2) roll += 2;

  if (planet.government.code === 13 || planet.government.code === 14) roll += 4;
  else {
    switch (planet.government.code) {
      case 1:
        roll -= 2;
        break;
      case 8:
        roll += 4;
        break;
      case 9:
        roll += 4;
        break;
      case 10:
        roll += 4;
        break;
      case 11:
        roll += 4;
        break;
      case 12:
        roll += 4;
        break;
      case 15:
        roll += 4;
        break;
    }
    if (planet.lawLevel.code >= 10) roll -= 4;
  }

  if (roll <= 5) planet.lawLevel.judicialSystem = 'I';
  else if (roll <= 8) planet.lawLevel.judicialSystem = 'A';
  else planet.lawLevel.judicialSystem = 'T';

  if (planet.lawLevel.judicialSystem !== 'I')
    if (twoD6() + planet.lawLevel.code >= 12)
      planet.lawLevel.econometricInfractionsAdministrative = true;
};

module.exports = { assignLawDetails };
