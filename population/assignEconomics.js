const {
  isAgricultural,
  isIndustrial,
  isRich,
  isAsteroid,
  isGarden,
  isNonAgricultural,
  isNonIndustrial,
  isPoor,
} = require('../economics/assignTradeCodes');
const { d6, twoD6, d3 } = require('../dice');

// WBH 186

function determineImportance(starSystem, planet) {
  let importance = 0;
  if (planet.population.code <= 6) importance -= 1;
  else if (planet.population.code >= 9) importance += 1;

  if (isAgricultural(planet)) importance += 1;
  if (isIndustrial(planet)) importance += 1;
  if (isRich(planet)) importance += 1;

  if ((starSystem?.bases?.length ?? 0) >= 2) importance += 1;

  if (planet.starPort === 'A' || planet.starPort === 'B') importance += 1;
  else if (planet.starPort === 'D' || planet.starPort === 'E' || planet.starPort === 'X')
    importance -= 1;

  if (planet.techLevel <= 8) importance -= 1;
  else if (planet.techLevel <= 15) importance += 1;
  else importance += 2;

  planet.economics.importance = importance;
}

const determineResourceFactor = (starSystem, planet) => {
  let rf = 0;

  if (planet.techLevel >= 8) rf += starSystem.gasGiants + starSystem.planetoidBelts;

  if (isIndustrial(planet)) rf += 1 - d6();

  // as per https://forum.mongoosepublishing.com/threads/world-builders-handbook-feedback.124027/page-9
  if (isAgricultural(planet)) rf += 1 - d6();

  planet.economics.resourceFactor = rf;
};

const determineLabourFactor = (planet) => {
  if (planet.population.code < 2) planet.economics.labourFactor = 0;
  else planet.economics.labourFactor = planet.population.code - 1;
};

const determineInfrastructure = (planet) => {
  let infra = planet.economics.importance;

  if (planet.population.code >= 4 && planet.population.code <= 6) infra += d6();
  else if (planet.population.code >= 7) infra += twoD6();

  planet.economics.infrastructure = Math.max(0, infra);
};

const determineEfficiency = (planet) => {
  let eff = 0;

  if (planet.population.code >= 1 && planet.population.code <= 6) eff = twoD6() - 7;
  else if (planet.population.code >= 7) eff = d3() + d3() - 4;

  eff += [0, 3, 6, 9, 11, 12, 15].includes(planet.government.code)
    ? -1
    : [1, 2, 4, 5, 8].includes(planet.government.code)
      ? 1
      : 0;

  if (planet.lawLevel.code <= 4) eff += 1;
  else if (planet.lawLevel.code >= 10) eff -= 1;

  if (planet.population.concentrationRating <= 3) eff -= 1;
  else if (planet.population.concentrationRating >= 8) eff += 1;

  if (planet.population.progressiveness <= 3) eff -= 1;
  else if (planet.population.progressiveness >= 9) eff += 1;

  if (planet.population.expansionism <= 3) eff -= 1;
  else if (planet.population.expansionism >= 9) eff += 1;

  if (eff === 0) eff = 1;

  planet.economics.efficiency = Math.min(5, Math.max(-5, eff));
};

const determineResourceUnits = (planet) => {
  planet.economics.resourceUnits =
    Math.max(1, planet.economics.resourceFactor) *
    Math.max(1, planet.economics.labourFactor) *
    Math.max(1, planet.economics.infrastructure) *
    planet.economics.efficiency;
};

