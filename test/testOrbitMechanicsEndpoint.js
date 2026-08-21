'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const orbitMechanicsRouter = require('../service/orbitMechanics');

chai.use(chaiHttp);
chai.should();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.tenantId = 'test';
  req.logger = { info: () => {}, error: () => {} };
  next();
});
app.use('/orbit_mechanics', orbitMechanicsRouter);

const post = (body) => chai.request(app).post('/orbit_mechanics').send(body);

const buildTree = () => ({
  primaryStar: {
    orbitType: 0,
    orbit: 0,
    eccentricity: 0,
    inclination: 0,
    orbitPosition: { x: 0, y: 0 },
    hzcoDeviation: 0,
    stellarObjects: [
      {
        orbitType: 10,
        orbit: 3,
        eccentricity: 0.05,
        inclination: 10,
        orbitPosition: { x: 0, y: 0 },
        hzcoDeviation: 0,
        moons: [
          {
            orbit: 2,
            diameter: 1,
            eccentricity: 0.01,
            inclination: 1,
            orbitPosition: { x: 0, y: 0 },
            hzcoDeviation: 0,
          },
        ],
      },
      {
        orbitType: 4,
        orbit: 12,
        eccentricity: 0.15,
        inclination: 0,
        orbitPosition: { x: 0, y: 0 },
        hzcoDeviation: 0,
        stellarObjects: [
          {
            orbitType: 11,
            orbit: 2,
            eccentricity: 0.02,
            inclination: 5,
            orbitPosition: { x: 0, y: 0 },
            hzcoDeviation: 0,
            moons: [],
          },
        ],
      },
    ],
  },
});

describe('POST /orbit_mechanics', function () {
  this.timeout(10000);

  it('returns 400 when primaryStar is missing', function () {
    return post({}).then((res) => {
      res.should.have.status(400);
      res.body.should.have.property('error');
    });
  });

  it('recalculates orbitPosition for every descendant node', function () {
    return post(buildTree()).then((res) => {
      res.should.have.status(200);
      const { primaryStar } = res.body;

      primaryStar.orbitPosition.should.deep.equal({ x: 0, y: 0 });

      const gasGiant = primaryStar.stellarObjects[0];
      gasGiant.orbitPosition.should.not.deep.equal({ x: 0, y: 0 });
      gasGiant.moons[0].orbitPosition.should.not.deep.equal({ x: 0, y: 0 });

      const companionStar = primaryStar.stellarObjects[1];
      companionStar.orbitPosition.should.not.deep.equal({ x: 0, y: 0 });
      companionStar.stellarObjects[0].orbitPosition.should.not.deep.equal({ x: 0, y: 0 });
    });
  });
});