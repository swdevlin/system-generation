'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const starportCapacityRouter = require('../service/starportCapacity');

chai.use(chaiHttp);
chai.should();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.tenantId = 'test';
  req.logger = { info: () => {}, error: () => {} };
  next();
});
app.use('/starport', starportCapacityRouter);

const post = (body) => chai.request(app).post('/starport').send(body);

const VALID_BODY = {
  starPort: 'A',
  populationCode: 8,
  censusPopulation: 10000000,
  importance: 3,
  efficiency: 0,
  infrastructure: 5,
  techLevel: 10,
  industrial: false,
};

describe('POST /starport', function () {
  it('returns a full starportCapacity object for a valid request', async function () {
    const res = await post(VALID_BODY);
    res.should.have.status(200);
    res.body.should.have.all.keys(
      'hasHighport',
      'highport',
      'downport',
      'internalBayCapacity',
      'shipyardCapability',
      'shipyardBuildCapacity',
      'annualShipyardOutput'
    );
  });

  it('accepts a flat body with no nested objects required', async function () {
    const res = await post(VALID_BODY);
    res.should.have.status(200);
    Object.keys(VALID_BODY).forEach((key) => {
      res.body.should.not.have.property(key);
    });
  });

  it('returns an empty object for an unpopulated world', async function () {
    const res = await post({ ...VALID_BODY, populationCode: 0 });
    res.should.have.status(200);
    res.body.should.deep.equal({});
  });

  it('computes an industrial DM from a boolean flag, not an atmosphere digit', async function () {
    const res = await post({ ...VALID_BODY, populationCode: 9, industrial: true });
    res.should.have.status(200);
    res.body.shipyardBuildCapacity.should.be.a('number');
  });

  describe('validation', function () {
    it('rejects a missing starPort', async function () {
      const { starPort, ...body } = VALID_BODY;
      const res = await post(body);
      res.should.have.status(400);
    });

    it('rejects an invalid starPort', async function () {
      const res = await post({ ...VALID_BODY, starPort: 'Z' });
      res.should.have.status(400);
    });

    it('rejects a populationCode out of range', async function () {
      const res = await post({ ...VALID_BODY, populationCode: 16 });
      res.should.have.status(400);
    });

    it('rejects a non-integer censusPopulation', async function () {
      const res = await post({ ...VALID_BODY, censusPopulation: 1.5 });
      res.should.have.status(400);
    });

    it('rejects an efficiency out of range', async function () {
      const res = await post({ ...VALID_BODY, efficiency: 6 });
      res.should.have.status(400);
    });

    it('rejects a missing industrial flag', async function () {
      const { industrial, ...body } = VALID_BODY;
      const res = await post(body);
      res.should.have.status(400);
    });
  });
});
