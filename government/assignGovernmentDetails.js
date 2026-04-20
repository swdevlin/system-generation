const {twoD6, d6} = require("../dice");

const assignCentralisation = (planet) => {
  const raw = twoD6();
  const gov = planet.government.code;
  const pcr = planet.population.concentrationRating;

  let govDM = 0;
  if (gov >= 2 && gov <= 5) govDM = -1;
  else if (gov === 6 || (gov >= 8 && gov <= 11)) govDM = 1;
  else if (gov === 7) govDM = 1;
  else if (gov >= 12) govDM = 2;

  let pcrDM = 0;
  if (pcr <= 3) pcrDM = -1;
  else if (pcr === 7 || pcr === 8) pcrDM = 1;
  else if (pcr === 9) pcrDM = 3;

  const total = raw + govDM + pcrDM;

  if (total <= 5) planet.government.centralisation = 'C';
  else if (total <= 8) planet.government.centralisation = 'F';
  else planet.government.centralisation = 'U';

  planet.buildLog?.push({
    'Government Centralisation': {
      inputs: { governmentCode: gov, concentrationRating: pcr },
      dms: { government: govDM, populationConcentration: pcrDM, total: govDM + pcrDM },
      roll: { raw, total },
      result: planet.government.centralisation,
    },
  });
};

function rollToAuthority(roll) {
  if (roll <= 4) return 'L'; // Legislative
  if (roll === 5) return 'E'; // Executive
  if (roll === 6) return 'J'; // Judicial
  if (roll === 7) return 'B'; // Balance
  if (roll === 8) return 'L'; // Legislative
  if (roll === 9) return 'B'; // Balance
  if (roll === 10) return 'E'; // Executive
  if (roll === 11) return 'J'; // Judicial
  return 'E'; // 12+
}

const assignAuthority = (planet) => {
  const raw = twoD6();
  const gov = planet.government.code;
  const centralisation = planet.government.centralisation;

  let centralisationDM = 0;
  if (centralisation === 'C') centralisationDM = -2;
  else if (centralisation === 'U') centralisationDM = 2;

  let govDM = 0;
  switch (gov) {
    case 1:
    case 6:
    case 10:
    case 13:
    case 14:
      govDM = 6;
      break;
    case 2:
      govDM = -4;
      break;
    case 3:
    case 5:
    case 12:
      govDM = -2;
      break;
    case 11:
    case 15:
      govDM = 4;
      break;
  }

  const total = raw + centralisationDM + govDM;
  planet.government.authority = rollToAuthority(total);

  planet.buildLog?.push({
    'Government Authority': {
      inputs: { governmentCode: gov, centralisation },
      dms: { centralisation: centralisationDM, government: govDM, total: centralisationDM + govDM },
      roll: { raw, total },
      result: planet.government.authority,
    },
  });
};

const assignStructure = (planet) => {
  const governmentCode = planet.government.code;
  const authority = planet.government.authority;
  const centralisation = planet.government.centralisation;

  const structures = {
    executive: null,
    legislative: null,
    judicial: null,
  };

  const authorityMap = {
    E: 'executive',
    L: 'legislative',
    J: 'judicial',
    B: 'balanced',
  };

  const authoritativeBranch =
    authorityMap[authority] === 'balanced' ? null : authorityMap[authority];

  const isUnitary = centralisation === 'U';

  const functionalStructureRoll = (dm = 0) => {
    const raw = twoD6();
    const total = raw + dm;
    let result;
    if (total <= 3) result = 'D';
    else if (total === 4) result = 'S';
    else if (total <= 6) result = 'M';
    else if (total <= 8) result = 'R';
    else if (total === 9) result = 'M';
    else if (total === 10) result = 'S';
    else if (total === 11) result = 'M';
    else result = 'S';
    return { result, roll: { raw, total, dm } };
  };

  const legislativeAuthorityStructure = () => {
    const raw = twoD6();
    let result;
    if (raw <= 3) result = 'D';
    else if (raw <= 8) result = 'M';
    else result = 'S';
    return { result, roll: { raw, total: raw, dm: 0 } };
  };

  const government3CFStructure = () => {
    const raw = d6();
    const result = raw <= 4 ? 'S' : 'M';
    return { result, roll: { raw, total: raw, dm: 0 } };
  };

  const authoritativeABDEStructure = () => {
    const raw = d6();
    const result = raw <= 5 ? 'R' : 'S';
    return { result, roll: { raw, total: raw, dm: 0 } };
  };

  const assignBranch = (branch) => {
    const isAuthoritative = authoritativeBranch === branch;
    const isBalancedLegislative = authority === 'B' && branch === 'legislative';

    if (governmentCode === 2 && (isAuthoritative || isBalancedLegislative))
      return { result: 'D', method: 'fixed-D', roll: null };

    if (governmentCode === 8 || governmentCode === 9)
      return { result: 'M', method: 'fixed-M', roll: null };

    if (governmentCode === 3 || governmentCode === 12 || governmentCode === 15) {
      const { result, roll } = government3CFStructure();
      return { result, method: 'government-3CF', roll };
    }

    if ([10, 11, 13, 14].includes(governmentCode)) {
      if (isAuthoritative) {
        const { result, roll } = authoritativeABDEStructure();
        return { result, method: 'authoritative-ABDE', roll };
      }
      const { result, roll } = functionalStructureRoll(2);
      return { result, method: 'functional', roll };
    }

    if (isAuthoritative && branch === 'legislative') {
      const { result, roll } = legislativeAuthorityStructure();
      return { result, method: 'legislative-authority', roll };
    }

    const { result, roll } = functionalStructureRoll();
    return { result, method: 'functional', roll };
  };

  const branchLog = {};

  if (authoritativeBranch) {
    const dominant = assignBranch(authoritativeBranch);
    structures[authoritativeBranch] = dominant.result;
    branchLog[authoritativeBranch] = dominant;

    if (isUnitary && (dominant.result === 'R' || dominant.result === 'S')) {
      for (const b of ['executive', 'legislative', 'judicial']) {
        structures[b] = dominant.result;
        if (b !== authoritativeBranch)
          branchLog[b] = { result: dominant.result, method: 'unitary-propagated', roll: null };
      }
    } else {
      for (const b of ['executive', 'legislative', 'judicial']) {
        if (structures[b] === null) {
          const entry = assignBranch(b);
          structures[b] = entry.result;
          branchLog[b] = entry;
        }
      }
    }
  } else {
    for (const b of ['executive', 'legislative', 'judicial']) {
      const entry = assignBranch(b);
      structures[b] = entry.result;
      branchLog[b] = entry;
    }
  }

  planet.government.structure = structures;

  planet.buildLog?.push({
    'Government Structure': {
      inputs: { governmentCode, authority, centralisation },
      branches: branchLog,
      result: { ...structures },
    },
  });
};

const assignGovernmentDetails = (planet) => {
  assignCentralisation(planet);
  assignAuthority(planet);
  assignStructure(planet);
};

module.exports = { assignGovernmentDetails, assignCentralisation, assignAuthority, assignStructure };