const determineGrossWorldProduct = (planet) => {
  let gwp = planet.economics.resourceFactor + planet.economics.infrastructure;
  gwp = Math.max(2, Math.min(gwp, planet.economics.infrastructure * 2));

  let modifier = 1;
  modifier *= Math.max(0.05, planet.techLevel / 10);

  modifier +=
    planet.starPort === 'A'
      ? 1.5
      : planet.starPort === 'B'
        ? 1.2
        : planet.starPort === 'C'
          ? 1.0
          : planet.starPort === 'D'
            ? 0.8
            : planet.starPort === 'E'
              ? 0.5
              : planet.starPort === 'F'
                ? 0.9
                : planet.starPort === 'G'
                  ? 0.7
                  : planet.starPort === 'H'
                    ? 0.4
                    : planet.starPort === 'Y' || planet.starPort === 'X'
                      ? 0.2
                      : 1.0;

  modifier *=
    planet.government.code === 0
      ? 1.0
      : planet.government.code === 1
        ? 1.5
        : planet.government.code === 2
          ? 1.2
          : planet.government.code === 3
            ? 0.8
            : planet.government.code === 4
              ? 1.2
              : planet.government.code === 5
                ? 1.3
                : planet.government.code === 6
                  ? 0.6
                  : planet.government.code === 7
                    ? 1.0
                    : planet.government.code === 8
                      ? 0.9
                      : planet.government.code === 9
                        ? 0.8
                        : planet.government.code === 10
                          ? 1.0 // A
                          : planet.government.code === 11
                            ? 0.7 // B
                            : planet.government.code === 12
                              ? 1.0 // C
                              : planet.government.code === 13
                                ? 0.6 // D
                                : planet.government.code === 14
                                  ? 0.5 // E
                                  : planet.government.code === 15
                                    ? 0.8 // F
                                    : 1.0;

  modifier *=
    (isAgricultural(planet) ? 0.9 : 1.0) *
    (isAsteroid(planet) ? 1.2 : 1.0) *
    (isGarden(planet) ? 1.2 : 1.0) *
    (isIndustrial(planet) ? 1.1 : 1.0) *
    (isNonAgricultural(planet) ? 0.9 : 1.0) *
    (isNonIndustrial(planet) ? 0.9 : 1.0) *
    (isPoor(planet) ? 0.8 : 1.0) *
    (isRich(planet) ? 1.2 : 1.0);

  if (planet.economics.efficiency > 0) gwp = 1000 * gwp * modifier * planet.economics.efficiency;
  else gwp = (1000 * gwp * modifier) / (-1 * (planet.economics.efficiency - 1));
  planet.economics.perCapitaGWP = gwp;
  planet.economics.totalGWP = gwp * 10 ** planet.population.code;
};

// WTN starport modifier lookup table (WBH 186).
// baseWtn is the WTN before the starport modifier is applied.
const wtnStarportModifier = (baseWtn, starPort) => {
  const sp = starPort;
  if (baseWtn <= 1)
    return sp === 'A'
      ? 3
      : sp === 'B'
        ? 2
        : sp === 'C'
          ? 2
          : sp === 'D'
            ? 1
            : sp === 'E'
              ? 1
              : sp === 'X'
                ? 0
                : 0;
  if (baseWtn <= 3)
    return sp === 'A'
      ? 2
      : sp === 'B'
        ? 2
        : sp === 'C'
          ? 1
          : sp === 'D'
            ? 1
            : sp === 'E'
              ? 0
              : sp === 'X'
                ? 0
                : 0;
  if (baseWtn <= 5)
    return sp === 'A'
      ? 2
      : sp === 'B'
        ? 1
        : sp === 'C'
          ? 1
          : sp === 'D'
            ? 0
            : sp === 'E'
              ? 0
              : sp === 'X'
                ? -5
                : 0;
  if (baseWtn <= 7)
    return sp === 'A'
      ? 1
      : sp === 'B'
        ? 1
        : sp === 'C'
          ? 0
          : sp === 'D'
            ? 0
            : sp === 'E'
              ? -1
              : sp === 'X'
                ? -6
                : 0;
  if (baseWtn <= 9)
    return sp === 'A'
      ? 1
      : sp === 'B'
        ? 0
        : sp === 'C'
          ? 0
          : sp === 'D'
            ? -1
            : sp === 'E'
              ? -2
              : sp === 'X'
                ? -7
                : 0;
  if (baseWtn <= 11)
    return sp === 'A'
      ? 0
      : sp === 'B'
        ? 0
        : sp === 'C'
          ? -1
          : sp === 'D'
            ? -2
            : sp === 'E'
              ? -3
              : sp === 'X'
                ? -8
                : 0;
  if (baseWtn <= 13)
    return sp === 'A'
      ? 0
      : sp === 'B'
        ? -1
        : sp === 'C'
          ? -2
          : sp === 'D'
            ? -3
            : sp === 'E'
              ? -4
              : sp === 'X'
                ? -9
                : 0;
  return sp === 'A'
    ? 0
    : sp === 'B'
      ? -2
      : sp === 'C'
        ? -3
        : sp === 'D'
          ? -4
          : sp === 'E'
            ? -5
            : sp === 'X'
              ? -10
              : 0;
};

