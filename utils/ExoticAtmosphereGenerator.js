const { twoD6 } = require('../dice');
const AtmosphereDensities = require('../atmosphere/AtmosphereDensities');
const { determineTaint } = require('../atmosphere/taint');
const { meanTemperature } = require('../utils');
const { AtmosphereGenerator } = require('./AtmosphereGenerator');

class ExoticAtmosphereGenerator extends AtmosphereGenerator {
  constructor() {
    super('Exotic (A)', {
      boiling: {
        min: -2, overflow: 'Methane',
        table: { [-2]: 'Silicates (SO, SO2)', [-1]: 'Sodium', 0: 'Krypton', 1: 'Argon',
          2: 'Sulphur Dioxide', 3: 'Carbon Monoxide', 4: 'Carbon Dioxide',
          5: 'Nitrogen', 6: 'Carbon Dioxide', 7: 'Nitrogen', 8: 'Water Vapour',
          9: 'Sulphur Dioxide', 10: 'Nitrogen', 11: 'Methane', 12: 'Water Vapour' },
      },
      boilingWarm: {
        min: 1, overflow: 'Methane',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Sulphur Dioxide', 4: 'Ethane',
          5: 'Carbon Dioxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Nitrogen',
          9: 'Water Vapour', 10: 'Sulphur Dioxide', 11: 'Methane', 12: 'Neon' },
      },
      hot: {
        min: 1, overflow: 'Methane',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Sulphur Dioxide', 4: 'Ethane',
          5: 'Carbon Dioxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Nitrogen',
          9: 'Carbon Monoxide', 10: 'Sulphur Dioxide', 11: 'Methane', 12: 'Neon' },
      },
      temperate: {
        min: 1, overflow: 'Helium',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Sulphur Dioxide', 4: 'Nitrogen',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Ethane',
          9: 'Nitrogen', 10: 'Neon', 11: 'Methane', 12: 'Methane' },
      },
      cold: {
        min: 1, overflow: 'Helium',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Ethane', 4: 'Nitrogen',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Nitrogen',
          9: 'Ethane', 10: 'Methane', 11: 'Neon', 12: 'Methane' },
      },
      frozen: {
        min: 1, overflow: 'Helium',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Argon', 4: 'Nitrogen',
          5: 'Nitrogen', 6: 'Carbon Monoxide', 7: 'Nitrogen', 8: 'Methane',
          9: 'Methane', 10: 'Methane', 11: 'Neon', 12: 'Methane' },
      },
      deepFrozen: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Argon', 4: 'Methane',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Nitrogen', 8: 'Neon',
          9: 'Helium', 10: 'Helium' },
      },
    });
  }

  assignAtmosphere(star, planet) {
    const stepKey = 'Assign Exotic Atmosphere';

    const rollRaw = twoD6();
    let roll = rollRaw;

    const dms = [];
    if (planet.size >= 2 && planet.size <= 4) {
      roll -= 2;
      dms.push({ reason: 'Size 2–4', dm: -2 });
    }
    if (planet.effectiveHZCODeviation < -1) {
      roll -= 2;
      dms.push({ reason: 'effectiveHZCODeviation < -1', dm: -2 });
    }
    if (planet.effectiveHZCODeviation > 2) {
      roll += 2;
      dms.push({ reason: 'effectiveHZCODeviation > 2', dm: 2 });
    }

    planet.atmosphere.code = 10;
    // todo: runaway greenhouse check

    if (roll <= 2) {
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
      planet.atmosphere.irritant = true;
      planet.atmosphere.subtype = 2;
    } else if (roll >= 14) {
      planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
      planet.atmosphere.irritant = true;
      planet.atmosphere.subtype = 11;
    } else {
      switch (roll) {
        case 3:
          planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
          planet.atmosphere.subtype = roll;
          break;
        case 4:
          planet.atmosphere.density = AtmosphereDensities.THIN;
          planet.atmosphere.irritant = true;
          planet.atmosphere.subtype = roll;
          break;
        case 5:
          planet.atmosphere.density = AtmosphereDensities.THIN;
          planet.atmosphere.subtype = roll;
          break;
        case 6:
          planet.atmosphere.density = AtmosphereDensities.STANDARD;
          planet.atmosphere.subtype = roll;
          break;
        case 7:
          planet.atmosphere.density = AtmosphereDensities.STANDARD;
          planet.atmosphere.irritant = true;
          planet.atmosphere.subtype = roll;
          break;
        case 8:
          planet.atmosphere.density = AtmosphereDensities.DENSE;
          planet.atmosphere.subtype = roll;
          break;
        case 9:
          planet.atmosphere.density = AtmosphereDensities.DENSE;
          planet.atmosphere.irritant = true;
          planet.atmosphere.subtype = roll;
          break;
        case 10:
          planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
          planet.atmosphere.subtype = roll;
          break;
        case 11:
        case 12:
          planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
          planet.atmosphere.irritant = true;
          planet.atmosphere.subtype = roll;
          break;
        case 13:
          planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
          planet.atmosphere.subtype = 10;
          break;
        default:
          planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
          planet.atmosphere.irritant = true;
          planet.atmosphere.subtype = 11;
          break;
      }
    }

    planet.meanTemperature = meanTemperature(star, planet);

    this.assignAtmosphereComposition(planet);

    if (planet.atmosphere.irritant) planet.atmosphere.taint = determineTaint(planet.atmosphere);

    // Build log entry
    planet.buildLog.push({
      [stepKey]: {
        roll: {
          raw: rollRaw,
          dms,
          total: roll,
        },
        inputs: {
          size: planet.size,
          effectiveHZCODeviation: planet.effectiveHZCODeviation,
        },
        results: {
          atmosphere: {
            code: planet.atmosphere.code,
            subtype: planet.atmosphere.subtype,
            density: planet.atmosphere.density,
            irritant: !!planet.atmosphere.irritant,
            taint: planet.atmosphere.taint ?? null,
            composition: planet.atmosphere.composition ?? '',
          },
          meanTemperatureK: planet.meanTemperature,
        },
      },
    });
  }
}

module.exports = { ExoticAtmosphereGenerator };
