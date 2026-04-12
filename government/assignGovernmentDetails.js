const {twoD6, d6} = require("../dice");

const assignCentralisation = (planet) => {
  let r = twoD6();
  const gov = planet.government.code;
  const pcr = planet.population.concentrationRating;

  if (gov >= 2 && gov <= 5) r -= 1;
  else if (gov === 6 || (gov >= 8 && gov <= 11)) r += 1;
  else if (gov === 7) r += 1;
  else if (gov >= 12) r += 2;

  if (pcr <= 3) r -= 1;
  else if (pcr === 7 || pcr === 8) r += 1;
  else if (pcr === 9) r += 3;

  if (r <= 5) planet.government.centralisation = 'C';
  else if (r <= 8) planet.government.centralisation = 'F';
  else planet.government.centralisation = 'U';
}

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
  let r = twoD6();
  const gov = planet.government.code;

  if (planet.government.centralisation === 'C') r -= 2;
  else if (planet.government.centralisation === 'U') r += 2;

  switch (gov) {
    case 1:
    case 6:
    case 10:
    case 13:
    case 14:
      r += 6;
      break;
    case 2:
      r -= 4;
      break
    case 3:
    case 5:
    case 12:
      r -= 2;
      break
    case 11:
    case 15:
      r += 4;
      break
  }

  planet.government.authority = rollToAuthority(r);
}

const assignStructure = (planet) => {
  const governmentCode = planet.government.code;
  const authority = planet.government.authority;
  const centralisation = planet.government.centralisation;

  const structures = {
    executive: null,
    legislative: null,
    judicial: null
  }

  const authorityMap = {
    E: 'executive',
    L: 'legislative',
    J: 'judicial',
    B: 'balanced'
  }

  const authoritativeBranch =
    authorityMap[authority] === 'balanced' ? null : authorityMap[authority];

  const isUnitary = centralisation === 'U';

  const functionalStructureRoll = (dm = 0) => {
    const total = twoD6() + dm;

    if (total <= 3) return 'D';
    if (total === 4) return 'S';
    if (total === 5 || total === 6) return 'M';
    if (total === 7 || total === 8) return 'R';
    if (total === 9) return 'M';
    if (total === 10) return 'S';
    if (total === 11) return 'M';
    return 'S';
  }

  const legislativeAuthorityStructure = () => {
    const total = twoD6();

    if (total <= 3) return 'D';
    if (total <= 8) return 'M';
    return 'S';
  }

  const government3CFStructure = () => {
    return d6() <= 4 ? 'S' : 'M';
  }

  const authoritativeABDEStructure = () => {
    return d6() <= 5 ? 'R' : 'S';
  }

  const assignAllSame = (code) => {
    structures.executive = code;
    structures.legislative = code;
    structures.judicial = code;
  }

  const assignBranch = (branch) => {
    const isAuthoritative = authoritativeBranch === branch;
    const isBalancedLegislative = authority === 'B' && branch === 'legislative';

    if (governmentCode === 2 && (isAuthoritative || isBalancedLegislative)) {
      return 'D';
    }

    if (governmentCode === 8 || governmentCode === 9) {
      return 'M';
    }

    if (governmentCode === 3 || governmentCode === 12 || governmentCode === 15) {
      return government3CFStructure();
    }

    if ([10, 11, 13, 14].includes(governmentCode)) {
      if (isAuthoritative) return authoritativeABDEStructure();
      return functionalStructureRoll(2);
    }

    if (isAuthoritative && branch === 'legislative') {
      return legislativeAuthorityStructure();
    }

    return functionalStructureRoll();
  }

  if (authoritativeBranch) {
    const dominantStructure = assignBranch(authoritativeBranch);
    structures[authoritativeBranch] = dominantStructure;

    if (isUnitary && (dominantStructure === 'R' || dominantStructure === 'S')) {
      assignAllSame(dominantStructure);
    } else {
      for (const branch of ['executive', 'legislative', 'judicial']) {
        if (structures[branch] === null) {
          structures[branch] = assignBranch(branch);
        }
      }
    }
  } else {
    for (const branch of ['executive', 'legislative', 'judicial']) {
      structures[branch] = assignBranch(branch);
    }
  }

  planet.government.structure = structures;
}

const assignGovernmentDetails = (planet) => {
  assignCentralisation(planet);
  assignAuthority(planet);
  assignStructure(planet);
};

module.exports = {assignGovernmentDetails};