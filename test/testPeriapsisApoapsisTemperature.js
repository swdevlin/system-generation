'use strict';

const chai = require('chai');
const meanTemperature = require('../utils/meanTemperature');
const { periapsisTemperature, apoapsisTemperature } = require('../utils/meanTemperature');
const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');

chai.should();

function makePlanet(orbit, eccentricity) {
  const planet = new TerrestrialPlanet(6, orbit);
  planet.eccentricity = eccentricity;
  return planet;
}

describe('periapsisTemperature / apoapsisTemperature', function () {
  it('equal meanTemperature when eccentricity is 0', function () {
    const star = { hzco: 3 };
    const planet = makePlanet(3, 0);

    periapsisTemperature(star, planet).should.equal(meanTemperature(star, planet));
    apoapsisTemperature(star, planet).should.equal(meanTemperature(star, planet));
  });

  it('periapsis is hotter and apoapsis is colder than the mean for an eccentric orbit', function () {
    const star = { hzco: 3 };
    const planet = makePlanet(3, 0.5);

    const mean = meanTemperature(star, planet);
    const peri = periapsisTemperature(star, planet);
    const apo = apoapsisTemperature(star, planet);

    peri.should.be.above(mean);
    mean.should.be.above(apo);
  });
});
