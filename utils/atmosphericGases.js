const { percentageChance } = require('../dice');
const ATMOSPHERIC_GASES = [
  {
    name: 'Hydrogen Ion',
    code: 'H-',
    escapeValue: 24.0,
    atomicMass: 1,
    boilingPointK: 20,
    meltingPointK: 14,
    relativeAbundance: null,
    taint: false,
  },
  {
    name: 'Hydrogen',
    code: 'H2',
    escapeValue: 12.0,
    atomicMass: 2,
    boilingPointK: 20,
    meltingPointK: 14,
    relativeAbundance: 1200,
    taint: false,
  },
  {
    name: 'Helium',
    code: 'He',
    escapeValue: 6.0,
    atomicMass: 4,
    boilingPointK: 4,
    meltingPointK: 0,
    relativeAbundance: 400,
    taint: false,
  },
  {
    name: 'Methane',
    code: 'CH4',
    escapeValue: 1.5,
    atomicMass: 16,
    boilingPointK: 113,
    meltingPointK: 91,
    relativeAbundance: 70,
    taint: true,
  },
  {
    name: 'Ammonia',
    code: 'NH3',
    escapeValue: 1.42,
    atomicMass: 17,
    boilingPointK: 240,
    meltingPointK: 195,
    relativeAbundance: 30,
    taint: true,
  },
  {
    name: 'Water Vapour',
    code: 'H2O',
    escapeValue: 1.33,
    atomicMass: 18,
    boilingPointK: 373,
    meltingPointK: 273,
    relativeAbundance: 100,
    taint: false,
  },
  {
    name: 'Hydrofluoric Acid',
    code: 'HF',
    escapeValue: 1.2,
    atomicMass: 20,
    boilingPointK: 293,
    meltingPointK: 190,
    relativeAbundance: 2,
    taint: true,
  },
  {
    name: 'Neon',
    code: 'Ne',
    escapeValue: 1.2,
    atomicMass: 20,
    boilingPointK: 27,
    meltingPointK: 25,
    relativeAbundance: 50,
    taint: false,
  },
  {
    name: 'Sodium',
    code: 'Na',
    escapeValue: 1.04,
    atomicMass: 23,
    boilingPointK: 1156,
    meltingPointK: 371,
    relativeAbundance: 40,
    taint: true,
  },
  {
    name: 'Nitrogen',
    code: 'N2',
    escapeValue: 0.86,
    atomicMass: 28,
    boilingPointK: 77,
    meltingPointK: 63,
    relativeAbundance: 60,
    taint: false,
  },
  {
    name: 'Carbon Monoxide',
    code: 'CO',
    escapeValue: 0.86,
    atomicMass: 28,
    boilingPointK: 82,
    meltingPointK: 68,
    relativeAbundance: 70,
    taint: true,
  },
  {
    name: 'Hydrogen Cyanide',
    code: 'HCN',
    escapeValue: 0.86,
    atomicMass: 28,
    boilingPointK: 299,
    meltingPointK: 260,
    relativeAbundance: 30,
    taint: true,
  },
  {
    name: 'Ethane',
    code: 'C2H6',
    escapeValue: 0.8,
    atomicMass: 30,
    boilingPointK: 184,
    meltingPointK: 90,
    relativeAbundance: 70,
    taint: true,
  },
  {
    name: 'Oxygen',
    code: 'O2',
    escapeValue: 0.75,
    atomicMass: 32,
    boilingPointK: 90,
    meltingPointK: 54,
    relativeAbundance: 50,
    taint: false,
  },
  {
    name: 'Hydrochloric Acid',
    code: 'HCl',
    escapeValue: 0.67,
    atomicMass: 36,
    boilingPointK: 321,
    meltingPointK: 247,
    relativeAbundance: 1,
    taint: true,
  },
  {
    name: 'Fluorine',
    code: 'F2',
    escapeValue: 0.63,
    atomicMass: 38,
    boilingPointK: 85,
    meltingPointK: 53,
    relativeAbundance: 2,
    taint: true,
  },
  {
    name: 'Argon',
    code: 'Ar',
    escapeValue: 0.6,
    atomicMass: 40,
    boilingPointK: 87,
    meltingPointK: 83,
    relativeAbundance: 20,
    taint: false,
  },
  {
    name: 'Carbon Dioxide',
    code: 'CO2',
    escapeValue: 0.55,
    atomicMass: 44,
    boilingPointK: 216,
    meltingPointK: 194,
    relativeAbundance: 70,
    taint: true,
  },
  {
    name: 'Formamide',
    code: 'CH3NO',
    escapeValue: 0.53,
    atomicMass: 45,
    boilingPointK: 483,
    meltingPointK: 275,
    relativeAbundance: 15,
    taint: true,
  },
  {
    name: 'Formic Acid',
    code: 'CH2O2',
    escapeValue: 0.52,
    atomicMass: 46,
    boilingPointK: 374,
    meltingPointK: 281,
    relativeAbundance: 15,
    taint: true,
  },
  {
    name: 'Sulphur Dioxide',
    code: 'SO2',
    escapeValue: 0.38,
    atomicMass: 64,
    boilingPointK: 263,
    meltingPointK: 201,
    relativeAbundance: 20,
    taint: true,
  },
  {
    name: 'Chlorine',
    code: 'Cl2',
    escapeValue: 0.34,
    atomicMass: 70,
    boilingPointK: 239,
    meltingPointK: 171,
    relativeAbundance: 1,
    taint: true,
  },
  {
    name: 'Krypton',
    code: 'Kr',
    escapeValue: 0.29,
    atomicMass: 84,
    boilingPointK: 120,
    meltingPointK: 115,
    relativeAbundance: 2,
    taint: false,
  },
  {
    name: 'Sulphuric Acid',
    code: 'H2SO4',
    escapeValue: 0.24,
    atomicMass: 98,
    boilingPointK: 718,
    meltingPointK: 388,
    relativeAbundance: 20,
    taint: true,
  },
];

