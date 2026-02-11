'use strict';

const chai = require('chai');
const { clearCache, ROLL_CACHE } = require('../dice');
const subtypeLookup = require('../lookups/subtypeLookup');
const { expect } = require('chai');
chai.should();

describe('Subtype Lookup', function () {
  beforeEach(() => {
    clearCache();
  });

  it('Standard class/type', function () {
    const table = { 2: 0, 3: 1, 4: 3, 5: 5, 6: 7, 7: 9, 8: 8, 9: 6, 10: 4, 11: 2, 12: 0 };
    for (let roll of Object.keys(table)) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(parseInt(roll));
      let subtype = subtypeLookup({
        isPrimary: true,
        stellarType: 'K',
        stellarClass: 'V',
      });
      subtype.should.equal(table[roll]);
    }
  });

  it('Primary M-type', function () {
    const table = { 2: 8, 3: 6, 4: 5, 5: 4, 6: 0, 7: 2, 8: 1, 9: 3, 10: 5, 11: 7, 12: 9 };
    for (let roll of Object.keys(table)) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(parseInt(roll));
      let subtype = subtypeLookup({
        isPrimary: true,
        stellarType: 'M',
        stellarClass: 'V',
      });
      subtype.should.equal(table[roll]);
    }
  });

  it('Non-primary M uses standard table', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    let subtype = subtypeLookup({
      isPrimary: false,
      stellarType: 'M',
      stellarClass: 'V',
    });
    subtype.should.equal(7);
  });

  it('K IV stars are 0-4', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    let subtype = subtypeLookup({
      isPrimary: true,
      stellarType: 'K',
      stellarClass: 'IV',
    });
    subtype.should.equal(3);

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    subtype = subtypeLookup({
      isPrimary: true,
      stellarType: 'K',
      stellarClass: 'IV',
    });
    subtype.should.equal(0);
  });

  it('Pulsars are null', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    let subtype = subtypeLookup({
      isPrimary: true,
      stellarType: 'PSR',
      stellarClass: '',
    });
    expect(subtype).to.be.null;
  });
});
