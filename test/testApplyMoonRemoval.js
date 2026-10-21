'use strict';

const chai = require('chai');

const applyMoonRemoval = require('../moons/applyMoonRemoval');

chai.should();

describe('applyMoonRemoval', function () {
  it('passes moons through unchanged when hsml >= 1.5', function () {
    applyMoonRemoval({ hsml: 1.5, moons: 3, isMainWorldHost: false }).should.equal(3);
    applyMoonRemoval({ hsml: 5, moons: 0, isMainWorldHost: false }).should.equal(0);
  });

  it('zeroes a positive moon count when hsml is in [0.5, 1.5) and not a main world host', function () {
    // this is the regression the old `hsml < 1` threshold missed
    applyMoonRemoval({ hsml: 1.2, moons: 3, isMainWorldHost: false }).should.equal(0);
    applyMoonRemoval({ hsml: 0.5, moons: 1, isMainWorldHost: false }).should.equal(0);
    applyMoonRemoval({ hsml: 1.49, moons: 1, isMainWorldHost: false }).should.equal(0);
  });

  it('forces at least one moon when hsml is in [0.5, 1.5) and it is a main world host', function () {
    applyMoonRemoval({ hsml: 1.2, moons: 3, isMainWorldHost: true }).should.equal(3);
    applyMoonRemoval({ hsml: 1.2, moons: 0, isMainWorldHost: true }).should.equal(1);
    applyMoonRemoval({ hsml: 1.2, moons: -2, isMainWorldHost: true }).should.equal(1);
  });

  it('returns null (skip entirely) when hsml < 0.5 and not a main world host', function () {
    chai.expect(applyMoonRemoval({ hsml: 0.3, moons: 2, isMainWorldHost: false })).to.be.null;
  });

  it('passes moons through unchanged when hsml < 0.5 and it is a main world host', function () {
    applyMoonRemoval({ hsml: 0.3, moons: 2, isMainWorldHost: true }).should.equal(2);
  });
});