const gasesForAtmosphere = (planetEscapeValue, temperatureK, gases = ATMOSPHERIC_GASES) => {
  if (planetEscapeValue == null || temperatureK == null) return [];

  return gases.filter((g) => {
    const isGasAtTemp = temperatureK >= g.boilingPointK;
    const retainedByWorld = planetEscapeValue >= g.escapeValue;
    return isGasAtTemp && retainedByWorld;
  });
};

const selectAtmosphericGases = (planetEscapeValue, temperatureK, gases = ATMOSPHERIC_GASES) => {
  const candidates = gasesForAtmosphere(planetEscapeValue, temperatureK, gases).filter(
    (g) => typeof g.relativeAbundance === 'number' && g.relativeAbundance > 0
  );

  if (candidates.length === 0) return [];

  const totalRelativeAbundance = candidates.reduce((sum, g) => sum + g.relativeAbundance, 0);
  if (totalRelativeAbundance <= 0) return [];

  let selected = [];

  while (selected.length === 0) {
    selected = candidates.filter((g) => {
      const p = g.relativeAbundance / totalRelativeAbundance; // 0..1
      return percentageChance(p);
    });
  }

  return selected;
};

const atmosphereComposition = (gases, { precision = 1, separator = ', ' } = {}) => {
  if (!Array.isArray(gases) || gases.length === 0) return '';

  const present = gases.filter(
    (g) => typeof g.relativeAbundance === 'number' && g.relativeAbundance > 0
  );
  if (present.length === 0) return '';

  const total = present.reduce((sum, g) => sum + g.relativeAbundance, 0);
  if (total <= 0) return '';

  return present.map((g) => g.name).join(separator);
};

const atmosphereCompositionTop3 = (
  gases,
  { precision = 1, separator = ', ', otherLabel = 'Other' } = {}
) => {
  if (!Array.isArray(gases) || gases.length === 0) return '';

  const present = gases
    .filter((g) => typeof g.relativeAbundance === 'number' && g.relativeAbundance > 0)
    .slice()
    .sort((a, b) => b.relativeAbundance - a.relativeAbundance);

  const total = present.reduce((sum, g) => sum + g.relativeAbundance, 0);
  if (total <= 0) return '';

  const top = present.slice(0, 3);
  const topSum = top.reduce((sum, g) => sum + g.relativeAbundance, 0);
  const otherSum = Math.max(0, total - topSum);

  const parts = top.map(
    (g) => `${g.name} ${((g.relativeAbundance / total) * 100).toFixed(precision)}%`
  );

  if (present.length > top.length) {
    parts.push(`${otherLabel} ${((otherSum / total) * 100).toFixed(precision)}%`);
  }

  return parts.join(separator);
};

module.exports = {
  ATMOSPHERIC_GASES,
  gasesForAtmosphere,
  atmosphereComposition,
  atmosphereCompositionTop3,
  selectAtmosphericGases,
};
