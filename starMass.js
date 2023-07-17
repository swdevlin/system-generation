const {determineDataKey} = require("./utils");
const {twoD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const MASS = {
  'O0': {
    'Ia': 200,
    'Ib': 150,
    'II': 130,
    'III': 110,
    'IV': null,
    'V': 90,
    'VI': 2,
  },
  'O5': {
    'Ia': 80,
    'Ib': 60,
    'II': 40,
    'III': 30,
    'IV': null,
    'V': 60,
    'VI': 1.5,
  },
  'B0': {
    'Ia': 60,
    'Ib': 40,
    'II': 30,
    'III': 20,
    'IV': 20,
    'V': 18,
    'VI': 0.5,
  },
  'B5': {
    'Ia': 30,
    'Ib': 25,
    'II': 20,
    'III': 10,
    'IV': 10,
    'V': 5,
    'VI': 0.4,
  },
  'A0': {
    'Ia': 20,
    'Ib': 15,
    'II': 14,
    'III': 8,
    'IV': 4,
    'V': 2.2,
    'VI': null,
  },
  'A5': {
    'Ia': 15,
    'Ib': 13,
    'II': 11,
    'III': 6,
    'IV': 2.3,
    'V': 1.8,
    'VI': null,
  },
  'F0': {
    'Ia': 13,
    'Ib': 12,
    'II': 10,
    'III': 4,
    'IV': 2,
    'V': 1.5,
    'VI': null,
  },
  'F5': {
    'Ia': 12,
    'Ib': 10,
    'II': 8,
    'III': 3,
    'IV': 1.5,
    'V': 1.3,
    'VI': null,
  },
  'G0': {
    'Ia': 12,
    'Ib': 10,
    'II': 8,
    'III': 2.5,
    'IV': 1.7,
    'V': 1.1,
    'VI': 0.8,
  },
  'G5': {
    'Ia': 13,
    'Ib': 11,
    'II': 10,
    'III': 2.4,
    'IV': 1.2,
    'V': 0.9,
    'VI': 0.7,
  },
  'K0': {
    'Ia': 14,
    'Ib': 12,
    'II': 10,
    'III': 1.1,
    'IV': 1.5,
    'V': 0.8,
    'VI': 0.6,
  },
  'K5': {
    'Ia': 18,
    'Ib': 13,
    'II': 12,
    'III': 1.5,
    'IV': null,
    'V': 0.7,
    'VI': 0.5,
  },
  'M0': {
    'Ia': 20,
    'Ib': 15,
    'II': 14,
    'III': 1.8,
    'IV': null,
    'V': 0.5,
    'VI': 0.4,
  },
  'M5': {
    'Ia': 25,
    'Ib': 20,
    'II': 16,
    'III': 2.4,
    'IV': null,
    'V': 0.16,
    'VI': 0.12,
  },
  'M9': {
    'Ia': 30,
    'Ib': 25,
    'II': 18,
    'III': 8,
    'IV': null,
    'V': 0.08,
    'VI': 0.075,
  },
  'L0': {'': 0.08},
  'L5': {'': 0.06},
  'T0': {'': 0.05},
  'T5': {'': 0.04},
  'Y0': {'': 0.025},
  'Y5': {'': 0.013},
}

const starMass= (star) => {
  if (star.stellarType === 'D') {
    return (twoD6()-1)/10 + r.die(10)/100;
  } else {
    let dataKey = determineDataKey(star.stellarType, star.subtype);
    return MASS[dataKey][star.stellarClass]
  }
}

module.exports = starMass;
