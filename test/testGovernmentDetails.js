'use strict';

const chai = require('chai');
const { ROLL_CACHE, clearCache } = require('../dice');
const {
  assignCentralisation,
  assignAuthority,
  assignStructure,
} = require('../government/assignGovernmentDetails');

chai.should();

function makePlanet({ govCode = 5, pcr = 5, centralisation = 'F', authority = 'B' } = {}) {
  return {
    government: { code: govCode, centralisation, authority, structure: null },
    population: { concentrationRating: pcr },
    buildLog: [],
  };
}

describe('assignCentralisation', function () {
  beforeEach(() => clearCache());

  it('raw 7, no DMs → F', function () {
    const planet = makePlanet({ govCode: 0, pcr: 5 });
    ROLL_CACHE.push(3, 4);
    assignCentralisation(planet);
    planet.government.centralisation.should.equal('F');
    const e = planet.buildLog[0]['Government Centralisation'];
    e.roll.raw.should.equal(7);
    e.roll.total.should.equal(7);
    e.dms.total.should.equal(0);
  });

  it('raw 5, no DMs → C', function () {
    const planet = makePlanet({ govCode: 0, pcr: 5 });
    ROLL_CACHE.push(2, 3);
    assignCentralisation(planet);
    planet.government.centralisation.should.equal('C');
  });

  it('raw 9, no DMs → U', function () {
    const planet = makePlanet({ govCode: 0, pcr: 5 });
    ROLL_CACHE.push(4, 5);
    assignCentralisation(planet);
    planet.government.centralisation.should.equal('U');
  });

  it('govCode 12 applies +2 DM: raw 5 → total 7 → F', function () {
    const planet = makePlanet({ govCode: 12, pcr: 5 });
    ROLL_CACHE.push(2, 3);
    assignCentralisation(planet);
    planet.government.centralisation.should.equal('F');
    const e = planet.buildLog[0]['Government Centralisation'];
    e.dms.government.should.equal(2);
    e.roll.total.should.equal(7);
  });

  it('govCode 4 applies -1 DM: raw 6 → total 5 → C', function () {
    const planet = makePlanet({ govCode: 4, pcr: 5 });
    ROLL_CACHE.push(3, 3);
    assignCentralisation(planet);
    planet.government.centralisation.should.equal('C');
    planet.buildLog[0]['Government Centralisation'].dms.government.should.equal(-1);
  });

  it('pcr ≤ 3 applies -1 DM: raw 6 → total 5 → C', function () {
    const planet = makePlanet({ govCode: 0, pcr: 2 });
    ROLL_CACHE.push(3, 3);
    assignCentralisation(planet);
    planet.government.centralisation.should.equal('C');
    planet.buildLog[0]['Government Centralisation'].dms.populationConcentration.should.equal(-1);
  });

  it('pcr 9 applies +3 DM: raw 7 → total 10 → U', function () {
    const planet = makePlanet({ govCode: 0, pcr: 9 });
    ROLL_CACHE.push(3, 4);
    assignCentralisation(planet);
    planet.government.centralisation.should.equal('U');
  });
});

describe('assignAuthority', function () {
  beforeEach(() => clearCache());

  it('centralisation C applies -2 DM: raw 7 → total 5 → E', function () {
    const planet = makePlanet({ govCode: 0, centralisation: 'C' });
    ROLL_CACHE.push(3, 4);
    assignAuthority(planet);
    const e = planet.buildLog[0]['Government Authority'];
    e.dms.centralisation.should.equal(-2);
    e.result.should.equal('E');
  });

  it('centralisation U applies +2 DM', function () {
    const planet = makePlanet({ govCode: 0, centralisation: 'U' });
    ROLL_CACHE.push(3, 4);
    assignAuthority(planet);
    planet.buildLog[0]['Government Authority'].dms.centralisation.should.equal(2);
  });

  it('govCode 1 applies +6 DM: raw 4 → total 10 → E', function () {
    const planet = makePlanet({ govCode: 1, centralisation: 'F' });
    ROLL_CACHE.push(2, 2);
    assignAuthority(planet);
    const e = planet.buildLog[0]['Government Authority'];
    e.dms.government.should.equal(6);
    e.result.should.equal('E');
  });

  it('govCode 2 applies -4 DM: raw 8 → total 4 → L', function () {
    const planet = makePlanet({ govCode: 2, centralisation: 'F' });
    ROLL_CACHE.push(4, 4);
    assignAuthority(planet);
    const e = planet.buildLog[0]['Government Authority'];
    e.dms.government.should.equal(-4);
    e.result.should.equal('L');
  });

  it('rollToAuthority: raw 7 → B', function () {
    const planet = makePlanet({ govCode: 0, centralisation: 'F' });
    ROLL_CACHE.push(3, 4);
    assignAuthority(planet);
    planet.government.authority.should.equal('B');
  });
});

