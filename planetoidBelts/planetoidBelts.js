const {twoD6, d6, d3, d2, d100} = require("../dice");
const {ORBIT_TYPES} = require("../utils");
const TerrestrialPlanet = require("../terrestrialPlanet/terrestrialPlanet");
const assignPhysicalCharacteristics = require("../terrestrialPlanet/assignPhysicalCharacteristics");
const densityIndexDM = require("../utils/densityIndexDM");
const Random = require("random-js").Random;

const r = new Random();

const planetoidBeltQuantity = (solarSystem, densityIndex) => {
  let planetoidBelts = 0;
  if (twoD6() >= 8) {
    let dm = 0;
    if (solarSystem.gasGiants > 0)
      dm += 1;
    if (solarSystem.starCount > 2)
      dm += 1;
    dm += densityIndexDM(densityIndex);

    const roll = twoD6() + dm;
    if (roll <= 6 )
      planetoidBelts = 1;
    else if (roll <= 11 )
      planetoidBelts = 2;
    else
      planetoidBelts = 3;
  }
  return planetoidBelts;
}

const determineBeltComposition = (star, belt) => {
  let roll = twoD6();
  belt.buildLog.push(`composition roll ${roll}`);
  if (belt.effectiveHZCODeviation < 0) {
    roll -= 4;
    belt.buildLog.push(`effectiveHZCODeviation DM -4`);
  } else if (belt.effectiveHZCODeviation > 2) {
    roll += 4;
    belt.buildLog.push(`effectiveHZCODeviation DM +4`);
  }

  if (roll < 1) {
    belt.mType = 60 + d6() * 5;
    belt.sType = d6() * 5;
    belt.cType = 0;
  } else if (roll === 1) {
    belt.mType = 50 + d6() * 5;
    belt.sType = 5 + d6() * 5;
    belt.cType = d3();
  } else if (roll === 2) {
    belt.mType = 40 + d6() * 5;
    belt.sType = 15 + d6() * 5;
    belt.cType = d6();
  } else if (roll === 3) {
    belt.mType = 25 + d6() * 5;
    belt.sType = 30 + d6() * 5;
    belt.cType = d6();
  } else if (roll === 4) {
    belt.mType = 15 + d6() * 5;
    belt.sType = 35 + d6() * 5;
    belt.cType =  5 + d6();
  } else if (roll === 5) {
    belt.mType =  5 + d6() * 5;
    belt.sType = 40 + d6() * 5;
    belt.cType =  5 + d6() * 2;
  } else if (roll === 6) {
    belt.mType =  d6() * 5;
    belt.sType = 40 + d6() * 5;
    belt.cType =  d6() * 5;
  } else if (roll === 7) {
    belt.mType =  5 + d6() * 2;
    belt.sType = 35 + d6() * 5;
    belt.cType = 10 + d6() * 5;
  } else if (roll === 8) {
    belt.mType =  5 + d6();
    belt.sType = 30 + d6() * 5;
    belt.cType = 20 + d6() * 5;
  } else if (roll === 9) {
    belt.mType = d6();
    belt.sType = 15 + d6() * 5;
    belt.cType = 40 + d6() * 5;
  } else if (roll === 10) {
    belt.mType = d6();
    belt.sType = 5 + d6() * 5;
    belt.cType = 50 + d6() * 5;
  } else if (roll === 11) {
    belt.mType = d3();
    belt.sType = 5 + d6() * 2;
    belt.cType = 60 + d6() * 5;
  } else {
    belt.mType = 0;
    belt.sType = d6();
    belt.cType = 70 + d6() * 5;
  }

  let total = belt.mType + belt.cType + belt.sType;
  while (total > 100) {
    if (belt.mType > 0)
      belt.mType = Math.max(0, belt.mType - (total - 100));
    else if (belt.sType > 0)
      belt.sType = Math.max(0, belt.sType - (total - 100));
    total = belt.mType + belt.cType + belt.sType;
  }
  belt.oType = 100 - total;
};

const determineBeltBulk = (star, belt) => {
  let bulk = twoD6() + 2;
  belt.buildLog.push(`bulk roll ${bulk}`);
  bulk -= Math.floor(star.age/2);
  bulk += Math.floor(belt.cType/10);
  belt.bulk = Math.max(1, bulk);
};

const determineBeltResourceRating = (star, belt) => {
  let r = twoD6();
  belt.buildLog.push(`resource rating roll ${r}`);
  let rating = r - 7 + belt.bulk;
  rating += Math.floor(belt.mType/10);
  rating -= Math.floor(belt.cType/10);
  belt.resourceRating = Math.min(12, Math.max(2, rating));
};

const significantBodyType = (belt) => {
  let roll = d100();
  roll -= belt.mType;
  if (roll <= 0)
    return "Mostly Metal";
  roll -= belt.sType;
  if (roll <= 0)
    return "Mostly Rock";
  return "Mostly Ice";
}

const calculateOrbitOffset = (star, belt) => {
  let orbitOffset;
  do {
    orbitOffset = star.spread * ((twoD6() - 7) * belt.span)/4;
    orbitOffset *= r.real(.95, 1.05);
  } while (Math.abs(orbitOffset) > star.spread);
  return orbitOffset;
}
const addSignificantBodies = (star, belt) => {
  let bodies = twoD6() - 12 + belt.bulk;
  if (belt.span < 0.1)
    bodies -= 4;
  if (belt.effectiveHZCODeviation > 3)
    bodies += 2;
  for (let i=0; i < bodies; i++) {
    let orbit = belt.orbit + calculateOrbitOffset(star, belt);
    const p = new TerrestrialPlanet(1, orbit);
    p.setOrbit(star, orbit);
    assignPhysicalCharacteristics(star, p);
    p.orbitType = ORBIT_TYPES.PLANETOID_BELT_OBJECT;
    star.addStellarObject(p);
  }

  bodies = twoD6() - 10;
  let dm = 0;
  if (belt.effectiveHZCODeviation >= 2 && belt.effectiveHZCODeviation <= 3)
    dm += 1;
  if (belt.effectiveHZCODeviation > 3)
    dm += 3;
  if (belt.span > 1)
    dm += 1;
  bodies += (dm+1) * (belt.bulk + 1);
  if (belt.span < 0.1)
    bodies /= 2;

  bodies = Math.ceil(bodies);
  for (let i=0; i < bodies; i++) {
    let orbit = belt.orbit + calculateOrbitOffset(star, belt);
    const p = new TerrestrialPlanet('S', orbit);
    p.setOrbit(star, orbit);
    assignPhysicalCharacteristics(star, p);
    p.orbitType = ORBIT_TYPES.PLANETOID_BELT_OBJECT;
    star.addStellarObject(p);
  }

};

module.exports = {
  planetoidBeltQuantity: planetoidBeltQuantity,
  determineBeltComposition: determineBeltComposition,
  determineBeltBulk: determineBeltBulk,
  determineBeltResourceRating: determineBeltResourceRating,
  addSignificantBodies: addSignificantBodies,
};
