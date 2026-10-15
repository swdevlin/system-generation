const { randomInt } = require('../dice');

const SurfaceLiquidsTable = [
  {
    name: 'Fluorine',
    molecule: 'F2',
    boilingPointK: 85,
    meltingPointK: 53,
    relativeAbundance: 2,
  },
  {
    name: 'Oxygen',
    molecule: 'O2',
    boilingPointK: 90,
    meltingPointK: 54,
    relativeAbundance: 50,
  },
  {
    name: 'Methane',
    molecule: 'CH4',
    boilingPointK: 113,
    meltingPointK: 91,
    relativeAbundance: 70,
  },
  {
    name: 'Ethane',
    molecule: 'C2H6',
    boilingPointK: 184,
    meltingPointK: 90,
    relativeAbundance: 70,
  },
  {
    name: 'Chlorine',
    molecule: 'Cl2',
    boilingPointK: 239,
    meltingPointK: 171,
    relativeAbundance: 1,
  },
  {
    name: 'Ammonia',
    molecule: 'NH3',
    boilingPointK: 240,
    meltingPointK: 195,
    relativeAbundance: 30,
  },
  {
    name: 'Sulphur Dioxide',
    molecule: 'SO2',
    boilingPointK: 263,
    meltingPointK: 201,
    relativeAbundance: 20,
  },
  {
    name: 'Hydrofluoric Acid',
    molecule: 'HF',
    boilingPointK: 293,
    meltingPointK: 190,
    relativeAbundance: 2,
  },
  {
    name: 'Hydrogen Cyanide',
    molecule: 'HCN',
    boilingPointK: 299,
    meltingPointK: 260,
    relativeAbundance: 30,
  },
  {
    name: 'Hydrochloric Acid',
    molecule: 'HCl',
    boilingPointK: 321,
    meltingPointK: 247,
    relativeAbundance: 1,
  },
  {
    name: 'Water',
    molecule: 'H2O',
    boilingPointK: 373,
    meltingPointK: 273,
    relativeAbundance: 100,
  },
  {
    name: 'Formic Acid',
    molecule: 'CH2O2',
    boilingPointK: 374,
    meltingPointK: 281,
    relativeAbundance: 15,
  },
  {
    name: 'Formamide',
    molecule: 'CH3NO',
    boilingPointK: 483,
    meltingPointK: 275,
    relativeAbundance: 15,
  },
  {
    name: 'Carbonic Acid',
    molecule: 'H2CO3',
    boilingPointK: 607,
    meltingPointK: 193,
    relativeAbundance: 20,
    notes: 'Not present on exotic gas table but viable in isolation or mixture',
  },
  {
    name: 'Sulphuric Acid',
    molecule: 'H2SO4',
    boilingPointK: 718,
    meltingPointK: 388,
    relativeAbundance: 20,
  },
  {
    name: 'Molten Sulphur',
    molecule: 'S',
    boilingPointK: 718,
    meltingPointK: 388,
    relativeAbundance: 25,
    notes: 'Common volcanic melt; near its normal boiling point at ~760 K unless pressure is high',
  },
  {
    name: 'Molten Potassium',
    molecule: 'K',
    boilingPointK: 1032,
    meltingPointK: 336.7,
    relativeAbundance: 4,
    notes: 'Alkali metal melt; requires reducing conditions, reacts violently with water',
  },
  {
    name: 'Molten Sodium',
    molecule: 'Na',
    boilingPointK: 1156.09,
    meltingPointK: 370.944,
    relativeAbundance: 6,
    notes: 'Alkali metal melt; requires reducing conditions, reacts violently with water',
  },
  {
    name: 'Molten Zinc',
    molecule: 'Zn',
    boilingPointK: 1180,
    meltingPointK: 692.68,
    relativeAbundance: 10,
    notes: 'Low-melting metal; plausible in very hot, dry environments',
  },
  {
    name: 'Molten Lead',
    molecule: 'Pb',
    boilingPointK: 2022,
    meltingPointK: 600.61,
    relativeAbundance: 6,
    notes: 'Dense metal melt; likely as pools/lakes rather than global oceans',
  },
  {
    name: 'Molten Bismuth',
    molecule: 'Bi',
    boilingPointK: 1837,
    meltingPointK: 544.556,
    relativeAbundance: 2,
    notes: 'Heavy metal melt; typically minor/localised',
  },
  {
    name: 'Molten Tin',
    molecule: 'Sn',
    boilingPointK: 2875,
    meltingPointK: 505.078,
    relativeAbundance: 3,
    notes: 'Metal melt; typically minor/localised',
  },
  {
    name: 'Magma',
    molecule: 'Silicate melt',
    boilingPointK: 2500,
    meltingPointK: 900,
    relativeAbundance: 80,
    notes:
      'Mixture; temperature range varies by composition. Treated as “stays molten” for generation.',
  },
];

class SurfaceLiquidGenerator {
  getLiquid(planet) {
    const temperature = planet.meanTemperature;

    const viable = SurfaceLiquidsTable.filter(
      (l) => temperature >= l.meltingPointK && temperature <= l.boilingPointK
    );

    const hasWater = viable.some((l) => l.name === 'Water');
    if (hasWater && planet.atmosphere.code < 10) return 'Water';

    const totalWeight = viable.reduce((sum, l) => sum + l.relativeAbundance, 0);

    if (viable.length === 0 || totalWeight <= 0) {
      return null;
    }

    const roll = randomInt(1, totalWeight);

    let cumulative = 0;
    for (const liquid of viable) {
      cumulative += liquid.relativeAbundance;
      if (roll <= cumulative) return liquid.name;
    }

    return viable[viable.length - 1].name;
  }

  // Called after the final mean temperature is known. Too cold: the liquid stays and freezes
  // (ice caps show how much). Too hot: pick a liquid viable at the new temperature, or boil off.
  reconcile(planet) {
    const hydrographics = planet.hydrographics;
    if (!hydrographics?.code) return hydrographics;

    const current = SurfaceLiquidsTable.find((l) => l.name === hydrographics.liquid);
    if (current && planet.meanTemperature <= current.boilingPointK) return hydrographics;

    const previous = hydrographics.liquid;
    hydrographics.liquid = this.getLiquid(planet);
    if (hydrographics.liquid === null) {
      hydrographics.code = 0;
      hydrographics.percentage = 0;
      hydrographics.distribution = 0;
    }
    if (hydrographics.liquid !== previous) hydrographics.previousLiquid = previous;
    return hydrographics;
  }
}

module.exports = SurfaceLiquidGenerator;
module.exports.SurfaceLiquidsTable = SurfaceLiquidsTable;
