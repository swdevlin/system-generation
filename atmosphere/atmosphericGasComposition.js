// page 87
const AtmosphericGasComposition = [
  {
    gas: "Hydrogen Ion",
    code: "H-",
    escapeValue: 24.00,
    atomicMass: 1,
    boilingPointK: 20,
    meltingPointK: 14,
    relativeAbundance: "n/a",
    taint: "—"
  },
  {
    gas: "Hydrogen",
    code: "H2",
    escapeValue: 12.00,
    atomicMass: 2,
    boilingPointK: 20,
    meltingPointK: 14,
    relativeAbundance: 1200,
    taint: false
  },
  {
    gas: "Helium",
    code: "He",
    escapeValue: 6.00,
    atomicMass: 4,
    boilingPointK: 4,
    meltingPointK: 0,
    relativeAbundance: 400,
    taint: false
  },
  {
    gas: "Methane",
    code: "CH4",
    escapeValue: 1.50,
    atomicMass: 16,
    boilingPointK: 113,
    meltingPointK: 91,
    relativeAbundance: 70,
    taint: true
  },
  {
    gas: "Ammonia",
    code: "NH3",
    escapeValue: 1.42,
    atomicMass: 17,
    boilingPointK: 240,
    meltingPointK: 195,
    relativeAbundance: 30,
    taint: true
  },
  {
    gas: "Water Vapour",
    code: "H2O",
    escapeValue: 1.33,
    atomicMass: 18,
    boilingPointK: 373,
    meltingPointK: 273,
    relativeAbundance: 100,
    taint: false
  },
  {
    gas: "Hydrofluoric Acid",
    code: "HF",
    escapeValue: 1.20,
    atomicMass: 20,
    boilingPointK: 293,
    meltingPointK: 190,
    relativeAbundance: 2,
    taint: true
  },
  {
    gas: "Neon",
    code: "Ne",
    escapeValue: 1.20,
    atomicMass: 20,
    boilingPointK: 27,
    meltingPointK: 25,
    relativeAbundance: 50,
    taint: false
  },
  {
    gas: "Sodium",
    code: "Na",
    escapeValue: 1.04,
    atomicMass: 23,
    boilingPointK: 1156,
    meltingPointK: 371,
    relativeAbundance: 40,
    taint: true
  },
  {
    gas: "Nitrogen",
    code: "N2",
    escapeValue: 0.86,
    atomicMass: 28,
    boilingPointK: 77,
    meltingPointK: 63,
    relativeAbundance: 60,
    taint: false
  },
  {
    gas: "Carbon Monoxide",
    code: "CO",
    escapeValue: 0.86,
    atomicMass: 28,
    boilingPointK: 82,
    meltingPointK: 68,
    relativeAbundance: 70,
    taint: true
  },
  {
    gas: "Hydrogen Cyanide",
    code: "HCN",
    escapeValue: 0.86,
    atomicMass: 28,
    boilingPointK: 299,
    meltingPointK: 260,
    relativeAbundance: 30,
    taint: true
  },
  {
    gas: "Ethane",
    code: "C2H6",
    escapeValue: 0.80,
    atomicMass: 30,
    boilingPointK: 184,
    meltingPointK: 90,
    relativeAbundance: 70,
    taint: true
  },
  {
    gas: "Oxygen",
    code: "O2",
    escapeValue: 0.75,
    atomicMass: 32,
    boilingPointK: 90,
    meltingPointK: 54,
    relativeAbundance: 50,
    taint: false
  },
  {
    gas: "Hydrochloric Acid",
    code: "HCl",
    escapeValue: 0.67,
    atomicMass: 36,
    boilingPointK: 321,
    meltingPointK: 247,
    relativeAbundance: 1,
    taint: true
  },
  {
    gas: "Fluorine",
    code: "F2",
    escapeValue: 0.63,
    atomicMass: 38,
    boilingPointK: 85,
    meltingPointK: 53,
    relativeAbundance: 2,
    taint: true
  },
  {
    gas: "Argon",
    code: "Ar",
    escapeValue: 0.60,
    atomicMass: 40,
    boilingPointK: 87,
    meltingPointK: 83,
    relativeAbundance: 20,
    taint: false
  },
  {
    gas: "Carbon Dioxide",
    code: "CO2",
    escapeValue: 0.55,
    atomicMass: 44,
    boilingPointK: 216,
    meltingPointK: 194,
    relativeAbundance: 70,
    taint: true
  },
  {
    gas: "Formamide",
    code: "CH3NO",
    escapeValue: 0.53,
    atomicMass: 45,
    boilingPointK: 483,
    meltingPointK: 275,
    relativeAbundance: 15,
    taint: true
  },
  {
    gas: "Formic Acid",
    code: "CH2O2",
    escapeValue: 0.52,
    atomicMass: 46,
    boilingPointK: 374,
    meltingPointK: 281,
    relativeAbundance: 15,
    taint: true
  },
  {
    gas: "Sulphur Dioxide",
    code: "SO2",
    escapeValue: 0.38,
    atomicMass: 64,
    boilingPointK: 263,
    meltingPointK: 201,
    relativeAbundance: 20,
    taint: true
  },
  {
    gas: "Chlorine",
    code: "Cl2",
    escapeValue: 0.34,
    atomicMass: 70,
    boilingPointK: 239,
    meltingPointK: 171,
    relativeAbundance: 1,
    taint: true
  },
  {
    gas: "Krypton",
    code: "Kr",
    escapeValue: 0.29,
    atomicMass: 84,
    boilingPointK: 120,
    meltingPointK: 115,
    relativeAbundance: 2,
    taint: false
  },
  {
    gas: "Sulphuric Acid",
    code: "H2SO4",
    escapeValue: 0.24,
    atomicMass: 98,
    boilingPointK: 718,
    meltingPointK: 388,
    relativeAbundance: 20,
    taint: true
  }
];

module.exports = AtmosphericGasComposition;
