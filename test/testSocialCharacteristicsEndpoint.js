'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const socialCharacteristicsRouter = require('../service/socialCharacteristics');

chai.use(chaiHttp);
chai.should();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.tenantId = 'test';
  req.logger = { info: () => {}, error: () => {} };
  next();
});
app.use('/social_characteristics', socialCharacteristicsRouter);

const post = (body) => chai.request(app).post('/social_characteristics').send(body);

function makeSystem({ habitabilityRating = 8, resourceRating = 5, hzcoDeviation = 0.3, moons = [] } = {}) {
  return {
    primaryStar: {
      stellarObjects: [
        {
          orbitType: 11,
          hzcoDeviation,
          habitabilityRating,
          resourceRating,
          population: { code: 0 },
          government: { code: 0 },
          lawLevel: { code: 0 },
          techLevel: 0,
          starPort: 'X',
          starport: 'X',
          size: 6,
          atmosphere: { code: 6 },
          hydrographics: { code: 5 },
          moons,
        },
      ],
    },
  };
}

describe('POST /social_characteristics', function () {
  this.timeout(10000);

  describe('fixed values', function () {
    it('assigns fixed government, law level, and tech level', function () {
      return post({
        system: makeSystem(),
        population: { min: 6, max: 6 },
        government: 3,
        lawLevel: 4,
        techLevel: { min: 9, max: 9 },
      }).then((res) => {
        res.should.have.status(200);
        res.body.world.government.code.should.equal(3);
        res.body.world.lawLevel.code.should.equal(4);
        res.body.world.techLevel.should.equal(9);
      });
    });

    it('returns the path to the selected world', function () {
      return post({
        system: makeSystem(),
        population: {},
      }).then((res) => {
        res.should.have.status(200);
        res.body.path.should.equal('primaryStar.stellarObjects[0]');
      });
    });
  });

  describe('population range', function () {
    it('result stays within min/max bounds across many rolls', function () {
      const requests = Array.from({ length: 20 }, () =>
        post({ system: makeSystem(), population: { min: 5, max: 8 } })
      );
      return Promise.all(requests).then((results) => {
        for (const res of results) {
          res.should.have.status(200);
          res.body.world.population.code.should.be.at.least(5);
          res.body.world.population.code.should.be.at.most(8);
        }
      });
    });

    it('applies only min when max is omitted', function () {
      const requests = Array.from({ length: 20 }, () =>
        post({ system: makeSystem(), population: { min: 6 } })
      );
      return Promise.all(requests).then((results) => {
        for (const res of results) {
          res.should.have.status(200);
          res.body.world.population.code.should.be.at.least(6);
        }
      });
    });

    it('applies only max when min is omitted', function () {
      const requests = Array.from({ length: 20 }, () =>
        post({ system: makeSystem(), population: { max: 4 } })
      );
      return Promise.all(requests).then((results) => {
        for (const res of results) {
          res.should.have.status(200);
          res.body.world.population.code.should.be.at.most(4);
        }
      });
    });

    it('rolls freely when both min and max are omitted', function () {
      return post({ system: makeSystem(), population: {} }).then((res) => {
        res.should.have.status(200);
        res.body.world.population.code.should.be.a('number').and.at.least(0);
      });
    });
  });

  describe('tech level range', function () {
    it('result stays within min/max bounds across many rolls', function () {
      const requests = Array.from({ length: 20 }, () =>
        post({ system: makeSystem(), population: { min: 6, max: 6 }, techLevel: { min: 8, max: 12 } })
      );
      return Promise.all(requests).then((results) => {
        for (const res of results) {
          res.should.have.status(200);
          res.body.world.techLevel.should.be.at.least(8);
          res.body.world.techLevel.should.be.at.most(12);
        }
      });
    });

    it('applies only min when max is omitted', function () {
      const requests = Array.from({ length: 20 }, () =>
        post({ system: makeSystem(), population: {}, techLevel: { min: 8 } })
      );
      return Promise.all(requests).then((results) => {
        for (const res of results) {
          res.should.have.status(200);
          res.body.world.techLevel.should.be.at.least(8);
        }
      });
    });

    it('rolls freely when techLevel is omitted entirely', function () {
      return post({ system: makeSystem(), population: {} }).then((res) => {
        res.should.have.status(200);
        res.body.world.techLevel.should.be.a('number');
      });
    });
  });

  describe('omitted optional fields', function () {
    it('rolls government, law level, and tech level when omitted', function () {
      return post({ system: makeSystem(), population: { min: 5, max: 5 } }).then((res) => {
        res.should.have.status(200);
        res.body.world.government.code.should.be.a('number').and.at.least(0);
        res.body.world.lawLevel.code.should.be.a('number').and.at.least(0);
        res.body.world.techLevel.should.be.a('number');
        res.body.world.starPort.should.be.a('string').and.have.length(1);
      });
    });
  });

  describe('mainWorldCriteria', function () {
    it('"habitable" selects the terrestrial with highest habitabilityRating', function () {
      const system = {
        primaryStar: {
          stellarObjects: [
            { orbitType: 11, hzcoDeviation: 0.2, habitabilityRating: 3, resourceRating: 8, population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 6, atmosphere: { code: 6 }, hydrographics: { code: 5 }, moons: [] },
            { orbitType: 11, hzcoDeviation: 0.5, habitabilityRating: 9, resourceRating: 2, population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 6, atmosphere: { code: 6 }, hydrographics: { code: 5 }, moons: [] },
          ],
        },
      };
      return post({ system, population: {}, mainWorldCriteria: 'habitable' }).then((res) => {
        res.should.have.status(200);
        res.body.path.should.equal('primaryStar.stellarObjects[1]');
      });
    });

    it('"habitableAndResource" selects the terrestrial with highest combined score', function () {
      const system = {
        primaryStar: {
          stellarObjects: [
            { orbitType: 11, hzcoDeviation: 0.2, habitabilityRating: 9, resourceRating: 1, population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 6, atmosphere: { code: 6 }, hydrographics: { code: 5 }, moons: [] },
            { orbitType: 11, hzcoDeviation: 0.5, habitabilityRating: 5, resourceRating: 8, population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 6, atmosphere: { code: 6 }, hydrographics: { code: 5 }, moons: [] },
          ],
        },
      };
      // stellarObjects[0] scores 10, stellarObjects[1] scores 13 → index 1 wins
      return post({ system, population: {}, mainWorldCriteria: 'habitableAndResource' }).then((res) => {
        res.should.have.status(200);
        res.body.path.should.equal('primaryStar.stellarObjects[1]');
      });
    });

    it('"resource" selects a planetoid belt when it has the highest resource rating', function () {
      const system = {
        primaryStar: {
          stellarObjects: [
            { orbitType: 11, hzcoDeviation: 0.3, habitabilityRating: 7, resourceRating: 3, population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 6, atmosphere: { code: 6 }, hydrographics: { code: 5 }, moons: [] },
            { orbitType: 12, hzcoDeviation: 1.0, resourceRating: 9, significantBodies: [], population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 0, atmosphere: { code: 0 }, hydrographics: { code: 0 }, moons: [] },
          ],
        },
      };
      return post({ system, population: {}, mainWorldCriteria: 'resource' }).then((res) => {
        res.should.have.status(200);
        res.body.path.should.equal('primaryStar.stellarObjects[1]');
      });
    });

    it('"habitable" excludes planetoid belts even with high resource rating', function () {
      const system = {
        primaryStar: {
          stellarObjects: [
            { orbitType: 11, hzcoDeviation: 0.3, habitabilityRating: 4, resourceRating: 3, population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 6, atmosphere: { code: 6 }, hydrographics: { code: 5 }, moons: [] },
            { orbitType: 12, hzcoDeviation: 0.1, resourceRating: 15, significantBodies: [], population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 0, atmosphere: { code: 0 }, hydrographics: { code: 0 }, moons: [] },
          ],
        },
      };
      return post({ system, population: {}, mainWorldCriteria: 'habitable' }).then((res) => {
        res.should.have.status(200);
        res.body.path.should.equal('primaryStar.stellarObjects[0]');
      });
    });

    it('selects a moon with higher habitabilityRating over a terrestrial with lower', function () {
      const moon = {
        orbitType: 11,
        size: 5,
        hzcoDeviation: 0.4,
        habitabilityRating: 10,
        resourceRating: 4,
        population: { code: 0 },
        government: { code: 0 },
        lawLevel: { code: 0 },
        techLevel: 0,
        starPort: 'X',
        starport: 'X',
        atmosphere: { code: 6 },
        hydrographics: { code: 5 },
        moons: [],
      };
      const system = {
        primaryStar: {
          stellarObjects: [
            { orbitType: 11, hzcoDeviation: 0.2, habitabilityRating: 2, resourceRating: 3, population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 6, atmosphere: { code: 6 }, hydrographics: { code: 5 }, moons: [] },
            { orbitType: 10, hzcoDeviation: 0.5, moons: [moon] },
          ],
        },
      };
      return post({ system, population: {}, mainWorldCriteria: 'habitable' }).then((res) => {
        res.should.have.status(200);
        res.body.path.should.equal('primaryStar.stellarObjects[1].moons[0]');
      });
    });

    it('non-moon beats moon at equal score', function () {
      const moon = {
        orbitType: 11,
        size: 5,
        hzcoDeviation: 0.5,
        habitabilityRating: 7,
        resourceRating: 4,
        population: { code: 0 },
        government: { code: 0 },
        lawLevel: { code: 0 },
        techLevel: 0,
        starPort: 'X',
        starport: 'X',
        atmosphere: { code: 6 },
        hydrographics: { code: 5 },
        moons: [],
      };
      const system = {
        primaryStar: {
          stellarObjects: [
            { orbitType: 11, hzcoDeviation: 0.5, habitabilityRating: 7, resourceRating: 4, population: { code: 0 }, government: { code: 0 }, lawLevel: { code: 0 }, techLevel: 0, starPort: 'X', starport: 'X', size: 6, atmosphere: { code: 6 }, hydrographics: { code: 5 }, moons: [] },
            { orbitType: 10, hzcoDeviation: 0.5, moons: [moon] },
          ],
        },
      };
      return post({ system, population: {}, mainWorldCriteria: 'habitable' }).then((res) => {
        res.should.have.status(200);
        res.body.path.should.equal('primaryStar.stellarObjects[0]');
      });
    });
  });

  describe('no valid world', function () {
    it('returns 422 when no candidates match the criteria', function () {
      const system = {
        primaryStar: {
          stellarObjects: [
            { orbitType: 10, hzcoDeviation: 0.5, moons: [] },
          ],
        },
      };
      return post({ system, population: {} }).then((res) => {
        res.should.have.status(422);
        res.body.error.should.equal('No valid main world found for criteria');
      });
    });
  });

  describe('validation', function () {
    it('returns 400 when system is missing', function () {
      return post({ population: {} }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('system is required and must be an object');
      });
    });

    it('returns 400 when system.primaryStar.stellarObjects is missing', function () {
      return post({ system: { primaryStar: {} }, population: {} }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('system.primaryStar.stellarObjects must be an array');
      });
    });

    it('returns 400 when population is missing', function () {
      return post({ system: makeSystem() }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('population is required and must be an object');
      });
    });

    it('returns 400 when population is not an object', function () {
      return post({ system: makeSystem(), population: 6 }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('population is required and must be an object');
      });
    });

    it('returns 400 when population min exceeds maximum possible roll', function () {
      return post({ system: makeSystem(), population: { min: 11 } }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('population min cannot exceed 10');
      });
    });

    it('returns 400 when population min is negative', function () {
      return post({ system: makeSystem(), population: { min: -1 } }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('population min must be a non-negative integer');
      });
    });

    it('returns 400 when population range min exceeds max', function () {
      return post({ system: makeSystem(), population: { min: 7, max: 3 } }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('population.min must not exceed population.max');
      });
    });

    it('returns 400 when government is out of range', function () {
      return post({ system: makeSystem(), population: {}, government: -1 }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('government must be at least 0');
      });
    });

    it('returns 400 when lawLevel is negative', function () {
      return post({ system: makeSystem(), population: {}, lawLevel: -1 }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('lawLevel must be at least 0');
      });
    });

    it('returns 400 when techLevel is not an object', function () {
      return post({ system: makeSystem(), population: {}, techLevel: 9 }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('techLevel must be an object');
      });
    });

    it('returns 400 when techLevel min is negative', function () {
      return post({ system: makeSystem(), population: {}, techLevel: { min: -1 } }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('techLevel min must be a non-negative integer');
      });
    });

    it('returns 400 when techLevel range min exceeds max', function () {
      return post({ system: makeSystem(), population: {}, techLevel: { min: 10, max: 5 } }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('techLevel.min must not exceed techLevel.max');
      });
    });

    it('returns 400 when mainWorldCriteria is invalid', function () {
      return post({ system: makeSystem(), population: {}, mainWorldCriteria: 'bogus' }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('mainWorldCriteria must be one of: habitable, habitableAndResource, resource');
      });
    });

    it('returns 400 when allowCaptiveGovernment is not boolean', function () {
      return post({ system: makeSystem(), population: {}, allowCaptiveGovernment: 'yes' }).then((res) => {
        res.should.have.status(400);
        res.body.error.should.equal('allowCaptiveGovernment must be a boolean');
      });
    });
  });
});