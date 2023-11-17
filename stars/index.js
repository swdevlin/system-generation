const MINIMUM_ALLOWABLE_ORBIT= {
  'O0': {
    'Ia': 0.63,
    'Ib': 0.6,
    'II': 0.55,
    'III': 0.53,
    'IV': null,
    'V': 20,
    'VI': 0.01,
  },
  'O5': {
    'Ia': 0.55,
    'Ib': 0.50,
    'II': 0.45,
    'III': 0.38,
    'IV': null,
    'V': 0.3,
    'VI': 0.01,
  },
  'B0': {
    'Ia': 0.5,
    'Ib': 0.35,
    'II': 0.3,
    'III': 0.25,
    'IV': 0.2,
    'V': 0.18,
    'VI': 0.01,
  },
  'B5': {
    'Ia': 1.67,
    'Ib': 0.63,
    'II': 0.35,
    'III': 0.15,
    'IV': 0.13,
    'V': 0.09,
    'VI': 0.01,
  },
  'A0': {
    'Ia': 3.34,
    'Ib': 1.4,
    'II': 0.75,
    'III': 0.13,
    'IV': 0.1,
    'V': 0.06,
    'VI': null,
  },
  'A5': {
    'Ia': 4.17,
    'Ib': 2.17,
    'II': 1.17,
    'III': 0.13,
    'IV': 0.07,
    'V': 0.05,
    'VI': null,
  },
  'F0': {
    'Ia': 4.42,
    'Ib': 2.5,
    'II': 1.33,
    'III': 0.13,
    'IV': 0.07,
    'V': 0.04,
    'VI': null,
  },
  'F5': {
    'Ia': 5,
    'Ib': 3.25,
    'II': 1.87,
    'III': 0.13,
    'IV': 0.06,
    'V': 0.03,
    'VI': null,
  },
  'G0': {
    'Ia': 5.21,
    'Ib': 3.59,
    'II': 2.24,
    'III': 0.25,
    'IV': 0.07,
    'V': 0.03,
    'VI': 0.02,
  },
  'G5': {
    'Ia': 5.34,
    'Ib': 3.84,
    'II': 2.67,
    'III': 0.38,
    'IV': 0.1,
    'V': 0.02,
    'VI': 0.02,
  },
  'K0': {
    'Ia': 5.59,
    'Ib': 4.17,
    'II': 3.17,
    'III': 0.5,
    'IV': 0.15,
    'V': 0.02,
    'VI': 0.02,
  },
  'K5': {
    'Ia': 6.17,
    'Ib': 4.84,
    'II': 4,
    'III': 1,
    'IV': null,
    'V': 0.02,
    'VI': 0.01,
  },
  'M0': {
    'Ia': 6.8,
    'Ib': 5.42,
    'II': 4.59,
    'III': 1.68,
    'IV': null,
    'V': 0.02,
    'VI': 0.01,
  },
  'M5': {
    'Ia': 7.2,
    'Ib': 6.59,
    'II': 5.92,
    'III': 4.34,
    'IV': null,
    'V': 0.01,
    'VI': 0.01,
  },
  'M9': {
    'Ia': 7.8,
    'Ib': 6.59,
    'II': 5.92,
    'III': 4.34,
    'IV': null,
    'V': 0.01,
    'VI': 0.01,
  },
  'L0': {'': 0.005},
  'L5': {'': 0.005},
  'T0': {'': 0.005},
  'T5': {'': 0.005},
  'Y0': {'': 0.005},
  'Y5': {'': 0.005},
}

module.exports.MINIMUM_ALLOWABLE_ORBIT = MINIMUM_ALLOWABLE_ORBIT;

module.exports.Star = require("./star");
module.exports.starDiameter = require("./starDiameter");
module.exports.starMass = require("./starMass");
module.exports.starTemperature = require("./starTemperature");
module.exports.starEccentricity = require("./starEccentricity");
module.exports.generateStar = require("./generateStar");
module.exports.stellarTypeLookup = require("./stellarTypeLookup");
module.exports.subtypeLookup = require("./subtypeLookup");
module.exports.addCompanion = require("./addCompanion");
module.exports.generateCloseCompanion = require("./generateCloseCompanion");
module.exports.generateNearCompanion = require("./generateNearCompanion");
module.exports.generateFarCompanion = require("./generateFarCompanion");
