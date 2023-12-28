"use strict";

const chai = require('chai');

const Star = require("../stars/star");
const StellarClassification = require("../stars/StellarClassification");
const {ORBIT_TYPES} = require("../utils");

chai.should();

describe("Star tests", function () {
  const planetSize = 7;
  it("test luminosity", function() {
    const classification = new StellarClassification();
    classification.stellarClass = 'V';
    classification.stellarType = 'F';
    classification.subtype = 0;
    const star = new Star(classification, ORBIT_TYPES.PRIMARY);
    const luminosity = star.luminosity;
    luminosity.should.be.approximately((star.diameter ** 2) * ((star.temperature / 5772) ** 4), 0.01);
  });

});
