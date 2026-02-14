const { twoD6 } = require('../dice');
const AtmosphereDensities = require('../atmosphere/AtmosphereDensities');
const { meanTemperature } = require('../utils');
const { AtmosphereGenerator } = require('./AtmosphereGenerator');

class InsidiousAtmosphereGenerator extends AtmosphereGenerator {
  constructor() {
    super('Insidious (C)', {
      boiling: {
        min: -2, overflow: 'Methane',
        table: { [-2]: 'Metal Vapours', [-1]: 'Silicates (SO, SO2)', 0: 'Sodium',
          1: 'Sulphuric Acid', 2: 'Hydrochloric Acid', 3: 'Chlorine', 4: 'Fluorine',
          5: 'Formic Acid', 6: 'Water Vapour', 7: 'Nitrogen', 8: 'Carbon Dioxide',
          9: 'Sulphur Dioxide', 10: 'Hydrogen Cyanide', 11: 'Ammonia', 12: 'Hydrofluoric Acid' },
      },
      boilingWarm: {
        min: 1, overflow: 'Methane',
        table: { 1: 'Hydrochloric Acid', 2: 'Chlorine', 3: 'Fluorine', 4: 'Formic Acid',
          5: 'Water Vapour', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Sulphur Dioxide',
          9: 'Hydrogen Cyanide', 10: 'Ammonia', 11: 'Methane', 12: 'Hydrofluoric Acid' },
      },
      hot: {
        min: 1, overflow: 'Helium',
        table: { 1: 'Hydrochloric Acid', 2: 'Chlorine', 3: 'Fluorine', 4: 'Sulphur Dioxide',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Ethane',
          9: 'Hydrogen Cyanide', 10: 'Ammonia', 11: 'Methane', 12: 'Hydrofluoric Acid' },
      },
      temperate: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Argon', 2: 'Chlorine', 3: 'Fluorine', 4: 'Sulphur Dioxide',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Ethane',
          9: 'Ammonia', 10: 'Ammonia', 11: 'Methane', 12: 'Helium' },
      },
      cold: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Argon', 2: 'Chlorine', 3: 'Fluorine', 4: 'Ethane',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Carbon Dioxide', 8: 'Nitrogen',
          9: 'Ethane', 10: 'Ammonia', 11: 'Methane', 12: 'Helium' },
      },
      frozen: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Fluorine', 4: 'Nitrogen',
          5: 'Nitrogen', 6: 'Carbon Monoxide', 7: 'Nitrogen', 8: 'Methane',
          9: 'Methane', 10: 'Neon', 11: 'Helium', 12: 'Hydrogen' },
      },
      deepFrozen: {
        min: 1, overflow: 'Hydrogen',
        table: { 1: 'Krypton', 2: 'Argon', 3: 'Fluorine', 4: 'Methane',
          5: 'Carbon Monoxide', 6: 'Nitrogen', 7: 'Nitrogen', 8: 'Neon',
          9: 'Helium', 10: 'Helium' },
      },
    });
  }

  assignHazard(planet) {
    const buildLogKey = 'Assign Insidious Hazard';

    if (!Array.isArray(planet.buildLog)) planet.buildLog = [];

    const rollRaw = twoD6();
    let roll = rollRaw;

    const dms = [];
    if (planet.atmosphere.density === AtmosphereDensities.EXTREMELY_DENSE) {
      roll += 2;
      dms.push({ reason: 'Atmosphere density is EXTREMELY_DENSE', dm: 2 });
    }

    switch (roll) {
      case 2:
      case 3:
      case 4:
        planet.atmosphere.hazardCode = 'B';
        break;
      case 5:
        planet.atmosphere.hazardCode = 'R';
        break;
      case 6:
      case 7:
      case 9:
        planet.atmosphere.hazardCode = 'G';
        break;
      case 8:
      case 10:
      case 11:
        planet.atmosphere.hazardCode = roll === 11 ? 'R' : 'T';
        break;
      default:
        planet.atmosphere.hazardCode = 'T';
        break;
    }

    planet.buildLog.push({
      [buildLogKey]: {
        inputs: {
          density: planet.atmosphere.density,
        },
        roll: {
          raw: rollRaw,
          dms,
          total: roll,
        },
        results: {
          hazardCode: planet.atmosphere.hazardCode,
        },
      },
    });
  }

  assignAtmosphere(star, planet) {
    let roll = twoD6();
    if (planet.size >= 2 && planet.size <= 4) roll -= 3;
    if (planet.effectiveHZCODeviation < -1) roll += 4;
    if (planet.effectiveHZCODeviation > 2) roll -= 2;

    planet.atmosphere.code = 12;

    if (roll <= 1) {
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
          break;
        default:
          planet.atmosphere.density = AtmosphereDensities.EXTREMELY_DENSE;
          planet.atmosphere.irritant = true;
          break;
      }

    planet.meanTemperature = meanTemperature(star, planet);

    this.assignAtmosphereComposition(planet);

    this.assignHazard(planet);
  }
}

module.exports = { InsidiousAtmosphereGenerator };
