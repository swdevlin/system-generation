const { twoD6 } = require('../dice');
const AtmosphereDensities = require('../atmosphere/AtmosphereDensities');
const { determineTaint } = require('../atmosphere/taint');
const { meanTemperature } = require('../utils');
const { AtmosphereGenerator } = require('./AtmosphereGenerator');

class CorrosiveAtmosphereGenerator extends AtmosphereGenerator {
  constructor() {
    super('Corrosive (B)', {
      boiling: {
        min: -2, overflow: 'Methane',
        table: { [-2]: 'Silicates (SO, SO2)', [-1]: 'Sodium', 0: 'Krypton', 1: 'Argon',
          2: 'Sulphur Dioxide', 3: 'Hydrogen Cyanide', 4: 'Formamide',
          5: 'Carbon Dioxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Sulphur Dioxide',
          9: 'Water Vapour', 10: 'Nitrogen', 11: 'Ammonia', 12: 'Ammonia' },
      },
      boilingWarm: {
        min: 1, overflow: 'Methane',
        table: { 1: 'Argon', 2: 'Sulphur Dioxide', 3: 'Hydrogen Cyanide', 4: 'Ethane',
          5: 'Carbon Dioxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Sulphur Dioxide',
          9: 'Water Vapour', 10: 'Nitrogen', 11: 'Ammonia', 12: 'Ammonia' },
      },
      hot: {
        min: 1, overflow: 'Methane',
        table: { 1: 'Argon', 2: 'Sulphur Dioxide', 3: 'Hydrogen Cyanide', 4: 'Ethane',
          5: 'Carbon Dioxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Sulphur Dioxide',
          9: 'Carbon Monoxide', 10: 'Nitrogen', 11: 'Ammonia', 12: 'Ammonia' },
      },
      temperate: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Krypton', 2: 'Chlorine', 3: 'Argon', 4: 'Sulphur Dioxide',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Ethane',
          9: 'Ammonia', 10: 'Ammonia', 11: 'Methane', 12: 'Helium' },
      },
      cold: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Krypton', 2: 'Chlorine', 3: 'Argon', 4: 'Nitrogen',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Nitrogen',
          9: 'Ethane', 10: 'Ammonia', 11: 'Methane', 12: 'Helium' },
      },
      frozen: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Argon', 4: 'Nitrogen',
          5: 'Nitrogen', 6: 'Carbon Monoxide', 7: 'Nitrogen', 8: 'Methane',
          9: 'Methane', 10: 'Neon', 11: 'Methane', 12: 'Helium' },
      },
      deepFrozen: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Argon', 4: 'Methane',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Nitrogen', 8: 'Neon',
          9: 'Helium', 10: 'Helium' },
      },
    });
  }

  // pg 89
  assignAtmosphere(star, planet) {
    let roll = twoD6();
    if (planet.size >= 2 && planet.size <= 4) roll -= 3;
    if (planet.effectiveHZCODeviation < -1) roll += 4;
    if (planet.effectiveHZCODeviation > 2) roll -= 2;

    planet.atmosphere.code = 11;
    // todo: runaway greenhouse check

    if (roll <= 1) {
      // todo: set temperature
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
      planet.atmosphere.irritant = true;
    } else
      switch (roll) {
        case 2:
          planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
          planet.atmosphere.irritant = true;
          break;
        case 3:
          planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
          break;
        case 4:
          planet.atmosphere.density = AtmosphereDensities.THIN;
          planet.atmosphere.irritant = true;
          break;
        case 5:
          planet.atmosphere.density = AtmosphereDensities.THIN;
          break;
        case 6:
          planet.atmosphere.density = AtmosphereDensities.STANDARD;
          break;
        case 7:
          planet.atmosphere.density = AtmosphereDensities.STANDARD;
          planet.atmosphere.irritant = true;
          break;
        case 8:
          planet.atmosphere.density = AtmosphereDensities.DENSE;
          break;
        case 9:
          planet.atmosphere.density = AtmosphereDensities.DENSE;
          planet.atmosphere.irritant = true;
          break;
        case 10:
          planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
          break;
        case 11:
          planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
          planet.atmosphere.irritant = true;
          break;
        case 12:
          planet.atmosphere.density = AtmosphereDensities.EXTREMELY_DENSE;
          break;
        case 13:
          planet.atmosphere.density = AtmosphereDensities.EXTREMELY_DENSE;
          // todo: set temperature
          break;
        default:
          planet.atmosphere.density = AtmosphereDensities.EXTREMELY_DENSE;
          planet.atmosphere.irritant = true;
          // todo: set temperature
          break;
      }

    // page 86
    planet.meanTemperature = meanTemperature(star, planet);

    this.assignAtmosphereComposition(planet);

    if (planet.atmosphere.irritant) planet.atmosphere.taint = determineTaint(planet.atmosphere);
  }
}

module.exports = { CorrosiveAtmosphereGenerator };
