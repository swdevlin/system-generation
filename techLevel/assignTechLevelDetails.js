'use strict';

const { twoD6, d6 } = require('../dice');

const {
  isIndustrial,
  isAgricultural,
  isRich,
  isHighPopulation,
  isPoor,
} = require('../economics/assignTradeCodes');
const { starPortTechLevelDMs } = require('../terrestrialPlanet/assignTechLevel');

const techLevelModifiers = () => {
  switch (twoD6()) {
    case 2:
      return -3;
    case 3:
      return -2;
    case 4:
      return -1;
    case 10:
      return 1;
    case 11:
      return 2;
    case 12:
      return 3;
  }
  return 0;
};

const environmentMinTechLevel = (planet) => {
  if (planet.nativeSophont) return 0;
  let minTL = [0];
  switch (planet.atmosphere.code) {
    case 0:
    case 1:
    case 10:
      minTL.push(8);
      break;
    case 2:
    case 3:
    case 13:
    case 14:
      minTL.push(5);
      break;
    case 4:
    case 7:
    case 9:
      minTL.push(3);
      break;
    case 11:
      minTL.push(9);
      break;
    case 12:
      minTL.push(10);
      break;
    case 15:
      minTL.push(8);
      break;
    case 16:
    case 17:
      minTL.push(14);
      break;
  }

  if (planet.habitabilityRating === 0) minTL.push(8);
  else if (planet.habitabilityRating <= 2) minTL.push(5);
  else if (planet.habitabilityRating <= 7) minTL.push(3);

  return Math.min(...minTL);
};

const subTL = (tl, upper, lower) => {
  return Math.floor(Math.min(Math.max(tl, lower), upper));
};

// WBH p.176
const energy = (planet) => {
  let tl = planet.techLevel.highCommonTechLevel + techLevelModifiers();
  if (isIndustrial(planet)) tl += 1;
  if (planet.population.code >= 9) tl += 1;

  planet.techLevel.energy = subTL(tl, planet.techLevel.code * 1.2, planet.techLevel.code / 2);
};

// WBH p.176
const electronics = (planet) => {
  let tl = planet.techLevel.highCommonTechLevel + techLevelModifiers();
  if (isIndustrial(planet)) tl += 1;

  if (planet.population.code <= 5) tl += 1;
  else if (planet.population.code >= 9) tl += -1;

  planet.techLevel.electronics = subTL(
    tl,
    planet.techLevel.energy + 1,
    planet.techLevel.energy - 3
  );
};

// WBH p.176
const manufacturing = (planet) => {
  let tl = planet.techLevel.highCommonTechLevel + techLevelModifiers();

  if (isIndustrial(planet)) tl += 1;

  if (planet.population.code <= 6) tl -= 1;
  else if (planet.population.code >= 8) tl += -1;

  planet.techLevel.manufacturing = subTL(
    tl,
    Math.max(planet.techLevel.energy, planet.techLevel.electronics),
    planet.techLevel.electronics - 2
  );
};

// WBH p.177
const medical = (planet) => {
  let tl = planet.techLevel.electronics + techLevelModifiers();

  if (isRich(planet)) tl += 1;
  if (isPoor(planet)) tl -= 1;

  planet.techLevel.medical = subTL(
    tl,
    planet.techLevel.electronics,
    Math.max(0, starPortTechLevelDMs(planet))
  );
};

// WBH p.177
const environmental = (planet) => {
  let tl = planet.techLevel.manufacturing + techLevelModifiers();

  if (planet.habitabilityRating < 8) tl += 8 - planet.habitabilityRating;

  planet.techLevel.environmental = subTL(tl, planet.techLevel.energy, planet.techLevel.energy - 5);
};

// WBH p.177
const landTransport = (planet) => {
  let tl = planet.techLevel.energy + techLevelModifiers();

  if (planet.hydrographics.code === 10) tl -= 1;
  if (planet.population.concentrationRating <= 2) tl += 1;

  planet.techLevel.landTransport = subTL(
    tl,
    planet.techLevel.energy,
    planet.techLevel.electronics - 5
  );
};

