const { d6, twoD6 } = require('../dice');

// --- DM functions ---

const sizeOnlyDM = (planet) => {
  const size = planet.size;
  if (size >= 1 && size <= 7) return -1;
  if (size >= 10) return 1;
  return 0;
};

const boilingAtmosphereDM = (planet) => {
  let dm = 0;
  const t = planet.meanTemperature;
  if (t > 2000) dm -= 5;
  else if (t >= 700) dm -= 2;
  return dm + sizeOnlyDM(planet);
};

const frozenAtmosphereDM = (planet) => {
  const size = planet.size;
  if (size >= 1 && size <= 7) return -2;
  if (size >= 10) return 1;
  return 0;
};

const deepFrozenAtmosphereDM = (planet) => {
  let dm = 0;
  const t = planet.meanTemperature;
  if (t < 70) dm += 5;
  else if (t >= 70 && t <= 100) dm += 3;
  const size = planet.size;
  if (size >= 1 && size <= 7) dm -= 3;
  else if (size >= 10) dm += 1;
  return dm;
};

// --- Temperature band configuration ---

const TEMP_BANDS = {
  boiling: {
    dm: boilingAtmosphereDM,
    logKey: 'Assign Boiling Atmosphere Gas Mix',
    logInputs: (p) => ({ meanTemperatureK: p.meanTemperature, size: p.size }),
    notes: [],
  },
  boilingWarm: {
    dm: sizeOnlyDM,
    logKey: 'Assign Boiling Atmosphere Gas Mix',
    logInputs: (p) => ({ meanTemperatureK: p.meanTemperature, size: p.size }),
    notes: [],
  },
  hot: {
    dm: sizeOnlyDM,
    logKey: 'Assign Hot Atmosphere Gas Mix',
    logInputs: (p) => ({ meanTemperatureK: p.meanTemperature, size: p.size }),
    notes: [
      'Carbon Monoxide results are for Hydrographics 0 (or non-H2O hydrographics) only; otherwise use Carbon Dioxide.',
    ],
  },
  temperate: {
    dm: sizeOnlyDM,
    logKey: 'Assign Temperate Atmosphere Gas Mix',
    logInputs: (p) => ({ meanTemperatureK: p.meanTemperature, size: p.size }),
    notes: [
      'Carbon Monoxide results are for Hydrographics 0 (or non-H2O hydrographics) only; otherwise use Carbon Dioxide.',
    ],
  },
  cold: {
    dm: sizeOnlyDM,
    logKey: 'Assign Cold Atmosphere Gas Mix',
    logInputs: (p) => ({ meanTemperatureK: p.meanTemperature, size: p.size }),
    notes: [
      'Carbon Monoxide results are for Hydrographics 0 (or non-H2O hydrographics) only; otherwise use Carbon Dioxide.',
    ],
  },
  frozen: {
    dm: frozenAtmosphereDM,
    logKey: 'Assign Frozen Atmosphere Gas Mix',
    logInputs: (p) => ({ meanTemperatureK: p.meanTemperature, size: p.size }),
    notes: [
      'Carbon Monoxide results are for Hydrographics 0 (or non-H2O hydrographics) only; otherwise use Nitrogen.',
    ],
  },
  deepFrozen: {
    dm: deepFrozenAtmosphereDM,
    logKey: 'Assign Frozen Atmosphere Gas Mix',
    logInputs: (p) => ({ meanTemperatureK: p.meanTemperature, size: p.size }),
    notes: [
      'Carbon Monoxide results are for Hydrographics 0 (or non-H2O hydrographics) only; otherwise use Nitrogen.',
    ],
  },
};

class AtmosphereGenerator {
  constructor(label, columns) {
    this.label = label;
    this.columns = columns;
  }

  static selectBand(temperature) {
    if (temperature > 453) return 'boiling';
    if (temperature >= 353) return 'boilingWarm';
    if (temperature >= 303) return 'hot';
    if (temperature >= 273) return 'temperate';
    if (temperature >= 223) return 'cold';
    if (temperature >= 123) return 'frozen';
    return 'deepFrozen';
  }

  roll(planet) {
    const bandName = AtmosphereGenerator.selectBand(planet.meanTemperature);
    const band = TEMP_BANDS[bandName];
    const col = this.columns[bandName];
    const rollRaw = twoD6();
    const dm = band.dm(planet);
    const roll = rollRaw + dm;

    let gas;
    if (roll <= col.min) {
      gas = col.table[col.min];
    } else {
      gas = col.table[roll];
      if (gas === undefined) gas = col.overflow;
    }

    if (!Array.isArray(planet.buildLog)) planet.buildLog = [];
    planet.buildLog.push({
      [band.logKey]: {
        table: band.logKey,
        column: this.label,
        inputs: band.logInputs(planet),
        dm,
        roll: { raw: rollRaw, total: roll },
        notes: band.notes,
        result: { gases: [gas] },
      },
    });

    return [gas];
  }

  buildMix(planet) {
    const mix = {};
    let allocated = 0;
    let rollCount = 0;
    const mixRolls = [];

    while (rollCount < 2 || allocated < 95) {
      const result = this.roll(planet);
      const gasName = result[0];

      const remainder = 100 - allocated;
      if (remainder <= 0) break;

      let pct;
      if (rollCount === 0) {
        pct = (d6() + 4) * 10;
      } else {
        const rollPct = (d6() + 4) * 10;
        pct = Math.round((rollPct / 100) * remainder);
      }

      pct = Math.min(pct, remainder);

      mix[gasName] = (mix[gasName] || 0) + pct;
      allocated += pct;
      rollCount++;
      mixRolls.push({ gas: gasName, percentage: pct, allocated });

      if (rollCount >= 10) break;
    }

    const composition = Object.entries(mix)
      .map(([gas, percentage]) => ({ gas, percentage }))
      .sort((a, b) => b.percentage - a.percentage);

    if (!Array.isArray(planet.buildLog)) planet.buildLog = [];
    planet.buildLog.push({
      'Gas Mix Determination': {
        rolls: mixRolls,
        result: composition,
      },
    });

    return composition;
  }

  assignAtmosphereComposition(planet) {
    planet.atmosphere.gases = this.buildMix(planet);
    planet.atmosphere.composition = planet.atmosphere.gases
      .map((g) => `${g.gas} (${g.percentage}%)`)
      .join(', ');
  }
}

module.exports = { AtmosphereGenerator };
