const { d6, twoD6, d3} = require('../dice');


// WBH 163
function systemOfJustice(planet) {
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
}

// WBH 164
const uniformityOfLaw = (planet) => {
  let roll = d6();
  if (planet.government.code === 3 || planet.government.code === 5 || planet.government.code >= 10)
    roll -= 1;
  else if (planet.government.code === 2)
    roll += 1;

  if (roll <= 2)
    planet.lawLevel.uniformity = 'P';
  else if (roll === 3)
    planet.lawLevel.uniformity = 'T';
  else
    planet.lawLevel.uniformity = 'U';
}

// WBH 164
const presumptionOfInnocence = (planet) => {
  let roll = twoD6();
  if (planet.lawLevel.judicialSystem === 'A')
    roll -= 2;
  roll -= planet.lawLevel.code;

  planet.lawLevel.presumedInnocence = roll >= 0;
}

// WBH 165
const deathPenalty = (planet) => {
  let roll = twoD6();
  if (planet.government.code === 0)
    roll -= 4;
  else if(planet.government.code >= 9)
    roll += 4;

  planet.lawLevel.deathPenalty = roll >= 8;
};

// WBH 165
const weaponsAndArmour = (planet) => {
  let roll = planet.lawLevel.code + d3() + d3() - 4;
  if (planet.population.concentration <= 3)
    roll -= 1;
  else if (planet.population.concentration > 8)
    roll += 1;

  planet.lawLevel.weaponsAndArmour = roll;
};

// WBH 165
const economicLaw = (planet) => {
  let roll = planet.lawLevel.code + d3() + d3() - 4;

  switch (planet.government.code) {
    case 0: roll -= 2; break;
    case 1: roll += 2; break;
    case 2: roll -= 1; break;
    case 9: roll += 1; break;
  }

  planet.lawLevel.economicLaw = roll;
};

// WBH 166
const criminalLaw = (planet) => {
  let roll = planet.lawLevel.code + d3() + d3() - 4;

  if (planet.lawLevel.judicialSystem === 'I')
    roll += 1;

  planet.lawLevel.criminalLaw = roll;
};

// WBH 166
const privateLaw = (planet) => {
  let roll = planet.lawLevel.code + d3() + d3() - 4;
  switch (planet.government.code) {
    case 3:
    case 5:
    case 12:
      roll -=1;
      break;
  }
  planet.lawLevel.privateLaw = roll;
};

// WBH 167
const personalRights = (planet) => {
  let roll = planet.lawLevel.code + d3() + d3() - 4;
  switch (planet.government.code) {
    case 0: roll -= 1; break;
    case 1: roll += 2; break;
    case 2: roll -= 1; break;
  }

  planet.lawLevel.personalRights = roll;
};

// WBH 163
const assignLawDetails = (planet) => {
  systemOfJustice(planet);
  uniformityOfLaw(planet);
  presumptionOfInnocence(planet);
  deathPenalty(planet);

  weaponsAndArmour(planet);
  economicLaw(planet);
  criminalLaw(planet);
  privateLaw(planet);
  personalRights(planet);
};

module.exports = { assignLawDetails };