// WBH p.177
const waterTransport = (planet) => {
  let tl = planet.techLevel.energy + techLevelModifiers();

  if (planet.hydrographics.code === 0) tl -= 2;
  else if (planet.hydrographics.code === 8) tl += 1;
  else if (planet.hydrographics.code >= 9) tl += 2;

  if (planet.population.concentrationRating <= 2) tl += 1;

  const lowerBound = planet.hydrographics.code === 0 ? 0 : planet.techLevel.electronics - 5;
  planet.techLevel.waterTransport = subTL(tl, planet.techLevel.energy, lowerBound);
};

// WBH p.177
const airTransport = (planet) => {
  let tl = planet.techLevel.energy + techLevelModifiers();
  if (planet.atmosphere.code === 0 && planet.techLevel.code <= 5) tl = 0;

  let dm = 0;
  if (isIndustrial(planet)) dm += 1;
  if (isAgricultural(planet)) dm -= 1;
  planet.techLevel.airTransport = subTL(planet.techLevel.code, dm);
};

// WBH p.178
const spaceTransport = (planet) => {
  let tl = planet.techLevel.manufacturing + techLevelModifiers();

  if (planet.size.code === '0' || planet.size.code === 'S' || planet.size.code === '1') tl += 2;

  if (planet.population.code <= 5) tl -= 1;
  else if (planet.population.code >= 9) tl += 1;
  if (planet.starport === 'A') tl += 2;
  else if (planet.starport === 'B') tl += 1;

  planet.techLevel.spaceTransport = subTL(
    tl,
    Math.min(planet.techLevel.energy, planet.techLevel.manufacturing),
    Math.min(planet.techLevel.energy - 3, planet.techLevel.manufacturing - 3)
  );
};

// WBH p.178
const personalMilitary = (planet) => {
  let tl = planet.techLevel.manufacturing + techLevelModifiers();

  if (planet.government.code === 0 || planet.government.code === 7) tl += 2;
  if (planet.lawLevel.code === 0)
    tl += 2;
  else if (planet.lawLevel.code === 7)
    tl += 2;
  else if (planet.lawLevel.code <= 4)
    tl += 1;
  else if (planet.lawLevel.code >= 9 || planet.lawLevel.code <= 12)
    tl += 1;
  const lowerBound = planet.lawLevel.weaponsAndArmour === 0 ? planet.techLevel.manufacturing : 0;
  planet.techLevel.personalMilitary = subTL(
    tl,
    planet.techLevel.electronics,
    lowerBound);
};

// WBH p.179
const heavyMilitary = (planet) => {
  let tl = planet.techLevel.manufacturing + techLevelModifiers();

  if (planet.population.code <= 6) tl -= 1;
  else if (planet.population.code >= 8) tl += 1;

  switch (planet.government.code) {
    case 7:
    case 10:
    case 11:
    case 15:
      tl += 2;
      break;
  }

  if (planet.lawLevel.code >= 13) tl += 2;

  planet.techLevel.heavyMilitary = subTL(tl, planet.techLevel.manufacturing, 0);
};

const lowCommonTechLevel = (planet) => {
  let tl = planet.techLevel.code;
  tl += techLevelModifiers();
  if (planet.population.code <= 5) tl += 1;
  else if (planet.population.code >= 9) tl += -1;

  if (planet.population.concentrationRating <= 2) tl += -1;
  else if (planet.population.concentrationRating >= 7) tl += 1;

  switch (planet.government.code) {
    case 0:
    case 6:
    case 13:
    case 14:
      tl += -1;
      break;
    case 5:
      tl += 1;
      break;
    case 7:
      tl += -2;
      break;
  }

  return Math.min(Math.max(tl, planet.techLevel.code / 2), planet.techLevel.code);
};

// WBH p.173
const assignTechLevelDetails = (planet) => {
  if (planet.population.code === 0) return;
  planet.techLevel.highCommonTechLevel = planet.techLevel.code;
  planet.techLevel.lowCommonTechLevel = lowCommonTechLevel(planet);
  energy(planet);
  electronics(planet);
  manufacturing(planet);
  medical(planet);
  environmental(planet);
  landTransport(planet);
  waterTransport(planet);
  airTransport(planet);
  spaceTransport(planet);
  personalMilitary(planet);
  heavyMilitary(planet);
};

module.exports = { assignTechLevelDetails };