describe('assignStructure', function () {
  beforeEach(() => clearCache());

  it('govCode 8 → all branches fixed M, no rolls consumed', function () {
    const planet = makePlanet({ govCode: 8, authority: 'B' });
    assignStructure(planet);
    planet.government.structure.executive.should.equal('M');
    planet.government.structure.legislative.should.equal('M');
    planet.government.structure.judicial.should.equal('M');
    const e = planet.buildLog[0]['Government Structure'];
    e.branches.executive.method.should.equal('fixed-M');
  });

  it('govCode 9 → all branches fixed M', function () {
    const planet = makePlanet({ govCode: 9, authority: 'E' });
    assignStructure(planet);
    planet.government.structure.executive.should.equal('M');
    planet.government.structure.legislative.should.equal('M');
    planet.government.structure.judicial.should.equal('M');
  });

  it('govCode 2, authority L → legislative = D', function () {
    const planet = makePlanet({ govCode: 2, authority: 'L' });
    ROLL_CACHE.push(3, 4, 3, 4);
    assignStructure(planet);
    planet.government.structure.legislative.should.equal('D');
    planet.buildLog[0]['Government Structure'].branches.legislative.method.should.equal('fixed-D');
  });

  it('govCode 2, authority B → balanced-legislative = D', function () {
    const planet = makePlanet({ govCode: 2, authority: 'B' });
    ROLL_CACHE.push(3, 4, 3, 4, 3, 4);
    assignStructure(planet);
    planet.government.structure.legislative.should.equal('D');
  });

  it('govCode 3 → government-3CF: d6 ≤ 4 → S', function () {
    const planet = makePlanet({ govCode: 3, authority: 'B' });
    ROLL_CACHE.push(2, 2, 2);
    assignStructure(planet);
    planet.government.structure.executive.should.equal('S');
    planet.buildLog[0]['Government Structure'].branches.executive.method.should.equal('government-3CF');
  });

  it('govCode 3 → government-3CF: d6 5 or 6 → M', function () {
    const planet = makePlanet({ govCode: 3, authority: 'B' });
    ROLL_CACHE.push(5, 5, 5);
    assignStructure(planet);
    planet.government.structure.executive.should.equal('M');
  });

  it('govCode 10, authority E → executive uses authoritative-ABDE (d6 ≤ 5 → R)', function () {
    const planet = makePlanet({ govCode: 10, authority: 'E' });
    ROLL_CACHE.push(3,     // executive: authoritativeABDEStructure d6=3 → R
                   3, 4,  // legislative: functional raw=7 dm=+2 → total 9 → M
                   3, 4); // judicial: functional raw=7 dm=+2 → total 9 → M
    assignStructure(planet);
    planet.government.structure.executive.should.equal('R');
    planet.buildLog[0]['Government Structure'].branches.executive.method.should.equal('authoritative-ABDE');
  });

  it('govCode 10, authority E → non-authoritative branches use functional +2 DM', function () {
    const planet = makePlanet({ govCode: 10, authority: 'E' });
    ROLL_CACHE.push(3, 3, 4, 3, 4);
    assignStructure(planet);
    const e = planet.buildLog[0]['Government Structure'];
    e.branches.legislative.method.should.equal('functional');
    e.branches.legislative.roll.dm.should.equal(2);
  });

  it('authority L + legislative authoritative → legislative uses legislative-authority', function () {
    const planet = makePlanet({ govCode: 0, authority: 'L' });
    ROLL_CACHE.push(3, 4,  // legislative: legislativeAuthorityStructure raw=7 → M
                   3, 4,  // executive: functional
                   3, 4); // judicial: functional
    assignStructure(planet);
    planet.buildLog[0]['Government Structure'].branches.legislative.method.should.equal('legislative-authority');
  });

  it('functional: 2d6=2 → D', function () {
    const planet = makePlanet({ govCode: 0, authority: 'B' });
    ROLL_CACHE.push(1, 1, 1, 1, 1, 1);
    assignStructure(planet);
    planet.government.structure.executive.should.equal('D');
  });

  it('functional: 2d6=4 → S', function () {
    const planet = makePlanet({ govCode: 0, authority: 'B' });
    ROLL_CACHE.push(2, 2, 2, 2, 2, 2);
    assignStructure(planet);
    planet.government.structure.executive.should.equal('S');
  });

  it('functional: 2d6=7 → R', function () {
    const planet = makePlanet({ govCode: 0, authority: 'B' });
    ROLL_CACHE.push(3, 4, 3, 4, 3, 4);
    assignStructure(planet);
    planet.government.structure.executive.should.equal('R');
  });

  it('functional: 2d6=9 → M', function () {
    const planet = makePlanet({ govCode: 0, authority: 'B' });
    ROLL_CACHE.push(4, 5, 4, 5, 4, 5);
    assignStructure(planet);
    planet.government.structure.executive.should.equal('M');
  });

  it('functional: 2d6=11 → M', function () {
    const planet = makePlanet({ govCode: 0, authority: 'B' });
    ROLL_CACHE.push(5, 6, 5, 6, 5, 6);
    assignStructure(planet);
    planet.government.structure.executive.should.equal('M');
  });

  it('functional: 2d6=12 → S', function () {
    const planet = makePlanet({ govCode: 0, authority: 'B' });
    ROLL_CACHE.push(6, 6, 6, 6, 6, 6);
    assignStructure(planet);
    planet.government.structure.executive.should.equal('S');
  });

  it('unitary centralisation propagates dominant structure to all branches', function () {
    const planet = makePlanet({ govCode: 0, authority: 'E', centralisation: 'U' });
    ROLL_CACHE.push(4, 4); // executive: functional raw=8 → R; unitary propagates R
    assignStructure(planet);
    planet.government.structure.executive.should.equal('R');
    planet.government.structure.legislative.should.equal('R');
    planet.government.structure.judicial.should.equal('R');
    planet.buildLog[0]['Government Structure'].branches.legislative.method.should.equal('unitary-propagated');
  });

  it('build log entry contains inputs, branches, and result', function () {
    const planet = makePlanet({ govCode: 0, authority: 'B', centralisation: 'F' });
    ROLL_CACHE.push(3, 4, 3, 4, 3, 4);
    assignStructure(planet);
    const e = planet.buildLog[0]['Government Structure'];
    e.should.have.property('inputs');
    e.should.have.property('branches');
    e.should.have.property('result');
    e.inputs.governmentCode.should.equal(0);
    e.inputs.authority.should.equal('B');
    e.inputs.centralisation.should.equal('F');
  });
});
