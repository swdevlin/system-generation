const {d6} = require("../dice");
const {STELLAR_TYPES, isAnomaly} = require("../utils");
const DIAMETER = {
  'O0': {
    'Ia': 25,
    'Ib': 24,
    'II': 22,
    'III': 21,
    'IV': null,
    'V': 20,
    'VI': 0.18,
  },
  'O5': {
    'Ia': 22,
    'Ib': 20,
    'II': 18,
    'III': 15,
    'IV': null,
    'V': 12,
    'VI': 0.18,
  },
  'B0': {
    'Ia': 20,
    'Ib': 14,
    'II': 12,
    'III': 10,
    'IV': 8,
    'V': 7,
    'VI': 0.2,
  },
  'B5': {
    'Ia': 60,
    'Ib': 25,
    'II': 14,
    'III': 6,
    'IV': 5,
    'V': 3.5,
    'VI': 0.5,
  },
  'A0': {
    'Ia': 120,
    'Ib': 50,
    'II': 30,
    'III': 5,
    'IV': 4,
    'V': 2.2,
    'VI': null,
  },
  'A5': {
    'Ia': 180,
    'Ib': 75,
    'II': 45,
    'III': 5,
    'IV': 3,
    'V': 2,
    'VI': null,
  },
  'F0': {
    'Ia': 210,
    'Ib': 85,
    'II': 50,
    'III': 5,
    'IV': 3,
    'V': 1.7,
    'VI': null,
  },
  'F5': {
    'Ia': 280,
    'Ib': 115,
    'II': 66,
    'III': 5,
    'IV': 2,
    'V': 1.5,
    'VI': null,
  },
  'G0': {
    'Ia': 330,
    'Ib': 135,
    'II': 77,
    'III': 10,
    'IV': 3,
    'V': 1.1,
    'VI': 0.8,
  },
  'G5': {
    'Ia': 360,
    'Ib': 150,
    'II': 90,
    'III': 15,
    'IV': 4,
    'V': 0.95,
    'VI': 0.7,
  },
  'K0': {
    'Ia': 420,
    'Ib': 180,
    'II': 110,
    'III': 20,
    'IV': 6,
    'V': 0.9,
    'VI': 0.6,
  },
  'K5': {
    'Ia': 600,
    'Ib': 260,
    'II': 160,
    'III': 40,
    'IV': null,
    'V': 0.8,
    'VI': 0.5,
  },
  'M0': {
    'Ia': 900,
    'Ib': 380,
    'II': 230,
    'III': 60,
    'IV': null,
    'V': 0.7,
    'VI': 0.4,
  },
  'M5': {
    'Ia': 1200,
    'Ib': 600,
    'II': 350,
    'III': 100,
    'IV': null,
    'V': 0.2,
    'VI': 0.1,
  },
  'M9': {
    'Ia': 1800,
    'Ib': 800,
    'II': 500,
    'III': 200,
    'IV': null,
    'V': 0.1,
    'VI': 0.08,
  },
  'L0': {'': 0.1},
  'L5': {'': 0.08},
  'T0': {'': 0.09},
  'T5': {'': 0.11},
  'Y0': {'': 0.1},
  'Y5': {'': 0.1},
}

const starDiameter = (star) => {
  if (star.stellarType === STELLAR_TYPES.WhiteDwarf) {
    return 1 / star.mass * 0.01;
  } else if (star.stellarType === STELLAR_TYPES.BlackHole) {
    return 2.95 * star.mass;
  } else if (star.stellarType === STELLAR_TYPES.NeutronStar) {
    return 19 + d6();
  } else if (isAnomaly(star.stellarType)) {
    return null;
  } else {
    return DIAMETER[star.dataKey][star.stellarClass]
  }
}

module.exports = starDiameter;