const determineWorldTradeNumber = (planet) => {
  let wtn = planet.population.code;

  if (planet.techLevel <= 1) wtn -= 1;
  else if (planet.techLevel >= 5 && planet.techLevel <= 8) wtn += 1;
  else if (planet.techLevel <= 14) wtn += 2;
  else wtn += 3;

  wtn += wtnStarportModifier(wtn, planet.starPort);
  planet.economics.worldTradeNumber = Math.max(0, wtn);
};

const determineInequalityRating = (planet) => {
  let ir = 50 - planet.economics.efficiency * 5 + (twoD6() - 7) * 2;

  ir += [6, 11, 15].includes(planet.government.code) ? 10 : 0;
  ir += [0, 1, 3, 9, 12].includes(planet.government.code) ? 5 : 0;
  ir -= [4, 8].includes(planet.government.code) ? 5 : 0;
  ir -= planet.government.code === 2 ? 10 : 0;

  if (planet.lawLevel.code >= 9) ir += planet.lawLevel.code - 8;

  ir += planet.population.concentrationRating;
  ir -= planet.economics.infrastructure;

  planet.economics.inequalityRating = ir;
};

const determineDevelopmentScore = (planet) => {
  let ds = (planet.economics.perCapitaGWP / 1000) * (1 - planet.economics.inequalityRating / 100);

  planet.economics.developmentScore = ds;
};

// Resolves a tariff roll (after DMs) to a regime and rate.
// Re-roll cases (4, 5) use 1D+5, ignoring the normal DMs.
const resolveTariffRoll = (roll) => {
  if (roll <= 3) return { regime: 'free_trade', rate: null };

  if (roll === 4) {
    const { rate } = resolveTariffRoll(d6() + 5);
    return { regime: 'foreign_polity', rate };
  }

  if (roll === 5) {
    const { rate } = resolveTariffRoll(d6() + 5);
    return { regime: 'class_goods', rate };
  }

  if (roll === 6) return { regime: 'low', rate: d6() };
  if (roll === 7) return { regime: 'moderate', rate: twoD6() };
  if (roll <= 9) return { regime: 'varying', rate: null };
  if (roll <= 11) return { regime: 'high', rate: twoD6() * 5 };
  if (roll <= 13) return { regime: 'extreme', rate: twoD6() * 10 };
  return { regime: 'prohibitive', rate: twoD6() * 20 };
};

// WBH 188 (Tariff Rates table)
const determineTariffs = (planet) => {
  // Re-derive base WTN (before starport modifier) to look up the modifier.
  let baseWtn = planet.population.code;
  if (planet.techLevel <= 1) baseWtn -= 1;
  else if (planet.techLevel >= 5 && planet.techLevel <= 8) baseWtn += 1;
  else if (planet.techLevel <= 14) baseWtn += 2;
  else baseWtn += 3;

  const spMod = wtnStarportModifier(baseWtn, planet.starPort);

  let dm = 0;

  if (planet.government.code === 0) dm -= 7;
  else if (planet.government.code === 2 || planet.government.code === 4) dm -= 4;
  else if (planet.government.code === 9) dm += 2;

  if (planet.lawLevel.code >= 9) dm += 2;

  // planet.freeport is not yet assigned by any pipeline step; defaults to falsy.
  if (planet.freeport) dm -= 7;

  const xeno = planet.population.xenophilia;
  if (xeno >= 1 && xeno <= 3) dm += 2;
  else if (xeno >= 9) dm -= 2;

  // "DM-WTN starport modifier (positive DM for a negative modifier)"
  dm -= spMod;

  const roll = twoD6() + dm;
  planet.economics.tariffs = resolveTariffRoll(roll);
};

const assignEconomics = (starSystem, planet) => {
  planet.economics = {};
  determineImportance(starSystem, planet);
  determineResourceFactor(starSystem, planet);
  determineLabourFactor(planet);
  determineInfrastructure(planet);
  determineEfficiency(planet);
  determineResourceUnits(planet);
  determineGrossWorldProduct(planet);
  determineWorldTradeNumber(planet);
  determineInequalityRating(planet);
  determineDevelopmentScore(planet);
  determineTariffs(planet);
};

module.exports = { assignEconomics };
