'use strict';

const chai = require('chai');
const TidalLockDetermination = require('../tidalLock/TidalLockDetermination');
const { clearCache, ROLL_CACHE } = require('../dice');

chai.should();

const makeBody = (overrides = {}) =>
  Object.assign(
    {
      orbit: 0.5,
      eccentricity: 0,
      axialTilt: 0,
      size: 5,
      atmosphere: { code: 7 },
      period: 100,
      rotation: 50,
      moons: [],
      buildLog: [],
    },
    overrides
  );

const findEntry = (body) => body.buildLog[0]['Tidal Lock Determination'];

describe('TidalLockDetermination confirmation reroll', function () {
  beforeEach(() => {
    clearCache();
  });

  it('applies a 1:1 lock when the auto-succeed confirmation roll is not a natural 12', function () {
    const body = makeBody();
    const det = new TidalLockDetermination(body, { mass: 1 }, 5);
    const caseResult = { name: 'planet-to-star', caseDMs: {}, commonDMs: {}, totalDM: 10, target: 'star', targetBody: null };

    ROLL_CACHE.push(2, 3); // confirmation roll = 5, not a natural 12

    det.apply(caseResult);

    body.tidalLock.should.equal('1:1');
    body.rotation.should.equal(100 * 24);
    const entry = findEntry(body);
    entry.lockConfirmation.should.deep.equal({ roll: 5, naturalTwelve: false });
  });

  it('downgrades an auto-succeed lock when the confirmation roll is a natural 12', function () {
    const body = makeBody();
    const det = new TidalLockDetermination(body, { mass: 1 }, 5);
    const caseResult = { name: 'planet-to-star', caseDMs: {}, commonDMs: {}, totalDM: 10, target: 'star', targetBody: null };

    ROLL_CACHE.push(6, 6, 1, 3); // confirmation roll = 12 (natural), free reroll (no DMs) = 4 -> day-stretch x2

    det.apply(caseResult);

    body.tidalLock.should.equal('day-stretch');
    body.rotation.should.equal(50 * 2);
    const entry = findEntry(body);
    entry.lockConfirmation.should.deep.equal({ roll: 12, naturalTwelve: true, freeReroll: 4 });
  });

  it('applies the same confirmation check when a normal roll reaches 12+', function () {
    const body = makeBody();
    const det = new TidalLockDetermination(body, { mass: 1 }, 5);
    const caseResult = { name: 'planet-to-star', caseDMs: {}, commonDMs: {}, totalDM: 5, target: 'star', targetBody: null };

    ROLL_CACHE.push(3, 4, 2, 3); // raw roll = 7 (+5 DM = 12), confirmation roll = 5, not a natural 12

    det.apply(caseResult);

    const entry = findEntry(body);
    entry.roll.should.deep.equal({ raw: 7, total: 12 });
    body.tidalLock.should.equal('1:1');
    entry.lockConfirmation.should.deep.equal({ roll: 5, naturalTwelve: false });
  });
});
